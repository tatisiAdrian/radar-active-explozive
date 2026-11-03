/**
 * Întrebările cititorilor: cont cu email și parolă, cu adresa verificată prin email,
 * întrebări salvate în Firestore și răspunsuri publice. Codul rulează doar în browser.
 */
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, getIdToken, onAuthStateChanged, reload, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, type Auth, type User } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, query, serverTimestamp, setDoc, updateDoc, where, type Firestore, type Timestamp } from 'firebase/firestore';
import cfg from '../data/firebase-config.json';

export type Lang = 'ro' | 'en';
export interface MyQuestion { id: string; slug: string; lang: Lang; name: string; email?: string; text: string; public: boolean; status: string; answer?: string; createdAt?: Timestamp; answeredAt?: Timestamp }
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

/** Cont nou: email și parolă, apoi emailul de verificare (linkul confirmă adresa). */
export async function register(email: string, password: string, lang: Lang) {
  const { auth } = init();
  auth.languageCode = lang;
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(user, { url: `${location.origin}${location.pathname}#intrebari` });
}
export async function login(email: string, password: string) { await signInWithEmailAndPassword(init().auth, email, password); }
export async function resendVerification(u: User, lang: Lang) {
  init().auth.languageCode = lang;
  await sendEmailVerification(u, { url: `${location.origin}${location.pathname}#intrebari` });
}
export async function resetPassword(email: string, lang: Lang) {
  const { auth } = init();
  auth.languageCode = lang;
  await sendPasswordResetEmail(auth, email);
}
/** După ce cititorul a apăsat linkul de verificare: reîncarcă starea și cere un token nou, pe care regulile îl văd ca verificat. */
export async function refreshVerified(u: User) {
  await reload(u);
  if (u.emailVerified) await getIdToken(u, true);
  return u.emailVerified;
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

/** Administrare: doar adresa verificată a lui Daniel (aceeași regulă e în firestore.rules). */
export const ADMIN_EMAIL = 'nitadanielcristian@gmail.com';
export const isAdmin = (u: User | null) => !!u && u.emailVerified && u.email === ADMIN_EMAIL;

export async function allQuestions(): Promise<MyQuestion[]> {
  const snap = await getDocs(collection(init().db, 'questions'));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MyQuestion, 'id'>) })).sort((a, b) => (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0));
}

/** Publică răspunsul: în întrebare (cititorul îl vede în cont) și, cu acordul lui, în qa_public (apare pe pagina analizei). */
export async function publishAnswer(q: MyQuestion, question: Record<Lang, string>, answer: Record<Lang, string>) {
  const { db } = init();
  await updateDoc(doc(db, 'questions', q.id), { status: 'answered', answer: answer[q.lang] || answer.ro || answer.en, answeredAt: serverTimestamp() });
  if (q.public) await setDoc(doc(db, 'qa_public', q.id), { slug: q.slug, name: q.name, q: question, a: answer, answeredAt: serverTimestamp() });
}

export const fmt = (t: Timestamp | undefined, lang: Lang) =>
  t ? t.toDate().toLocaleDateString(lang === 'en' ? 'en-GB' : 'ro-RO', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

/** Textele interfeței, separate complet pe limbi. */
export const TXT = {
  ro: {
    status: { new: 'Primită: răspundem la actualizarea săptămânală', answered: 'Răspuns publicat' } as Record<string, string>,
    sent: 'Contul a fost creat. Ți-am trimis un email de verificare: apasă pe linkul din el, apoi revino aici.',
    verify: 'Adresa ta nu e încă verificată. Apasă pe linkul din emailul de verificare, apoi pe „Am verificat”.',
    resent: 'Ți-am retrimis emailul de verificare.',
    reset: 'Dacă adresa are cont, ți-am trimis un email pentru o parolă nouă.',
    wrong: 'Email sau parolă greșită.',
    exists: 'Există deja un cont cu această adresă. Intră în cont sau cere o parolă nouă.',
    weak: 'Parola trebuie să aibă cel puțin 8 caractere.',
    notyet: 'Adresa nu apare încă verificată. Apasă pe linkul din email și încearcă din nou.',
    signedAs: 'Autentificat ca',
    thanks: 'Mulțumim! Întrebarea a fost primită. Răspundem la actualizarea săptămânală, pe email și în contul tău.',
    err: 'Nu a mers. Încearcă din nou peste câteva momente.',
    none: 'Nu ai încă întrebări.',
    del: 'Șterge', delQ: 'Ștergi definitiv această întrebare?', pub: 'publică', priv: 'doar pentru tine',
    answer: 'Răspuns', you: 'Tu',
  },
  en: {
    status: { new: 'Received: we answer with the weekly update', answered: 'Answer published' } as Record<string, string>,
    sent: 'Your account has been created. We have sent you a verification email: click the link in it, then come back here.',
    verify: 'Your address is not verified yet. Click the link in the verification email, then “I have verified”.',
    resent: 'We have sent the verification email again.',
    reset: 'If the address has an account, we have sent you an email to set a new password.',
    wrong: 'Wrong email or password.',
    exists: 'An account with this address already exists. Sign in or ask for a new password.',
    weak: 'The password must have at least 8 characters.',
    notyet: 'The address does not appear verified yet. Click the link in the email and try again.',
    signedAs: 'Signed in as',
    thanks: 'Thank you! Your question has been received. We answer with the weekly update, by email and in your account.',
    err: 'That did not work. Please try again in a few moments.',
    none: 'You have no questions yet.',
    del: 'Delete', delQ: 'Delete this question permanently?', pub: 'public', priv: 'only for you',
    answer: 'Answer', you: 'You',
  },
};

export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
