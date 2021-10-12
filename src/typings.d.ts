export interface t18ClientOptions<T> {
	content: T;
}

export interface Contents<> {
	[key: string]: DeepContents;
}

export interface DeepContents {
	[key: string]: DeepContents | ValidValues;
}

export interface t18TranslateOptions {
	key: string;
	args?: any[];
	lng: L;
}

export type InterpolationFunction = (...args: any[]) => ReturnableValues;

export type ValidValues = string | number | InterpolationFunction;
export type ReturnableValues = UnionOmit<ValidValues, InterpolationFunction>;

type Id<T> = T extends T ? { [P in keyof T]: T[P] } : never;
type UnionOmit<Target, Props> = Target extends Props ? never : Target;

export type KeysExtract<T, V> = {
	[K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

type KeysExclude<T, V> = {
	[K in keyof T]-?: T[K] extends V ? never : never;
}[keyof T];

type safeReturnType<F> = F extends (...args: any[]) => infer R ? R : F;

export type getReturnType<T, K> = K extends string
	? T extends Record<string, ValidValues>
		? safeReturnType<T[K]>
		: never
	: never;

export type KeysExtractTypes<T, V> = KeysExtract<getKeyTypesObject<T>, V>;

export type getKeyTypesObject<Translation> = UnionToIntersection<
	Id<RecKeyTypesOf<Translation, ValidValues, ''>>
>;

type RecKeyTypesOf<Dir, FileType, Prefix extends string> = {
	[P in keyof Dir & (string | number)]: Dir[P] extends FileType
		? { [K in `${Prefix}${P}`]: Dir[P] }
		: RecKeyTypesOf<Dir[P], FileType, `${Prefix}${P}.`>;
}[keyof Dir & (string | number)];

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I
) => void
	? I
	: never;

export type getParameters<F> = F extends (...args: infer P) => any ? P : F;

export type getTypeParameters<
	T,
	Key extends keyof getKeyTypesObject<T>
> = getParameters<getKeyTypesObject<T>[Key]>;
