// Fluxul săptămânal al întrebărilor (rulează în GitHub Actions, cu contul de serviciu Firebase).
// 1. Publică răspunsurile aprobate din <inbox>/answers.json: le scrie în întrebare (cititorul le vede în cont)
//    și, dacă cititorul a fost de acord, în qa_public (apar pe pagina analizei, în română și în engleză).
// 2. Exportă întrebările fără răspuns în <inbox>/pending.json, ca să fie pregătite răspunsurile.
// <inbox> e un depozit GitHub PRIVAT: conține adresele de email ale cititorilor, care nu ajung niciodată în depozitul public.
import { readFile, writeFile } from 'node:fs/promises';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const inbox = process.argv[2] ?? 'inbox';
// Cheia contului de serviciu. Copiată de pe telefon, poate avea rupturi de rând reale în loc de „\n”
// (JSON invalid); atunci se extrag doar câmpurile necesare.
function serviceAccount(raw = '') {
  try { return JSON.parse(raw); } catch { /* format stricat la copiere */ }
  const field = (k) => raw.match(new RegExp(`"${k}"\\s*:\\s*"([^"]*)"`))?.[1];
  const pem = raw.match(/-----BEGIN PRIVATE KEY-----[\s\S]*?-----END PRIVATE KEY-----/)?.[0];
  if (!pem || !field('client_email') || !field('project_id')) throw new Error('FIREBASE_SERVICE_ACCOUNT lipsește sau nu e o cheie de cont de serviciu');
  const body = pem.replace(/\\n/g, '\n').replace(/-----(BEGIN|END) PRIVATE KEY-----/g, '').replace(/\s+/g, '');
  const privateKey = `-----BEGIN PRIVATE KEY-----\n${body.match(/.{1,64}/g).join('\n')}\n-----END PRIVATE KEY-----\n`;
  return { projectId: field('project_id'), clientEmail: field('client_email'), privateKey };
}
initializeApp({ credential: cert(serviceAccount(process.env.FIREBASE_SERVICE_ACCOUNT)) });
const db = getFirestore();

// 1. Răspunsurile aprobate: [{ id, approved, question: { ro, en }, answer: { ro, en }, publishedAt? }]
let answers = [];
try { answers = JSON.parse(await readFile(`${inbox}/answers.json`, 'utf8')); } catch { /* încă nu există */ }
let published = 0;
for (const a of answers) {
  if (!a.approved || a.publishedAt) continue;
  const ref = db.collection('questions').doc(a.id);
  const snap = await ref.get();
  if (!snap.exists) { a.publishedAt = 'question-deleted'; continue; }
  const q = snap.data();
  await ref.update({ status: 'answered', answer: a.answer[q.lang] ?? a.answer.ro, answeredAt: FieldValue.serverTimestamp() });
  if (q.public) {
    await db.collection('qa_public').doc(a.id).set({ slug: q.slug, name: q.name, q: a.question, a: a.answer, answeredAt: FieldValue.serverTimestamp() });
  }
  a.publishedAt = new Date().toISOString();
  published++;
}
if (answers.length) await writeFile(`${inbox}/answers.json`, JSON.stringify(answers, null, 1) + '\n');

// 2. Întrebările fără răspuns
const snap = await db.collection('questions').where('status', '==', 'new').get();
const pending = snap.docs.map((d) => {
  const q = d.data();
  return { id: d.id, email: q.email, name: q.name, slug: q.slug, lang: q.lang, public: q.public, text: q.text, createdAt: q.createdAt?.toDate().toISOString() };
}).sort((a, b) => (a.createdAt ?? '').localeCompare(b.createdAt ?? ''));
await writeFile(`${inbox}/pending.json`, JSON.stringify(pending, null, 1) + '\n');
console.log(`răspunsuri publicate: ${published}; întrebări fără răspuns: ${pending.length}`);
