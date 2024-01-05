// store/modal.js
import { defineStore } from 'pinia';

export const useModalStore = defineStore('modal', {
  state: () => ({
    isOpen: false,
    selectedEmail: null,
  }),
  actions: {
    openModal(email) {
      this.isOpen = true;
      this.selectedEmail = email;
    },
    closeModal() {
      this.isOpen = false;
      this.selectedEmail = null;
    },
  },
});
