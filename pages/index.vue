<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo-section">
        <Logo class="icon"/>
      </div>
      <!-- Top buttons -->
      <button
          class="sidebar__button sidebar__inbox"
          :class="{ 'selected': selectedListTitle === 0 }"
          @click="selectList(0)"
      >
        <IconInbox class="icon"/>
        <span class="text">Inbox</span>
        <span class="badge">{{ inbox_mails.length }}</span>
      </button>

      <button
          class="sidebar__button sidebar__archive"
          :class="{ 'selected': selectedListTitle === 1 }"
          @click="selectList(1)"
      >
        <IconArchive class="icon"/>
        <span class="text">Archive</span>
        <span class="badge">{{ archived_mails.length }}</span>
      </button>

      <!-- Bottom Logout button -->
      <button class="sidebar__button sidebar__logout">
        <IconLogout class="icon"/>
        <span class="text">Logout</span>
      </button>
    </aside>

    <div class="content">
      <!-- Content area -->
      <div class="header">
        <h1 class="content__title">{{ pageTitle }}</h1>
        <div class="options">
          <label class="checkbox-label">
            <input type="checkbox" v-model="selectAll" @change="selectAllEmails"/>
            <strong class="ml_12">Email Selected ({{ selectedEmails.length }})</strong>
          </label>
          <div class="options__right">
            <button
                class="options__button"
                @click="emailAction('read', null)"
            >
              <ArchiveIcon class="options__icon"/>
              <span class="text">Mark as Read (r)</span>
            </button>
            <button
                class="options__button"
                @click="emailAction('archived', null)"
            >
              <TrashIcon class="options__icon"/>
              <span class="text">Archive (a)</span>
            </button>
          </div>
        </div>
      </div>
      <ul class="content__list">
        <Loader v-if="loading"></Loader>
        <li v-else v-for="email in emails" :key="email.id"
            :class="{ 'content__item': true, 'marked-as-read': email.read }">
          <div class="flex__display cursor__pointer">
            <label class="checkbox-label content__checklist">
              <input type="checkbox" @click="selectEmail(email)"
                     :checked="selectedEmails.includes(parseId(email.id))"/>
            </label>
            <strong @click="openModal(email)" class="capitalize mt_5">{{ email.subject }} {{ email.id }}</strong>
          </div>
          <div class="separator"></div>
        </li>
      </ul>
    </div>
    <EmailModal :email="selectedEmail" :isOpen="isModalOpen" @close="closeModal" @emailAction="emailAction"/>
  </div>
</template>

<script>
import Logo from "assets/icons/Logo.vue";
import IconLogout from "assets/icons/LogoutIcon.vue";
import IconInbox from "assets/icons/InboxIcon.vue";
import IconArchive from "assets/icons/ArchiveIcon.vue";
import {ref, onMounted} from 'vue';
import {useEmailsStore} from '~/store/emails';
import {useModalStore} from '~/store/modal';
import TrashIcon from "assets/icons/TrashIcon.vue";
import ArchiveIcon from "assets/icons/ArchiveIcon.vue";
import {computed} from 'vue'
import Loader from "~/components/Loader.vue";

export default {
  components: {
    ArchiveIcon,
    TrashIcon,
    Logo,
    IconLogout,
    IconInbox,
    IconArchive,
    Loader,
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeyDown);
  },

  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  },
  setup() {
    const emailsStore = useEmailsStore();
    const loading = ref(true);
    onMounted(async () => {
      await emailsStore.fetchEmails();
      loading.value = false;
    });
    const all_emails = computed({
      get() {
        return emailsStore.emails
      },
      set(obj) {
        emailsStore.emails = obj
      }
    })
    return {loading, all_emails}
  },
  data() {
    return {
      pageTitle: 'Inbox',
      selectedListTitle: 0,
      selectedEmails: [],
      selectAll: false
    }
  },
  computed: {
    selectedEmail() {
      return useModalStore().selectedEmail;
    },
    isModalOpen() {
      return useModalStore().isOpen;
    },
    archived_mails() {
      return this.all_emails.filter(email => email.archived)
    },
    inbox_mails() {
      return this.all_emails.filter(email => !email.archived)
    },
    emails() {
      return this.selectedListTitle === 1 ? this.archived_mails : this.inbox_mails;
    },
  },
  methods: {
    handleKeyDown(event) {
      if (event.key === 'a') {
        this.emailAction('archived', null);
      }
      if (event.key === 'r') {
        this.emailAction('read', null);
      }
    },
    parseId(id) {
      return parseInt(id, 10)
    },
    selectEmail(email) {
      const id = this.parseId(email.id);
      const index = this.selectedEmails.indexOf(id);
      if (index !== -1) {
        this.selectedEmails = this.selectedEmails.filter(selectedId => selectedId !== id);
      } else {
        this.selectedEmails.push(id);
      }
    },
    openModal(email) {
      useModalStore().openModal(email);
      this.emailAction('read', email.id)
    },
    closeModal() {
      useModalStore().closeModal();
    },
    selectList(index) {
      const titles = {0: 'Inbox', 1: 'Archive'};
      this.pageTitle = titles[index];
      this.selectedListTitle = index;
    },
    selectAllEmails() {
      this.selectedEmails = [];
      if (this.selectAll) {
        for (const [key, email] of Object.entries(this.emails)) {
          this.selectEmail(email)
        }
      }
    },
    emailAction(action, id) {
      this.emails.forEach(email => {
        if (id && email.id === id) {
          email[action] = true;
        } else if (this.selectedEmails.includes(this.parseId(email.id))) {
          email[action] = true;
        }
      });
      this.selectAll = false
      this.selectedEmails = []
    }
  }
}
</script>

<style lang="scss">

.layout {
  display: flex;
  height: 100vh;
}

.options__right {
  display: flex;
  margin-top: 10px;
  right: 32px;
  position: fixed;
}

.sidebar {
  width: 200px;
  background-color: #F8FAFC;
  border-right: 1px #E5E7EB solid;
  padding: 20px 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.logo-section {
  padding: 0 24px 32px 24px;
}

.text {
  display: inline-block;
}

.options__button {
  color: #4B5563;
  background: transparent;
  font-weight: bold;
  border: none;
  border-radius: 54px;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left: 40px;

  .text {
    margin-left: 12px !important;
  }
}

.sidebar__button {
  padding: 12px 24px;
  color: #4B5563;
  font-weight: bold;
  border: none;
  border-radius: 54px;
  text-align: left;
  cursor: pointer;
  margin-bottom: 10px;
  display: flex;
  align-items: center;

  &.sidebar__inbox {
    background-color: rgba(238, 238, 238, 0);
  }

  &.sidebar__archive {
    background-color: rgba(238, 238, 238, 0);
  }

  &.sidebar__logout {
    background-color: rgba(238, 238, 238, 0);
    margin-top: auto;
  }

  &.selected {
    background-color: #D6E2FB;
    color: black;
  }

  .icon {
    margin-right: 8px;
  }

  .text {
    flex: 1;
  }

  .badge {
    margin-left: 8px;
  }
}

.content {
  flex: 1;
  padding: 0 0 32px !important;
  height: 100%;
  overflow: auto;
}

.content__title {
  font-size: 24px;
  margin-bottom: 20px;
}

.content__list {
  margin-top: 12%;
  list-style: none;
  padding: 0;
  padding-left: 32px !important;
}

.content__item {
  margin-bottom: 10px;
  transition: opacity 0.3s;
}

.marked-as-read {
  color: darkgrey;
}

.options {
  display: flex;
  margin-bottom: 20px;
}

.checkbox-label {
  display: flex;
  align-items: center;
}

.content__checklist {
  display: flex;
  align-items: center;

  input {
    margin-right: 20px;
  }
}

.separator {
  height: 1px;
  width: 102%;
  background-color: #ddd;
  margin: 24px 0;
  margin-left: -35px !important;
}

</style>
