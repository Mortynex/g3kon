import {
	getInterpolationFunctionKeys,
	getTranslationKeys,
	t18Options,
	Translations,
	UnionOmit,
	ValidValues,
	TranslationFile,
	getFunctionArguments,
} from './typings';

export class t18<T extends Translations, L extends string> {
	private _translations: TranslationFile<T, L>[];
	private _currentLanguage: L;
	constructor({ translations }: t18Options<T, L>) {
		if (translations.length === 0) {
			throw new Error('Invalid translation length');
		}

		this._translations = translations;

		const defaultLanguage =
			translations.length > 1
				? translations.find(trans => trans.default === true)?.language
				: translations[0].language;

		if (!defaultLanguage) {
			throw new Error('Default translation file was not set');
		}

		this._currentLanguage = defaultLanguage;
	}

	changeLanguage(lng: L) {
		this._currentLanguage = lng;
	}

	private _getTranslations(lng?: L) {
		const translations = this._translations.find(
			file => file.language === (lng ?? this._currentLanguage)
		)?.translation;

		if (translations === undefined) {
			throw new Error('Invalid language');
		}

		return translations;
	}

	t<Key extends getInterpolationFunctionKeys<T>>(
		key: Key,
		args: getFunctionArguments<T, Key>
	): string;
	t(
		key: UnionOmit<getTranslationKeys<T>, getInterpolationFunctionKeys<T>>
	): string;
	t(key: any, args?: any): string {
		if (typeof key !== 'string') {
			return 'INVALID KEY';
		}

		return this._translate({
			key,
			args,
			lng: this._currentLanguage,
		});
	}

	private _translate({
		key,
		args,
		lng,
	}: {
		key: string;
		args?: any[];
		lng: L;
	}) {
		const objects = key.split('.');

		let currentValue: ValidValues | Translations = this._getTranslations(lng);
		for (const object of objects) {
			if (typeof currentValue !== 'object') {
				return 'INVALID PATH';
			}

			currentValue = currentValue[object];
		}

		const translation = currentValue;

		if (typeof translation === 'function') {
			if (!args || !Array.isArray(args)) {
				return 'INVALID INTERPOLATION FUNCTION ARGUMENTS';
			}

			const withInterpolationTranslation = translation(...args);
			if (typeof withInterpolationTranslation !== 'string') {
				return 'INVALID VALUE';
			}

			return withInterpolationTranslation;
		}

		if (typeof translation === 'object') {
			return 'INVALID PATH';
		}

		return translation;
	}

	getFixedT(lng?: L) {
		/*type addToString<A, B extends string> = A extends string ? `${A}${B}` : '';
		type KeyPrefix = typeof keyPrefix;
		type prefix = KeyPrefix extends undefined
			? ''
			: addToString<KeyPrefix, '.'>;*/

		const translateFunction = this._translate.bind(this);
		const language = lng ?? this._currentLanguage;

		function t<Key extends getInterpolationFunctionKeys<T>>(
			key: Key,
			args: getFunctionArguments<T, Key>
		): string;
		function t(
			key: UnionOmit<getTranslationKeys<T>, getInterpolationFunctionKeys<T>>
		): string;
		function t(key: any, args?: any): string {
			if (typeof key !== 'string') {
				return 'INVALID KEY';
			}

			return translateFunction({
				key,
				args,
				lng: language,
			});
		}

		return t;
	}
}
