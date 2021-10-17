export interface G3konConstructorOptions<T> {
	contents: T;
}

export interface Contents {
	[key: string]: Contents | ValidValues;
}
// content types
export type InterpolationFunction = (...args: any[]) => ReturnableValues;

export type ValidValues = string | number | InterpolationFunction;
export type ReturnableValues = UnionOmit<ValidValues, InterpolationFunction>;

// utility
type Id<T> = T extends T ? { [P in keyof T]: T[P] } : never;
type UnionOmit<Target, Props> = Target extends Props ? never : Target;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I
) => void
	? I
	: never;

// main
export type InterpolationKeys<T> = ExtractKeys<T, InterpolationFunction>;
export type NonInterpolationKeys<T> = ExtractKeys<T, ReturnableValues>;
export type ReturnType<T, Key> = getReturnType<getKeys<T>, Key>;

export type ExtractKeys<T, V> = ExtractValues<getKeys<T>, V>;

export type ExtractValues<T, V> = {
	[K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

export type getKeys<Content> = UnionToIntersection<
	Id<RecKeys<Content, ValidValues, ''>>
>;

export type Prefixes<Translations extends Translation> = Id<
	RecPrefixes<Translations, ValidValues, ''>
>;

type RecKeys<Content, FileType, Prefix extends string> = {
	[P in keyof Content & (string | number)]: Content[P] extends FileType
		? { [K in `${Prefix}${P}`]: Content[P] }
		: RecKeys<Content[P], FileType, `${Prefix}${P}.`>;
}[keyof Content & (string | number)];

type getParameters<F> = F extends (...args: infer P) => any ? P : F;

export type InterpolationArguments<
	T,
	Key extends string | keyof getKeys<T>
> = getParameters<getKeys<T>[Key]>;

type safeReturnType<Func> = Func extends (...args: any[]) => infer Args
	? Args
	: Func;

export type getReturnType<T, K> = K extends string
	? T extends Record<string, ValidValues>
		? safeReturnType<T[K]>
		: never
	: never;

// get fixed g
type RecPrefixes<Dir, Type, Prefix extends string> = {
	[P in keyof Dir & (string | number)]: Dir[P] extends Type
		? never
		: RecPrefixes<Dir[P], Type, `${Prefix}${P}.`> | `${Prefix}${P}`;
}[keyof Dir & (string | number)];

type AddPrefix<A, Prefix extends string> = A extends string
	? `${Prefix}${A}`
	: A;

type RemovePrefix<A, Prefix> = A extends `${Prefix}${infer T}` ? T : never;

interface GetFunction<T> {
	<Key extends InterpolationKeys<T>>(
		key: Key,
		args: InterpolationArguments<T, Key>
	): ReturnType<T, Key>;
	<Key extends NonInterpolationKeys<T>>(key: Key): ReturnType<T, Key>;
}

interface PrefixedGetFunction<T, Prefix extends string> {
	<Key extends RemovePrefix<InterpolationKeys<T>, Prefix>>(
		key: Key,
		args: InterpolationArguments<T, AddPrefix<Key, Prefix>>
	): ReturnType<T, AddPrefix<Key, Prefix>>;
	<Key extends RemovePrefix<NonInterpolationKeys<T>, Prefix>>(
		key: Key
	): ReturnType<T, AddPrefix<Key, Prefix>>;
}
