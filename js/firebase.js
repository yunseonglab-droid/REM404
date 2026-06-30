// js/firebase.js
// REM404 Archive v0.3

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
  orderBy,
  limit
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

function normalizeMemory(docSnapshot) {
  const data = docSnapshot.data();
  const text = typeof data.memory === "string" ? data.memory.trim() : "";

  if (!text) return null;

  return text;
}

export async function saveMemory(memoryText) {
  const text = memoryText.trim();

  if (!text) throw new Error("EMPTY_MEMORY");
  if (text.length > 80) throw new Error("TOO_LONG_MEMORY");

  await addDoc(memoriesRef, {
    memory: text,
    createdAt: serverTimestamp(),
    random: Math.random(),
    exhibition: "REM404 Archive Test",
    project: "REM404",
    archive: "REM404 Archive",
    version: "v0.3",
    language: "ko"
  });
}

export async function getMemoryCount() {
  const snapshot = await getCountFromServer(memoriesRef);
  return snapshot.data().count;
}

export async function getRandomMemory() {
  const seed = Math.random();

  const forwardQuery = query(
    memoriesRef,
    where("random", ">=", seed),
    orderBy("random"),
    limit(1)
  );

  const forwardSnapshot = await getDocs(forwardQuery);

  if (!forwardSnapshot.empty) {
    return normalizeMemory(forwardSnapshot.docs[0]);
  }

  const backwardQuery = query(
    memoriesRef,
    where("random", "<", seed),
    orderBy("random"),
    limit(1)
  );

  const backwardSnapshot = await getDocs(backwardQuery);

  if (!backwardSnapshot.empty) {
    return normalizeMemory(backwardSnapshot.docs[0]);
  }

  const fallbackSnapshot = await getDocs(memoriesRef);
  const memories = fallbackSnapshot.docs
    .map((docSnapshot) => normalizeMemory(docSnapshot))
    .filter(Boolean);

  if (memories.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * memories.length);

  return memories[randomIndex];
}
