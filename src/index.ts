import {
  getInterpolationFunctionKeys,
  getFunctionParams,
  getTranslationKeys,
  t18Options,
  Translations,
  UnionOmit,
  ValidValues,
} from './typings';

export class t18<T extends Translations> {
  private translations: Translations;
  constructor(options: t18Options<T>) {
    this.translations = options.translations;
  }

  t<Key extends getInterpolationFunctionKeys<T>>(
    key: Key,
    args: getFunctionParams<T, Key>
  ): string;
  t(
    key: UnionOmit<getTranslationKeys<T>, getInterpolationFunctionKeys<T>>
  ): string;
  t(key: any, args?: any): string {
    if (typeof key !== 'string') {
      return 'INVALID KEY';
    }

    const objects = key.split('.');

    let currentValue: ValidValues | Translations = this.translations;
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
}
