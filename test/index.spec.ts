import { t18Client } from '../src';

describe('index', () => {
	describe('t18', () => {
		it('should translate key to message', () => {
			const message = 'Hello World!';

			const t18 = new t18Client({
				resources: [
					{
						language: 'en',
						translations: {
							general: {
								hello_world: message,
							},
						},
					},
				],
			});

			expect(t18.t('general.hello_world')).toBe(message);
		});

		it('it should be able to change languages ', () => {
			const messageEn = 'Hello World!';
			const messageEs = 'Hola Mundo!';
			const messageIt = 'Ciao Mondo!';

			const t18 = new t18Client({
				resources: [
					{
						language: 'en',
						translations: {
							general: {
								hello_world: messageEn,
							},
						},
						default: true,
					},
					{
						language: 'es',
						translations: {
							general: {
								hello_world: messageEs,
							},
						},
					},
					{
						language: 'it',
						translations: {
							general: {
								hello_world: messageIt,
							},
						},
					},
				],
			});

			expect(t18.t('general.hello_world')).toBe(messageEn);
			t18.changeLanguage('es');
			expect(t18.t('general.hello_world')).toBe(messageEs);
			t18.changeLanguage('it');
			expect(t18.t('general.hello_world')).toBe(messageIt);
		});

		it('it should be able to get fixed t', () => {
			const messageEn = 'Hello World!';
			const messageEs = 'Hola Mundo!';
			const messageIt = 'Ciao Mondo!';

			const t18 = new t18Client({
				resources: [
					{
						language: 'en',
						translations: {
							general: {
								hello_world: messageEn,
							},
						},
						default: true,
					},
					{
						language: 'es',
						translations: {
							general: {
								hello_world: messageEs,
							},
						},
					},
					{
						language: 'it',
						translations: {
							general: {
								hello_world: messageIt,
							},
						},
					},
				],
			});
			const enT = t18.getFixedT('en');
			expect(enT('general.hello_world')).toBe(messageEn);
			const esT = t18.getFixedT('es');
			expect(esT('general.hello_world')).toBe(messageEs);
			const itT = t18.getFixedT('it');
			expect(itT('general.hello_world')).toBe(messageIt);
		});

		it('should return welcome message with name', () => {
			const message = (name: string) => `Welcome ${name}!`;
			const name = 'Bob';

			const t18 = new t18Client({
				resources: [
					{
						language: 'en',
						translations: {
							general: {
								welcome: message,
								sorry: {
									idk: ':)',
								},
							},
						},
					},
				],
			});
			const t = t18.getFixedT('en', 'general');
			t('');
			expect(t18.t('general.welcome', [name])).toMatch(message(name));
		});
	});
});
