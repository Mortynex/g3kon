import { kill } from 'process';
import { t18Client } from '../src';

describe('index', () => {
	const contents = {
		general: {
			hello_world: 'Hello World!',
			welcome: (name: string) => `Welcome ${name}`,
		},
		users: {
			actions: {
				user_left: (username: string) => `${username} left the game`,
			},
			errors: {
				user_not_found: 'user not found',
			},
		},
		ids: {
			admin_role_id: 598,
		},
		numbers: {
			add: (num1: number, num2: number) => num1 + num2,
		},
		deep: {
			deep: {
				deep: {
					deep: {
						deep: {
							deep: {
								imeanreallydeep: {
									evendeeper: {
										thatsenough: ':)',
									},
								},
							},
						},
					},
				},
			},
		},
	};

	describe('t18Client', () => {
		it('should init', () => {
			const t18 = new t18Client({
				content: contents,
			});

			expect(t18).toBeDefined();
		});
	});

	describe('t18Client.t', () => {
		const t18 = new t18Client({
			content: contents,
		});

		it('should translate string', () => {
			expect(t18.get('general.hello_world')).toBe(contents.general.hello_world);
		});

		it('should translate number', () => {
			expect(t18.get('ids.admin_role_id')).toBe(contents.ids.admin_role_id);
		});

		it('should be able to retrieve atleast 8 nested object down', () => {
			expect(
				t18.get(
					'deep.deep.deep.deep.deep.deep.imeanreallydeep.evendeeper.thatsenough'
				)
			).toBe(
				contents.deep.deep.deep.deep.deep.deep.imeanreallydeep.evendeeper
					.thatsenough
			);
		});

		it('should to use string interpolation function', () => {
			const username = 'Tom';

			expect(t18.get('users.actions.user_left', [username])).toBe(
				contents.users.actions.user_left(username)
			);
		});

		it('should to use number interpolation function', () => {
			const num1 = 5;
			const num2 = 8;

			expect(t18.get('numbers.add', [num1, num2])).toBe(
				contents.numbers.add(num1, num2)
			);
		});
	});
});
