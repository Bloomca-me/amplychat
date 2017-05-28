import { sendMessage } from '../../store';

export const NewMessage = {
  template: `
    <div>
      <input v-model="message" type="text" />
      <button v-on:click="send">
        Send your message!
      </button>
    </div>
  `,
  data: () => ({
    message: '',
  }),
  methods: {
    send() {
      sendMessage((this as any).message);
      (this as any).message = '';
    }
  },
};