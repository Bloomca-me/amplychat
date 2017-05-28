import Vue = require('vue');
import { NewMessage } from './components/newMessages';
import { Languages } from './components/languages';
import { store } from './store';

new Vue({
  el: '#app',
  data: () => store,
  components: {
    'new-message': NewMessage,
    'choose-language': Languages,
  },
  methods: {
    wasYou(item) {
      return item.id === 'you';
    },
  },
  template: `
    <div>
      <div>
        Your status:
        <div v-if="connected">
          You are connected
        </div>
        <div v-else>
          You are not connected
        </div>
      </div>
      <choose-language></choose-language>
      <ul>
        <li v-for="item in messages">
          <span v-if="wasYou(item)">
            You said:
          </span>
          <span v-else>
            Your interlocutor said:
          </span>
          {{ item.message }}
        </li>
      </ul>
      <new-message></new-message>
    </div>
  `,
});