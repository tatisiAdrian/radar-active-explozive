/**
 * Întrebările cititorilor: autentificare cu link trimis pe email (care verifică adresa),
 * întrebări salvate în Firestore și răspunsuri publice. Codul rulează doar în browser.
 */
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, isSignInWithEmailLink, onAuthStateChanged, sendSignInLinkToEmail, signInWithEmailLink, signOut, type Auth, type User } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, query, serverTimestamp, where, type Firestore, type Timestamp } from 'firebase/firestore';
import cfg from '../data/firebase-config.json';

export type Lang = 'ro' | 'en';
export interface MyQuestion { id: string; slug: string; lang: Lang; name: string; text: string; public: boolean; status: string; answer?: string; createdAt?: Timestamp; answeredAt?: Timestamp }
export interface PublicQA { id: string; slug: string; name: string; q: Record<Lang, string>; a: Record<Lang, string>; answeredAt?: Timestamp }

export const configured = Boolean(cfg.apiKey && cfg.projectId);
let app: FirebaseApp | undefined, auth: Auth | undefined, db: Firestore | undefined;
function init() {
  if (!configured) throw new Error('Firebase nu e configurat');
  if (!app) {
    app = initializeApp({ apiKey: cfg.apiKey, authDomain: cfg.authDomain, projectId: cfg.projectId, appId: cfg.appId });
    auth = getAuth(app);
    db = getFirestore(app);
  }
  return { auth: auth!, db: db! };
}

const KEY = 'qa-email';
const store = {
  get: () => { try { return localStorage.getItem(KEY); } catch { return null; } },
  set: (v: string) => { try { localStorage.setItem(KEY, v); } catch { /* fără stocare locală */ } },
  del: () => { try { localStorage.removeItem(KEY); } catch { /* fără stocare locală */ } },
};

/** Trimite linkul de autentificare; linkul întoarce cititorul pe aceeași pagină. */
export async function sendLink(email: string, lang: Lang) {
  const { auth } = init();
  auth.languageCode = lang;
  const url = `${location.origin}${location.pathname}#intrebari`;
  await sendSignInLinkToEmail(auth, email, { url, handleCodeInApp: true });
  store.set(email);
}

/** Dacă pagina a fost deschisă din linkul primit pe email, finalizează autentificarea. */
export function pendingLink() {
  if (!configured) return false;
  return isSignInWithEmailLink(init().auth, location.href);
}
export const rememberedEmail = () => store.get();
export async function completeLink(email: string) {
  const { auth } = init();
  await signInWithEmailLink(auth, email, location.href);
  store.del();
  history.replaceState(null, '', `${location.pathname}#intrebari`);
}

export function watchUser(cb: (u: User | null) => void) { return onAuthStateChanged(init().auth, cb); }
export const logout = () => signOut(init().auth);

export async function ask(u: User, q: { slug: string; lang: Lang; name: string; text: string; public: boolean }) {
  const { db } = init();
  await addDoc(collection(db, 'questions'), { uid: u.uid, email: u.email, name: q.name, slug: q.slug, lang: q.lang, text: q.text, public: q.public, createdAt: serverTimestamp(), status: 'new' });
}

export async function myQuestions(u: User): Promise<MyQuestion[]> {
  const { db } = init();
  const snap = await getDocs(query(collection(db, 'questions'), where('uid', '==', u.uid)));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MyQuestion, 'id'>) })).sort((a, b) => (b.createdAt?.seconds ?? 9e9) - (a.createdAt?.seconds ?? 9e9));
}
export const removeQuestion = (id: string) => deleteDoc(doc(init().db, 'questions', id));

export async function publicAnswers(slug?: string): Promise<PublicQA[]> {
  const { db } = init();
  const c = collection(db, 'qa_public');
  const snap = await getDocs(slug ? query(c, where('slug', '==', slug)) : c);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<PublicQA, 'id'>) })).sort((a, b) => (b.answeredAt?.seconds ?? 0) - (a.answeredAt?.seconds ?? 0));
}

export const fmt = (t: Timestamp | undefined, lang: Lang) =>
  t ? t.toDate().toLocaleDateString(lang === 'en' ? 'en-GB' : 'ro-RO', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

/** Textele interfeței, separate complet pe limbi. */
export const TXT = {
  ro: {
    status: { new: 'Primită: răspundem la actualizarea săptămânală', answered: 'Răspuns publicat' } as Record<string, string>,
    sent: 'Ți-am trimis un link de autentificare. Deschide emailul și apasă pe link, din același browser.',
    confirm: 'Confirmă adresa de email la care ai primit linkul:',
    signedAs: 'Autentificat ca',
    thanks: 'Mulțumim! Întrebarea a fost primită. Răspundem la actualizarea săptămânală, pe email și în contul tău.',
    err: 'Nu a mers. Încearcă din nou peste câteva momente.',
    errLink: 'Linkul nu mai e valabil sau a fost deschis în alt browser. Cere un link nou.',
    none: 'Nu ai încă întrebări.',
    del: 'Șterge', delQ: 'Ștergi definitiv această întrebare?', pub: 'publică', priv: 'doar pentru tine',
    answer: 'Răspuns', you: 'Tu',
  },
  en: {
    status: { new: 'Received: we answer with the weekly update', answered: 'Answer published' } as Record<string, string>,
    sent: 'We have sent you a sign-in link. Open the email and click the link, in the same browser.',
    confirm: 'Confirm the email address at which you received the link:',
    signedAs: 'Signed in as',
    thanks: 'Thank you! Your question has been received. We answer with the weekly update, by email and in your account.',
    err: 'That did not work. Please try again in a few moments.',
    errLink: 'The link is no longer valid or was opened in another browser. Ask for a new link.',
    none: 'You have no questions yet.',
    del: 'Delete', delQ: 'Delete this question permanently?', pub: 'public', priv: 'only for you',
    answer: 'Answer', you: 'You',
  },
};

export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
