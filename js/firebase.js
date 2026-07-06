// js/firebase.js
// REM404 Archive v0.6 Beta

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getCountFromServer,
  getDocs,
  query,
  orderBy,
  limit,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBkXSo5rBGEs5HMjz9Dku5V8IQr8_zqV9M",
  authDomain: "rem404-archive.firebaseapp.com",
  projectId: "rem404-archive",
  storageBucket: "rem404-archive.firebasestorage.app",
  messagingSenderId: "314696650814",
  appId: "1:314696650814:web:00b197cac9fb31c414c16f",
  measurementId: "G-4JKC0P266J"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const memoriesRef = collection(db, "memories");

let memoryCache = null;

function normalizeMemory(docSnapshot) {
  const data = docSnapshot.data();
  const text = typeof data.memory === "string" ? data.memory.trim() : "";

  if (!text) return null;

  return {
    id: docSnapshot.id,
    text
  };
}

export async function saveMemory(memoryText) {
  const text = memoryText.trim();

  if (!text) throw new Error("EMPTY_MEMORY");
  if (text.length > 80) throw new Error("TOO_LONG_MEMORY");

  const docRef = await addDoc(memoriesRef, {
    memory: text,
    createdAt: serverTimestamp(),
    random: Math.random(),
    exhibition: "REM404 Archive Test",
    project: "REM404",
    archive: "REM404 Archive",
    version: "v0.4.3-beta",
    language: "ko"
  });

  memoryCache = null;

  return {
    id: docRef.id,
    text
  };
}

export async function getMemoryCount() {
  const snapshot = await getCountFromServer(memoriesRef);
  return snapshot.data().count;
}

export async function getRandomMemory(excludedIds = []) {
  if (!memoryCache) {
    const snapshot = await getDocs(memoriesRef);

    memoryCache = snapshot.docs
      .map((docSnapshot) => normalizeMemory(docSnapshot))
      .filter(Boolean);
  }

  const excludedIdSet = new Set(excludedIds);

  const availableMemories = memoryCache.filter((memory) => {
    return !excludedIdSet.has(memory.id);
  });

  if (availableMemories.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * availableMemories.length);

  return availableMemories[randomIndex];
}
export async function saveDebugLog(log) {
  const debugLogsRef = collection(db, "debugLogs");

  return addDoc(debugLogsRef, {
    ...log,
    createdAtServer: serverTimestamp()
  });
}

export async function getDebugLogs() {
  const debugLogsRef = collection(db, "debugLogs");
  const snapshot = await getDocs(
  query(
    debugLogsRef,
    orderBy("createdAtServer","desc")
  )
);

  return snapshot.docs.map((docSnapshot) => {
    return {
      id: docSnapshot.id,
      ...docSnapshot.data()
    };
  });
}

export async function saveUsageLog(type = "visit", detail = {}) {
  const usageLogsRef = collection(db, "usageLogs");

  return addDoc(usageLogsRef, {
    type,
    detail,
    page: location.pathname.split("/").pop(),
    url: location.href,
    userAgent: navigator.userAgent,
    language: document.documentElement.lang || "unknown",
    createdAt: serverTimestamp(),
    createdAtLocal: new Date().toISOString()
  });
}

export async function getArchiveStats() {
  const memoriesSnapshot = await getDocs(memoriesRef);

  const memories = memoriesSnapshot.docs.map((docSnapshot) => {
    return {
      id: docSnapshot.id,
      ...docSnapshot.data()
    };
  });

  const totalMemories = memories.length;

  const koCount = memories.filter((item) => item.language === "ko").length;
  const enCount = memories.filter((item) => item.language === "en").length;
  const unknownCount = totalMemories - koCount - enCount;

  const usageLogsRef = collection(db, "usageLogs");
  const usageQuery = query(
    usageLogsRef,
    orderBy("createdAt", "desc"),
    limit(100)
  );

  const usageSnapshot = await getDocs(usageQuery);

  const usageLogs = usageSnapshot.docs.map((docSnapshot) => {
    return {
      id: docSnapshot.id,
      ...docSnapshot.data()
    };
  });

  const totalVisits = usageLogs.length;
  
  return {
    totalMemories,
    language: {
      ko: koCount,
      en: enCount,
      unknown: unknownCount
    },
    usageLogs
  };
}
export async function saveUpdateLog(data) {
  const updateLogsRef = collection(db, "updateLogs");

  return addDoc(updateLogsRef, {
    ...data,
    createdAt: serverTimestamp()
  });
}

export async function getUpdateLogs() {
  const updateLogsRef = collection(db, "updateLogs");

  const snapshot = await getDocs(
    query(
      updateLogsRef,
      orderBy("createdAt", "desc")
    )
  );

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function getAllMemories() {
  const memoriesQuery = query(
    memoriesRef,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(memoriesQuery);

  return snapshot.docs.map((docSnapshot) => {
    return {
      id: docSnapshot.id,
      ...docSnapshot.data()
    };
  });
}

export async function updateMemory(memoryId, newText) {
  const text = newText.trim();

  if (!text) throw new Error("EMPTY_MEMORY");
  if (text.length > 80) throw new Error("TOO_LONG_MEMORY");

  const memoryDocRef = doc(db, "memories", memoryId);

  return updateDoc(memoryDocRef, {
    memory: text,
    updatedAt: serverTimestamp()
  });
}

export async function deleteMemory(memoryId) {
  const memoryDocRef = doc(db, "memories", memoryId);

  return deleteDoc(memoryDocRef);
}
