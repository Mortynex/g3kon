import { t18 } from '../src';

describe('index', () => {
  describe('t18', () => {
    it('should translate key to message', () => {
      const message = 'Hello World!';

      const translations = new t18({
        translations: {
          general: {
            hello_word: 'Hello World!',
          },
        },
      });

      expect(translations.t('general.hello_word')).toMatch(message);
    });

    it('should return welcome message with name', () => {
      const message = (name: string) => `Welcome ${name}!`;
      const name = 'Bob';

      const translations = new t18({
        translations: {
          messages: {
            welcome: message,
          },
        },
      });

      expect(translations.t('messages.welcome', [name])).toMatch(message(name));
    });
  });
});
