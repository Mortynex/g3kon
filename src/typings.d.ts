export interface t18Options<T, L> {
	translations: TranslationFile<T, L>[];
}

interface TranslationFile<T, L> {
	language: L;
	translation: T;
	default?: boolean;
}

export interface Translations {
	[key: string]: translations | ValidValues;
}

type InterpolationFunction = (...args: any[]) => string;

export type ValidValues = string | InterpolationFunction; //| ;

// for t18.t()
export type getTranslationKeys<Translation extends Translation> = Id<
	RecKeysOf<Translation, ValidValues, ''>
>;

type Id<T> = T extends T ? { [P in keyof T]: T[P] } : never;

type RecKeysOf<Dir, FileType, Prefix extends string> = {
	[P in keyof Dir & (string | number)]: Dir[P] extends FileType
		? `${Prefix}${P}`
		: RecKeysOf<Dir[P], FileType, `${Prefix}${P}.`>;
}[keyof Dir & (string | number)];

type UnionOmit<Target, Props> = Target extends Props ? never : Target;
type UnionOmitWithoutPrefix<
	Target,
	Props,
	Prefix extends string
> = Target extends Props
	? never
	: Target extends `${Prefix}${infer C}`
	? C
	: any;

export type getInterpolationFunctionKeys<T extends Translations> = UnionOmit<
	getTranslationKeys<T>,
	Id<RecKeysOf<T, string, ''>>
>;

export type getInterpolationFunctionKeysWithoutPrefix<
	T extends Translations,
	Prefix extends string,
	G
> = UnionOmitWithoutPrefix<G, Id<RecKeysOf<T, string, ''>>, Prefix>;

export type getFunctionParams<
	T extends Translations,
	Key extends getTranslationKeys<Translation>
> = Id<FindFuncParamsOf<T, ValidValues, '', Key>>;

type FindFuncParamsOf<
	Dir,
	FileType,
	Prefix extends string = '',
	Key extends string
> = {
	[P in keyof Dir & (string | number)]: Dir[P] extends FileType
		? `${Prefix}${P}` extends Key
			? Dir[P] extends (...args: infer A) => any
				? A
				: never
			: never
		: FindFuncParamsOf<Dir[P], FileType, `${Prefix}${P}.`, Key>;
}[keyof Dir & (string | number)];

// for getFixedT :)

export type getAllPossibleObjectPaths<Translations extends Translation> = Id<
	RecAllPathsOf<Translations, ValidValues, ''>
>;

type RecAllPathsOf<Dir, FileType, Prefix extends string> = {
	[P in keyof Dir & (string | number)]: Dir[P] extends FileType
		? never
		: RecAllPathsOf<Dir[P], FileType, `${Prefix}${P}.`> | `${Prefix}${P}`;
}[keyof Dir & (string | number)];

export type RemovePrefix<
	A extends string,
	B extends string
> = A extends `${B}${infer C}` ? C : any;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I
) => void
	? I
	: never;

export type getTypeIntersectionOf<Translation> = UnionToIntersection<
	Id<RecTypesOf<Translation, ValidValues, ''>>
>;

type Id<T> = T extends T ? { [P in keyof T]: T[P] } : never;

type RecTypesOf<Dir, FileType, Prefix extends string> = {
	[P in keyof Dir & (string | number)]: Dir[P] extends FileType
		? { [K in `${Prefix}${P}`]: Dir[P] }
		: RecTypesOf<Dir[P], FileType, `${Prefix}${P}.`>;
}[keyof Dir & (string | number)];

export type getFunctionArguments<
	T extends Translations,
	Key
> = getTypeIntersectionOf<T>[Key] extends (...args: infer A) => any ? A : never;
