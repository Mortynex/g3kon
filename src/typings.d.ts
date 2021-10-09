/*export interface LanguageFile<T> {
	language: string;
	translations: T;
}*/

export interface t18Options<T> {
  translations: T;
}

export interface Translations {
  [key: string]: translations | ValidValues;
}

type InterpolationFunction = (...args: any[]) => string;

export type ValidValues = string | InterpolationFunction; //| ;

export type getTranslationKeys<Translation extends Translation> = Id<
  RecKeysOf<Translation, ValidValues, ''>
>;

export type getFunctionParams<
  Translation extends Translation,
  Key extends getTranslationKeys<Translation>
> = Id<RecParamsOf<Translation, ValidValues, '', Key>>;

type Id<T> = T extends T ? { [P in keyof T]: T[P] } : never;

type RecKeysOf<Dir, FileType, Prefix extends string> = {
  [P in keyof Dir & (string | number)]: Dir[P] extends FileType
    ? `${Prefix}${P}`
    : RecKeysOf<Dir[P], FileType, `${Prefix}${P}.`>;
}[keyof Dir & (string | number)];

type UnionOmit<Target, Props> = Target extends Props ? never : Target;

export type getInterpolationFunctionKeys<T extends Translations> = UnionOmit<
  getTranslationKeys<T>,
  Id<RecKeysOf<T, string, ''>>
>;

export type getNotInterpolationFunctionKeys<T extends Translations> = UnionOmit<
  getTranslationKeys<T>,
  getInterpolationFunctionKeys<T>
>;

type getParameters<T> = T extends (...args: infer P) => any ? P : never;

type RecParamsOf<
  Dir,
  FileType,
  Prefix extends string = '',
  Key extends string
> = {
  [P in keyof Dir & (string | number)]: Dir[P] extends FileType
    ? `${Prefix}${P}` extends Key
      ? getParameters<Dir[P]>
      : never
    : RecParamsOf<Dir[P], FileType, `${Prefix}${P}.`, Key>;
}[keyof Dir & (string | number)];

// for getFixedT :)
type RecAllPathsOf<Dir, FileType, Prefix extends string> = {
  [P in keyof Dir & (string | number)]: Dir[P] extends FileType
    ? `${Prefix}${P}`
    : RecAllPathsOf<Dir[P], FileType, `${Prefix}${P}.`> | `${Prefix}${P}`;
}[keyof Dir & (string | number)];
