import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, collection, addDoc, updateDoc, deleteDoc, doc,
  query, where, orderBy, onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
 import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyD42Mv47AAAhmjQ5gC3FlIF8XYbJDIAl1o",
    authDomain: "isaiot1.firebaseapp.com",
    projectId: "isaiot1",
    storageBucket: "isaiot1.firebasestorage.app",
    messagingSenderId: "981528957277",
    appId: "1:981528957277:web:3d700a2bcb22ca142098b4"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);

export const db = getFirestore(app);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const $ = (id) => document.getElementById(id);
const authScreen = $("auth-screen"), appScreen = $("app-screen");
const authError = $("auth-error"), list = $("task-list"), empty = $("empty");

let unsubscribe = null;   // cancela o listener em tempo real ao sair
let editingId = null;

const mensagens = {
  "auth/invalid-email": "E-mail inválido.",
  "auth/missing-password": "Digite a senha.",
  "auth/weak-password": "A senha precisa ter ao menos 6 caracteres.",
  "auth/email-already-in-use": "Este e-mail já tem uma conta. Use Entrar.",
  "auth/invalid-credential": "E-mail ou senha incorretos.",
  "auth/network-request-failed": "Sem conexão. Verifique a internet."
};
function showError(e) {
  authError.textContent = mensagens[e.code] || "Não foi possível concluir. Tente de novo.";
  authError.hidden = false;
}

// ---------- AUTENTICAÇÃO ----------
$("auth-form").addEventListener("submit", async (ev) => {
  ev.preventDefault(); authError.hidden = true;
  try { await signInWithEmailAndPassword(auth, $("email").value.trim(), $("password").value); }
  catch (e) { showError(e); }
});
$("btn-signup").addEventListener("click", async () => {
  authError.hidden = true;
  try { await createUserWithEmailAndPassword(auth, $("email").value.trim(), $("password").value); }
  catch (e) { showError(e); }
});
$("btn-logout").addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, (user) => {
  if (user) {
    authScreen.hidden = true; appScreen.hidden = false;
    $("user-email").textContent = user.email;
    listenTasks(user.uid);
  } else {
    if (unsubscribe) unsubscribe();
    appScreen.hidden = true; authScreen.hidden = false;
    $("auth-form").reset(); list.innerHTML = "";
  }
});

// ---------- CRUD (Firestore) ----------
// READ em tempo real: só as tarefas do usuário logado
function listenTasks(uid) {
  const q = query(collection(db, "tarefas"), where("uid", "==", uid), orderBy("criadaEm", "desc"));
  unsubscribe = onSnapshot(q, (snap) => {
    const tasks = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    render(tasks);
  }, (err) => console.error("Erro ao ler tarefas:", err));
}

// CREATE
$("task-form").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const input = $("task-input"), titulo = input.value.trim();
  if (!titulo) return;
  await addDoc(collection(db, "tarefas"), {
    titulo, concluida: false, uid: auth.currentUser.uid, criadaEm: serverTimestamp()
  });
  input.value = "";
});

// UPDATE
const toggle = (t) => updateDoc(doc(db, "tarefas", t.id), { concluida: !t.concluida });
const rename = (id, titulo) => updateDoc(doc(db, "tarefas", id), { titulo });
// DELETE
const remove = (id) => deleteDoc(doc(db, "tarefas", id));

// ---------- INTERFACE ----------
function render(tasks) {
  list.innerHTML = "";
  empty.hidden = tasks.length > 0;
  tasks.forEach((t) => {
    const li = document.createElement("li");
    li.className = "task" + (t.concluida ? " done" : "");

    const cb = document.createElement("input");
    cb.type = "checkbox"; cb.checked = t.concluida;
    cb.setAttribute("aria-label", "Concluir: " + t.titulo);
    cb.onchange = () => toggle(t);
    li.append(cb);

    if (editingId === t.id) {
      const inp = document.createElement("input");
      inp.type = "text"; inp.value = t.titulo; inp.className = "edit-input"; inp.maxLength = 120;
      const save = document.createElement("button");
      save.textContent = "Salvar edição";
      save.onclick = async () => {
        const v = inp.value.trim();
        if (v) await rename(t.id, v);
        editingId = null;
      };
      const cancel = document.createElement("button");
      cancel.textContent = "Cancelar";
      cancel.onclick = () => { editingId = null; render(tasks); };
      li.append(inp, save, cancel);
    } else {
      const span = document.createElement("span");
      span.className = "title"; span.textContent = t.titulo; // textContent evita XSS
      const edit = document.createElement("button");
      edit.textContent = "Editar";
      edit.onclick = () => { editingId = t.id; render(tasks); };
      const del = document.createElement("button");
      del.className = "del"; del.textContent = "Excluir tarefa";
      del.onclick = () => remove(t.id);
      li.append(span, edit, del);
    }
    list.append(li);
  });
}
