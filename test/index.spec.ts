import { G3kon } from '../src';

describe('index', () => {
	const contents = {
		general: {
			hello_world: 'Hello World!',
			welcome: (name: string) => `Welcome ${name}`,
			date: () => `Current time in ms: ${Date.now()}`,
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

	describe('G3kon', () => {
		it('should init', () => {
			const g3kon = new G3kon({
				contents: contents,
			});

			expect(g3kon).toBeDefined();
		});

		it('should work 1 level deep', () => {
			const helloWorld = 'Hello World!';
			const g3kon = new G3kon({
				contents: {
					hello_world: helloWorld,
				},
			});

			expect(g3kon.g('hello_world')).toBe(helloWorld);
		});
	});

	describe('G3kon.g', () => {
		const g3kon = new G3kon({
			contents: contents,
		});

		it('should translate string', () => {
			expect(g3kon.g('general.hello_world')).toBe(contents.general.hello_world);
		});

		it('should translate number', () => {
			expect(g3kon.g('ids.admin_role_id')).toBe(contents.ids.admin_role_id);
		});

		it('should be able to retrieve atleast 8 nested object down', () => {
			expect(
				g3kon.g(
					'deep.deep.deep.deep.deep.deep.imeanreallydeep.evendeeper.thatsenough'
				)
			).toBe(
				contents.deep.deep.deep.deep.deep.deep.imeanreallydeep.evendeeper
					.thatsenough
			);
		});

		it('should to use string interpolation function', () => {
			const username = 'Tom';

			expect(g3kon.g('users.actions.user_left', [username])).toBe(
				contents.users.actions.user_left(username)
			);
		});

		it('should to use number interpolation function', () => {
			const num1 = 5;
			const num2 = 8;

			expect(g3kon.g('numbers.add', [num1, num2])).toBe(
				contents.numbers.add(num1, num2)
			);
		});
	});

	describe('G3kon.getFixedG', () => {
		const g3kon = new G3kon({
			contents: contents,
		});

		it('should return defined value', () => {
			const g = g3kon.getFixedG('numbers');

			expect(g).toBeDefined();
		});

		it('should get a string value', () => {
			const g = g3kon.getFixedG('general');

			expect(g('hello_world')).toBe(contents.general.hello_world);
		});

		it('should get a number value', () => {
			const g = g3kon.getFixedG('ids');

			expect(g('admin_role_id')).toBe(contents.ids.admin_role_id);
		});

		it('should get a number interpolation function', () => {
			const g = g3kon.getFixedG('numbers');

			const num1 = 5;
			const num2 = 23;

			expect(g('add', [num1, num2])).toBe(contents.numbers.add(num1, num2));
		});

		it('should get a string interpolation function', () => {
			const g = g3kon.getFixedG('general');

			const name = 'Jacob';

			expect(g('welcome', [name])).toBe(contents.general.welcome(name));
		});

		it('should get an empty g', () => {
			const g = g3kon.getFixedG();

			expect(g).toBeDefined();
		});
	});
});
