<template>
  <div class="modal" v-if="isModalOpen" @click.self="closeModal()">
    <div class="modal-content">

      <div class="modal__options">
        <button
            class="modal__options button p-0"
            @click="closeModal()"
        >
          <CloseIcon class="options__icon"/>
          <span>Close (Esc)</span>
        </button>
        <div class=" modal__options right">
          <button
              class="modal__options button"
              @click="emailAction('read')"
          >
            <ArchiveIcon class="options__icon"/>
            <span class="text">Mark as Read (r)</span>
          </button>
          <button
              class="modal__options button"
               @click="emailAction('archived')"
          >
            <TrashIcon class="options__icon"/>
            <span class="text">Archive (a)</span>
          </button>
        </div>
      </div>
      <h2 class="capitalize">{{ selectedEmail.subject }}</h2>
      <p>
        {{ selectedEmail.body }}
      </p>
    </div>
  </div>
</template>

<script>
import {useModalStore} from '~/store/modal';
import ArchiveIcon from "assets/icons/ArchiveIcon.vue";
import TrashIcon from "assets/icons/TrashIcon.vue";
import CloseIcon from "assets/icons/CloseIcon.vue";

export default {
  emits: ['emailAction'],
  components: {CloseIcon, TrashIcon, ArchiveIcon},
  computed: {
    isModalOpen() {
      return useModalStore().isOpen;
    },
    selectedEmail() {
      return useModalStore().selectedEmail;
    },
  },
  methods: {
    closeModal() {
      useModalStore().closeModal();
    },
    emailAction(action) {
      this.$emit('emailAction', action, this.selectedEmail.id);
    }
  },
};
</script>

<style lang="scss">

.modal__options {
  display: flex;
  margin-bottom: 10px;

  .right {
    position: absolute;
    right: 0;
  }

  .button {
    color: #4B5563;
    background: transparent;
    font-weight: bold;
    border: none;
    border-radius: 54px;
    text-align: left;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .options__icon {
    margin-right: 12px;
  }
}

.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
  transition: .5s ease;
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 50%;
  height: 100vh;
  float: right;
}

.close__btn {
  cursor: pointer;

  .close {
    color: #aaaaaa;
    margin-right: 10px;
    font-size: 25px;
    font-weight: bold;
  }
}


</style>


