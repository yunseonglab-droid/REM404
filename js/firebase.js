// REM404 v0.8 audience data bridge.
// Public visitors use the central REM404 service database; authenticated
// exhibition management is handled by the REM404 iOS/Android app.

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getCountFromServer,
  getDocs,
  query,
  where,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAst32Rk5IYFyeRsps8aX-tnUqkdH2usUA",
  authDomain: "rem404.firebaseapp.com",
  projectId: "rem404",
  storageBucket: "rem404.firebasestorage.app",
  messagingSenderId: "54552225095",
  appId: "1:54552225095:web:27a945fe454f627680d862"
};

const EXHIBITION_ID = "rem404";
const ARTWORK_ID = "main";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const exhibitionRef = doc(db, "exhibitions", EXHIBITION_ID);
const artworkRef = doc(exhibitionRef, "artworks", ARTWORK_ID);
const memoriesRef = collection(artworkRef, "memories");
const visibleMemoriesQuery = query(memoriesRef, where("moderationStatus", "==", "visible"));

let memoryCache = null;

function normalizeMemory(docSnapshot) {
  const data = docSnapshot.data();
  const text = typeof data.text === "string" ? data.text.trim() : (data.memory || "").trim();
  return text ? { id: docSnapshot.id, text } : null;
}

function newestFirst(items) {
  return items.sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() ?? 0;
    const bTime = b.createdAt?.toMillis?.() ?? 0;
    return bTime - aTime;
  });
}

export async function saveMemory(memoryText) {
  const text = memoryText.trim();
  if (!text) throw new Error("EMPTY_MEMORY");
  if (text.length > 80) throw new Error("TOO_LONG_MEMORY");

  const docRef = await addDoc(memoriesRef, {
    text,
    memory: text,
    exhibitionId: EXHIBITION_ID,
    artworkId: ARTWORK_ID,
    moderationStatus: "visible",
    createdAt: serverTimestamp(),
    random: Math.random(),
    exhibition: "남겨진 사람들의 기억과 흔적",
    project: "REM404",
    archive: "REM404 Archive",
    version: "v0.8",
    language: document.documentElement.lang === "en" ? "en" : "ko"
  });

  memoryCache = null;
  return { id: docRef.id, text };
}

export async function getMemoryCount() {
  const snapshot = await getCountFromServer(visibleMemoriesQuery);
  return snapshot.data().count;
}

export async function getRandomMemory(excludedIds = []) {
  if (!memoryCache) {
    const snapshot = await getDocs(visibleMemoriesQuery);
    memoryCache = snapshot.docs.map(normalizeMemory).filter(Boolean);
  }
  const excluded = new Set(excludedIds);
  const available = memoryCache.filter((memory) => !excluded.has(memory.id));
  return available.length ? available[Math.floor(Math.random() * available.length)] : null;
}

export async function saveDebugLog(log) {
  return addDoc(collection(exhibitionRef, "debugLogs"), {
    ...log,
    exhibitionId: EXHIBITION_ID,
    createdAtServer: serverTimestamp()
  });
}

export async function getDebugLogs() {
  const snapshot = await getDocs(collection(exhibitionRef, "debugLogs"));
  return newestFirst(snapshot.docs.map((item) => ({ id: item.id, ...item.data(), createdAt: item.data().createdAtServer })));
}

export async function saveUsageLog(type = "visit", detail = {}) {
  return addDoc(collection(exhibitionRef, "usageLogs"), {
    type,
    detail,
    exhibitionId: EXHIBITION_ID,
    page: location.pathname.split("/").pop() || "index.html",
    url: location.href,
    userAgent: navigator.userAgent,
    language: document.documentElement.lang || "unknown",
    createdAt: serverTimestamp(),
    createdAtLocal: new Date().toISOString()
  });
}

export async function getArchiveStats() {
  const [memorySnapshot, usageSnapshot] = await Promise.all([
    getDocs(visibleMemoriesQuery),
    getDocs(collection(exhibitionRef, "usageLogs"))
  ]);
  const memories = memorySnapshot.docs.map((item) => item.data());
  const koCount = memories.filter((item) => item.language === "ko").length;
  const enCount = memories.filter((item) => item.language === "en").length;
  return {
    totalMemories: memories.length,
    language: { ko: koCount, en: enCount, unknown: memories.length - koCount - enCount },
    totalVisits: usageSnapshot.size,
    usageLogs: newestFirst(usageSnapshot.docs.map((item) => ({ id: item.id, ...item.data() }))).slice(0, 100)
  };
}

export async function saveUpdateLog(data) {
  return addDoc(collection(exhibitionRef, "updateLogs"), { ...data, exhibitionId: EXHIBITION_ID, createdAt: serverTimestamp() });
}

export async function getUpdateLogs() {
  const snapshot = await getDocs(collection(exhibitionRef, "updateLogs"));
  return newestFirst(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
}

export async function getAllMemories() {
  const snapshot = await getDocs(visibleMemoriesQuery);
  return newestFirst(snapshot.docs.map((item) => ({ id: item.id, ...item.data(), memory: item.data().text ?? item.data().memory })));
}

export async function updateMemory(memoryId, newText) {
  const text = newText.trim();
  if (!text) throw new Error("EMPTY_MEMORY");
  if (text.length > 80) throw new Error("TOO_LONG_MEMORY");
  return updateDoc(doc(memoriesRef, memoryId), { text, memory: text, updatedAt: serverTimestamp() });
}

export async function deleteMemory(memoryId) {
  return updateDoc(doc(memoriesRef, memoryId), {
    moderationStatus: "hidden",
    deletedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function getTrashMemories() {
  const snapshot = await getDocs(query(memoriesRef, where("moderationStatus", "==", "hidden")));
  return newestFirst(snapshot.docs.map((item) => ({ id: item.id, ...item.data(), memory: item.data().text ?? item.data().memory })));
}

export async function restoreMemory(memoryId) {
  return updateDoc(doc(memoriesRef, memoryId), {
    moderationStatus: "visible",
    restoredAt: serverTimestamp(),
    deletedAt: null,
    updatedAt: serverTimestamp()
  });
}
