// js/lang/language.js

import ko from "./ko.js";
import en from "./en.js";

const translations = {
  ko,
  en
};

const DEFAULT_LANGUAGE = "ko";
const STORAGE_KEY = "rem404Language";

let currentLanguage = DEFAULT_LANGUAGE;

function isValidLanguage(language) {
  return Boolean(language && translations[language]);
}

function getSavedLanguage() {
  try {
    const savedLanguage = localStorage.getItem(STORAGE_KEY);

    if (isValidLanguage(savedLanguage)) {
      return savedLanguage;
    }

    return null;
  } catch (error) {
    return null;
  }
}

function getBrowserLanguage() {
  try {
    if (navigator.language && navigator.language.startsWith("ko")) {
      return "ko";
    }

    return "en";
  } catch (error) {
    return DEFAULT_LANGUAGE;
  }
}

function detectLanguage() {
  const savedLanguage = getSavedLanguage();

  if (savedLanguage) {
    return savedLanguage;
  }

  return getBrowserLanguage();
}

currentLanguage = detectLanguage();

export function getLanguage() {
  return currentLanguage;
}

export function getText() {
  return translations[currentLanguage] || translations[DEFAULT_LANGUAGE];
}

export function setLanguage(language) {
  if (!isValidLanguage(language)) return;

  currentLanguage = language;

  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch (error) {
    // iOS Safari 등에서 localStorage가 막혀도 사이트는 계속 동작해야 함
  }
}
