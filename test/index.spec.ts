import { t18 } from '../src';

describe('index', () => {
	describe('t18', () => {
		it('should translate key to message', () => {
			const message = 'Hello World!';

			const translations = new t18({
				translations: [
					{
						language: 'en',
						translation: {
							general: {
								hello_world: message,
							},
						},
					},
				],
			});

			expect(translations.t('general.hello_world')).toBe(message);
		});

		it('it should be able to change languages ', () => {
			const messageEn = 'Hello World!';
			const messageEs = 'Hola Mundo!';
			const messageIt = 'Ciao Mondo!';

			const translations = new t18({
				translations: [
					{
						language: 'en',
						translation: {
							general: {
								hello_world: messageEn,
							},
						},
						default: true,
					},
					{
						language: 'es',
						translation: {
							general: {
								hello_world: messageEs,
							},
						},
					},
					{
						language: 'it',
						translation: {
							general: {
								hello_world: messageIt,
							},
						},
					},
				],
			});

			expect(translations.t('general.hello_world')).toBe(messageEn);
			translations.changeLanguage('es');
			expect(translations.t('general.hello_world')).toBe(messageEs);
			translations.changeLanguage('it');
			expect(translations.t('general.hello_world')).toBe(messageIt);
		});

		it('should return welcome message with name', () => {
			const message = (name: string) => `Welcome ${name}!`;
			const name = 'Bob';

			const translations = new t18({
				translations: [
					{
						language: 'en',
						translation: {
							general: {
								welcome: message,
							},
						},
					},
				],
			});

			expect(translations.t('general.welcome', [name])).toMatch(message(name));
		});
	});
});
