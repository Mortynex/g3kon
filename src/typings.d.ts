export interface t18ClientOptions<T, L> {
	resources: TranslationResource<T, L>[] | TranslationResource<T, L>;
}

interface TranslationResource<T, L> {
	language: L;
	translations: T;
	default?: boolean;
}

export interface Translations {
	[key: string]: Translations | ValidValues;
}

export interface t18TranslateOptions {
	key: string;
	args?: any[];
	lng: L;
}

type InterpolationFunction = (...args: any[]) => string;

export type ValidValues = string | InterpolationFunction;

type Id<T> = T extends T ? { [P in keyof T]: T[P] } : never;
type UnionOmit<Target, Props> = Target extends Props ? never : Target;

// for t18.t()
export type getAllTranslationKeys<Translation extends Translation> = Id<
	RecTransKeysOf<Translation, ValidValues, ''>
>;

type RecTransKeysOf<Trans, FileType, Prefix extends string> = {
	[P in keyof Trans & (string | number)]: Trans[P] extends FileType
		? `${Prefix}${P}`
		: RecTransKeysOf<Trans[P], FileType, `${Prefix}${P}.`>;
}[keyof Trans & (string | number)];

export type getInterpolationFunctionKeys<T extends Translations> = UnionOmit<
	getAllTranslationKeys<T>,
	Id<RecTransKeysOf<T, string, ''>>
>;

type RecTransKeysWithoutPrefixOf<
	Trans,
	FileType,
	Prefix extends string,
	KeyPrefix
> = {
	[P in keyof Trans & (string | number)]: Trans[P] extends FileType
		? `${Prefix}${P}` extends `${KeyPrefix}${infer C}`
			? C
			: any
		: RecTransKeysWithoutPrefixOf<
				Trans[P],
				FileType,
				`${Prefix}${P}.`,
				KeyPrefix
		  >;
}[keyof Trans & (string | number)];

export type getInterpolationFunctionKeysWithoutPrefix<
	T extends Translations,
	Prefix
> = UnionOmit<
	Id<
		RecTransKeysWithoutPrefixOf<T, string | InterpolationFunction, '', Prefix>
	>,
	Id<RecTransKeysWithoutPrefixOf<T, string, '', Prefix>>
>;

export type getNonInterpolationFunctionKeysWithoutPrefix<
	T extends Translations,
	Prefix
> = Id<RecTransKeysWithoutPrefixOf<T, string, '', Prefix>>;

// for getFixedT :)

export type getAllKeys<Translations extends Translation> = Id<
	RecAllKeysOf<Translations, ValidValues, ''>
>;

type RecAllKeysOf<Dir, FileType, Prefix extends string> = {
	[P in keyof Dir & (string | number)]: Dir[P] extends FileType
		? never
		: RecAllKeysOf<Dir[P], FileType, `${Prefix}${P}.`> | `${Prefix}${P}`;
}[keyof Dir & (string | number)];

export type RemoveKeyPrefix<
	A extends string,
	B extends string
> = A extends `${B}${infer C}` ? C : any;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I
) => void
	? I
	: never;

export type getFunctionArguments<
	T extends Translations,
	Key
> = getKeyTypesObject<T>[Key] extends (...args: infer A) => any ? A : never;

export type getFunctionArgumentsWithPrefix<
	T extends Translations,
	Key,
	Prefix extends string
> = getKeyTypesObjectWithPrefix<T, Prefix>[Key] extends (
	...args: infer A
) => any
	? A
	: never;

export type getKeyTypesObject<Translation> = UnionToIntersection<
	Id<RecKeyTypesOf<Translation, ValidValues, ''>>
>;

type RecKeyTypesOf<Dir, FileType, Prefix extends string> = {
	[P in keyof Dir & (string | number)]: Dir[P] extends FileType
		? { [K in `${Prefix}${P}`]: Dir[P] }
		: RecKeyTypesOf<Dir[P], FileType, `${Prefix}${P}.`>;
}[keyof Dir & (string | number)];

export type getKeyTypesObjectWithPrefix<Translation, Prefix> =
	UnionToIntersection<
		Id<RecKeyTypesWithPrefixOf<Translation, ValidValues, '', KeyPrefix>>
	>;

type RecKeyTypesWithPrefixOf<
	Dir,
	FileType,
	Prefix extends string,
	KeyPrefix
> = {
	[P in keyof Dir & (string | number)]: Dir[P] extends FileType
		? { [K in RemoveKeyPrefix<`${Prefix}${P}`, KeyPrefix>]: Dir[P] }
		: RecKeyTypesWithPrefixOf<Dir[P], FileType, `${Prefix}${P}.`, KeyPrefix>;
}[keyof Dir & (string | number)];
