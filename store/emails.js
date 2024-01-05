// store/emails.js

import { defineStore } from 'pinia';

export const useEmailsStore = defineStore({
  id: 'emails',
  state: () => ({
    emails: [],
  }),
  actions: {
    async fetchEmails() {
      try {
        const response = await fetch('https://659265b3bb129707198faf38.mockapi.io/api/v1/list/emails');
        this.emails = await response.json();
        console.log(this.emails )
      } catch (error) {
        console.error('Error fetching emails:', error);
      }
    },
  },
});
