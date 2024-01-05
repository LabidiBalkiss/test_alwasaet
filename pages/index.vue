<template>
  <div class="layout">
    <aside class="sidebar">

      <div class="logo-section">
        <Logo class="icon"/>
      </div>
      <!-- Top buttons -->
      <button
          class="sidebar__button sidebar__inbox"
          :class="{ 'selected': selectedList === 0 }"
          @click="selectList(0)"
      >
        <IconInbox class="icon"/>
        <span class="text">Inbox</span>
        <span class="badge">{{ emails.length }}</span>
      </button>

      <button
          class="sidebar__button sidebar__archive"
          :class="{ 'selected': selectedList === 1 }"
          @click="selectList(1)"
      >
        <IconArchive class="icon"/>
        <span class="text">Archive</span>
        <span class="badge">2</span>
      </button>

      <!-- Bottom Logout button -->
      <button class="sidebar__button sidebar__logout">
        <IconLogout class="icon"/>
        <span class="text">Logout</span>
      </button>
    </aside>

    <div class="content">
      <!-- Content area -->
      <h1 class="content__title">{{ pageTitle }}</h1>
      <div class="options">
        <label class="checkbox-label">
          <input type="checkbox" v-model="selectAll" @change="selectAllEmails"/>
          Email Selected ({{ selectedCount }})
        </label>
        <button class="action-button" @click="markAsRead">Mark as Read (r)</button>
        <button class="action-button" @click="archiveEmails">Archive (a)</button>
      </div>
      <ul class="content__list">
        <li v-for="email in emails" :key="email.id" class="content__item" @click="openModal(email)">
          <label class="checkbox-label content__checklist">
            <input type="checkbox" v-model="selectedEmails"/>
            <strong>{{ email.subject }}</strong> <!-- Bold label -->
          </label>
          <div class="separator"></div>
        </li>
      </ul>
    </div>
    <EmailModal :email="selectedEmail" :isOpen="isModalOpen" @close="closeModal" />
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


export default {
  components: {
    Logo,
    IconLogout,
    IconInbox,
    IconArchive,
  },
  setup() {
    const emailsStore = useEmailsStore();

    onMounted(async () => {
      await emailsStore.fetchEmails();
    });
    const emails = emailsStore.emails;
    return {emails}
  },
  data() {
    return {
      pageTitle: 'Inbox',
      selectedList: 0,
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
  },
  methods: {
    openModal(email) {
      useModalStore().openModal(email);
    },
    closeModal() {
      useModalStore().closeModal();
    },
    selectList(index) {
      const titles = {0: 'Inbox', 1: 'Archive'};
      this.pageTitle = titles[index];
      this.selectedList = index;

    },
    selectAllEmails() {
      if (this.selectAll) {
        this.selectedEmails.value = this.emails.map((_, index) => index);
      } else {
        this.selectedEmails.value = [];
      }
    },
    markAsRead() {
      // Your implementation here
    },
    archiveEmails() {
      // Your implementation here
    },
  }
}
</script>

<style lang="scss">

body {
  margin: 0;
}

.layout {
  display: flex;
  height: 100vh;
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

.sidebar__menu {
  list-style: none;
  padding: 0;
}

.sidebar__item {
  margin-bottom: 10px;
  cursor: pointer;
  color: #fff;
}

.content {
  flex: 1;
  padding: 20px;
  height: 100%;
  overflow: auto;
}

.content__title {
  font-size: 24px;
  margin-bottom: 20px;
}

.content__list {
  list-style: none;
  padding: 0;
}

.content__item {
  margin-bottom: 10px;
}

.options {
  display: flex;
  margin-bottom: 20px;
}

.checklist-options {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.left-options {
  display: flex;
  align-items: center;
}

.right-options {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
}

.action-button {
  margin-left: 10px;
  background: transparent;
  color: #4B5563;
  font-weight: 500;
  font-size: 14px;
  border: none;
}

.content__title-separator {
  font-weight: bold;
  margin-bottom: 10px;
}

.content__checklist {
  display: flex;
  align-items: center;
}

.separator {
  height: 1px;
  width: 100%;
  background-color: #ddd;
  margin: 24px 0;
}

input[type="checkbox" i] {
  width: 16px !important;
  height: 16px !important;
}
</style>
