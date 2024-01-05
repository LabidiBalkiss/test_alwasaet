<template>
  <div class="modal" v-if="isModalOpen">
    <div class="modal-content">
      <div @click="closeModal()"><span class="close">&times;</span> <span>Close (Esc)</span></div>
      <h2 class="capitalize">{{ selectedEmail.subject }}</h2>
      <p>
        {{ selectedEmail.body }}
      </p>
    </div>
  </div>
</template>

<script>
import {useModalStore} from '~/store/modal';

export default {
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
  },
};
</script>

<style lang="scss">
.capitalize {
  text-transform: capitalize;
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

.close {
  color: #aaaaaa;
  margin-right: 10px;
  font-size: 25px;
  font-weight: bold;
}
</style>


