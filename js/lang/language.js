// js/lang/language.js

import ko from "./ko.js";
import en from "./en.js";

const translations = {
  ko,
  en
};

const STORAGE_KEY = "rem404Language";

function detectLanguage() {
  const savedLanguage = localStorage.getItem(STORAGE_KEY);

  if (savedLanguage && translations[savedLanguage]) {
    return savedLanguage;
  }

  if (navigator.language && navigator.language.startsWith("ko")) {
    return "ko";
  }

  return "en";
}

let currentLanguage = detectLanguage();

export function getLanguage() {
  return currentLanguage;
}

export function getText() {
  return translations[currentLanguage];
}

export function setLanguage(language) {
  if (!translations[language]) return;

  currentLanguage = language;
  localStorage.setItem(STORAGE_KEY, language);
}
