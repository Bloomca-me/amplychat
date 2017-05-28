import * as styles from './style.sass';
import { chooseLanguage } from '../../store';

export const Languages = {
  data() {
    return {
      languages: [
        { text: 'Русский', code: 'ru' },
        { text: 'English', code: 'en' },
        { text: 'Deutsch', code: 'de' },
        { text: 'Français', code: 'fr' }
      ]
    };
  },
  template: `
    <div class="${styles.container}">
      <ul>
        <li v-for="language in languages" v-on:click="chooseLanguage(language.code)">
          {{ language.text }}
        </li>
      </ul>
    </div>
  `,
  methods: {
    chooseLanguage(code: string) {
      chooseLanguage(code);
    }
  },
};