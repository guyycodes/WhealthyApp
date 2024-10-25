import { I18n } from "i18n-js";
import { I18nManager } from "react-native";

const i18n = new I18n();

// Import translations
import en from "./en";
import ar from "./ar";
import ko from "./ko";
import fr from "./fr";
import es from "./es";

i18n.fallbacks = true;
i18n.translations = { ar, en, "en-US": en, ko, fr, es }; 

const fallbackLocale = "en-US";

// Use navigator.language if available, otherwise fallback to en-US
const systemLocaleTag = typeof navigator !== 'undefined' && navigator.language
  ? navigator.language
  : fallbackLocale;

console.log('System locale:', systemLocaleTag);

if (Object.prototype.hasOwnProperty.call(i18n.translations, systemLocaleTag)) {
  // if specific locales like en-FI or en-US is available, set it
  i18n.locale = systemLocaleTag;
} else {
  // otherwise try to fallback to the general locale (dropping the -XX suffix)
  const generalLocale = systemLocaleTag.split("-")[0];
  if (Object.prototype.hasOwnProperty.call(i18n.translations, generalLocale)) {
    i18n.locale = generalLocale;
  } else {
    i18n.locale = fallbackLocale;
  }
}

// handle RTL languages
// Note: This is a simplified approach and may need adjustment based on your specific RTL languages
const rtlLanguages = ['ar', 'he', 'fa'];
export const isRTL = rtlLanguages.includes(i18n.locale.split('-')[0]);

// Only use I18nManager if it's available (i.e., in a React Native environment)
if (typeof I18nManager !== 'undefined') {
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);
}

/**
 * A helper function to get nested properties in an object using a string path.
 * This simulates the behavior of the TypeScript RecursiveKeyOf type.
 * @param {Object} obj - The object to traverse
 * @param {string} path - The path to the property
 * @returns {*} The value at the end of the path
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((o, key) => (o && o[key] !== undefined) ? o[key] : undefined, obj);
}

/**
 * A function to validate if a given key path exists in the translations.
 * This simulates the behavior of the TypeScript RecursiveKeyOf type at runtime.
 * @param {string} keyPath - The key path to validate
 * @returns {boolean} Whether the key path is valid
 */
function isValidKeyPath(keyPath) {
  return getNestedValue(en, keyPath) !== undefined;
}

/**
 * Translates text.
 * @param {string} key - The i18n key.
 * @param {import("i18n-js").TranslateOptions} options - The i18n options.
 * @returns {string} - The translated text.
 * @example
 * Translations:
 *
 * ```en.js
 * {
 *  "hello": "Hello, {{name}}!"
 * }
 * ```
 *
 * Usage:
 * ```js
 * import { translate } from "i18n-js"
 *
 * translate("common.ok", { name: "world" })
 * // => "Hello world!"
 * ```
 */
export function translate(key, options) {
  return i18n.t(key, options);
}

// Export the configured i18n instance
export default i18n;

// Export the isValidKeyPath function for use in other parts of the application
export { isValidKeyPath };