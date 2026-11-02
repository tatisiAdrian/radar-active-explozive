/**
 * Explicații pe înțelesul oricui pentru fiecare notă: pentru fiecare set de condiții
 * și fiecare condiție, o propoziție pentru notă mică (0–4), medie (5–6) și mare (7–10).
 * Lângă propoziție, paginile afișează și cifra din spate, acolo unde există.
 */
import { SOCIAL_SETS } from './social-criteria';

type Three = [low: string, mid: string, high: string];

const general: Three[] = [
  ['Încă nu are utilizatori sau venituri care să dovedească cererea; e mai mult promisiune.', 'Are utilizatori sau venituri, dar cererea nu e încă dovedită pe deplin.', 'E folosit cu adevărat: are utilizatori sau venituri reale, nu doar promisiuni.'],
  ['S-a grăbit spre bursă sau lansare, de obicei când entuziasmul era maxim.', 'Momentul lansării nu spune nimic special, nici bun, nici rău.', 'Nu s-a grăbit: s-a lansat (sau amână lansarea) din poziție de forță, nu din nevoie de bani.'],
  ['Investitori mari pot vinde mult și repede, ceea ce poate apăsa prețul.', 'Finanțarea e rezonabilă, cu câteva riscuri de vânzări mari.', 'Finanțare sănătoasă: nu există investitori care să poată inunda piața.'],
  ['Atrage puțini oameni pricepuți, parteneri sau dezvoltatori noi.', 'Atrage talent și parteneri într-un ritm normal.', 'Oamenii pricepuți și partenerii vin spre el: semn că valoarea e recunoscută din interior.'],
  ['Activitatea pare cumpărată cu recompense sau subvenții, nu venită natural.', 'Clienții sunt reali, dar o parte din activitate e stimulată artificial.', 'Clienții vin natural și plătesc, nu sunt atrași doar de recompense.'],
  ['Echipa are scandaluri, plecări importante sau promisiuni neținute.', 'Echipa e credibilă, dar fără un istoric lung de rezultate.', 'Echipă credibilă: a dus lucruri la capăt și nu are scandaluri.'],
  ['Multe acțiuni sau tokenuri pot ajunge curând pe piață și dilua deținătorii.', 'Oferta e echilibrată, cu unele deblocări sau emisiuni de urmărit.', 'Oferta e bine împărțită: puține acțiuni sau tokenuri noi gata să inunde piața.'],
  ['Comunitatea e venită mai ales pentru câștig rapid.', 'Comunitatea e reală, dar amestecată cu speculatori.', 'Comunitate naturală: oamenii au venit pentru produs.'],
  ['Problema rezolvată e greu de explicat sau neclară.', 'Problema e reală, dar nu foarte presantă.', 'Problemă evidentă: se explică într-o propoziție și oamenii o simt.'],
  ['Prețul e scump față de rivali sau față de ce produce.', 'Prețul e corect, fără o reducere clară.', 'Preț de intrare bun: ieftin față de rivali, față de vârf sau față de ce produce.'],
  ['Presa e în euforie: istoric, euforia a marcat adesea vârful.', 'Atenția presei e moderată.', 'Atenție echilibrată: nu e nici ignorat, nici în euforie.'],
  ['Prețul scade sau se mișcă haotic, fără susținere.', 'Prețul e stabil, fără semnale clare.', 'Prețul se comportă sănătos: stabil sau în creștere, cu volum care îl susține.'],
  ['Prea mulți au pariat deja pe el: puțin loc pentru cumpărători noi.', 'Unii investitori sunt deja poziționați, dar nu e aglomerat.', 'Puțini pe același pariu: e încă loc pentru cumpărători noi.'],
  ['Riscuri mari: procese, scandaluri, reglementare sau geopolitică.', 'Câteva riscuri de urmărit, fără ceva grav.', 'Riscuri mici: fără procese, scandaluri sau expunere geopolitică mare.'],
];

const marfuri: Three[] = [
  ['Consumul real e slab sau în scădere.', 'Consumul e stabil, fără creștere clară.', 'Cerere reală și în creștere: marfa e consumată, nu doar tranzacționată.'],
  ['Producătorii produc mult și nu limitează oferta.', 'Oferta e limitată doar parțial.', 'Producătorii sau statele limitează oferta: cote, tăieri, controale de export.'],
  ['Stocurile sunt mari, deci nu există presiune pe preț.', 'Stocurile sunt la un nivel normal.', 'Stocuri mici sau în scădere: orice șoc de cerere poate urca prețul.'],
  ['Nu apar utilizări noi importante.', 'Există câteva utilizări noi, încă mici.', 'Utilizări noi din tehnologie (AI, baterii, energie, apărare) adaugă cerere.'],
  ['Prețul e mișcat mai ales de fonduri care pariază.', 'Cererea e amestecată: fizică și speculativă.', 'Cumpără mai ales cine folosește marfa, nu doar cine pariază pe ea.'],
  ['Prețul e greu de aflat sau diferă mult între piețe.', 'Prețul e public, dar piața e mică.', 'Preț transparent: bursă lichidă și date de încredere.'],
  ['Se așteaptă surplus: mai multă ofertă decât cerere.', 'Cererea și oferta sunt aproape echilibrate.', 'Se așteaptă deficit: mai multă cerere decât ofertă.'],
  ['Puțini cumpărători, din puține industrii.', 'Cumpărători din câteva industrii.', 'Mulți cumpărători, din industrii diferite.'],
  ['Are înlocuitori ieftini.', 'Se poate înlocui parțial.', 'Greu de înlocuit: nu are substituenți ieftini.'],
  ['Prețul e mult peste costul de producție.', 'Prețul e moderat peste cost.', 'Prețul e aproape de costul de producție: mai mult loc în sus decât în jos.'],
  ['Euforie în presă: semnal istoric de vârf.', 'Atenție moderată.', 'Atenție echilibrată în presă.'],
  ['Prețul scade fără semne de oprire.', 'Prețul stagnează.', 'Prețul e stabil sau urcă, susținut de cerere.'],
  ['Mulți speculatori pe aceeași direcție.', 'Poziționare moderată.', 'Puțini speculatori poziționați: loc pentru cumpărători noi.'],
  ['Producția e concentrată într-o țară sau regiune riscantă.', 'Câteva riscuri geopolitice de urmărit.', 'Risc geopolitic mic: producție răspândită, reguli stabile.'],
];

const forex: Three[] = [
  ['Țara importă mult mai mult decât exportă: cererea reală pentru monedă e slabă.', 'Comerțul exterior e aproape echilibrat.', 'Țara exportă mai mult decât importă: lumea are nevoie de moneda ei.'],
  ['Inflația e departe de țintă: banca centrală nu o ține sub control.', 'Inflația e puțin peste țintă.', 'Inflația e aproape de țintă: bancă centrală disciplinată.'],
  ['Datoria și deficitele sunt mari: țara depinde de finanțare externă.', 'Datoria e moderată.', 'Datorie mică și finanțe solide.'],
  ['Moneda nu câștigă roluri noi în lume.', 'Câștigă ușor teren în comerț sau rezerve.', 'Câștigă roluri noi: e folosită tot mai des în comerț sau în rezervele altor state.'],
  ['Mare parte din cerere vine din pariuri pe dobândă (carry trade), care pleacă repede.', 'Cererea e amestecată: comerț și speculă.', 'Cererea vine din economia reală: comerț și investiții pe termen lung.'],
  ['Instituții imprevizibile: decizii bruște, presiuni politice.', 'Instituții acceptabile, cu unele semne de întrebare.', 'Guvern și bancă centrală credibile și previzibile.'],
  ['Dobânda e sub inflație: banii păstrați în această monedă pierd valoare.', 'Dobânda e aproape de inflație.', 'Dobânda e peste inflație: păstrarea banilor în această monedă e răsplătită.'],
  ['Economia depinde de puține produse sau de o singură marfă.', 'Economie parțial diversificată.', 'Economie diversificată: multe industrii și parteneri.'],
  ['Nu e căutată în crize.', 'E căutată doar regional.', 'Monedă-refugiu: lumea o cumpără când e criză.'],
  ['Moneda e scumpă față de ultimul an.', 'Moneda e la un nivel obișnuit.', 'Moneda e ieftină față de ultimul an.'],
  ['Atenția presei e extremă: panica sau euforia marchează adesea extremele.', 'Atenție moderată.', 'Atenție echilibrată.'],
  ['Moneda a pierdut teren recent.', 'Moneda e stabilă.', 'Moneda s-a apreciat recent, fără salturi bruște.'],
  ['Mulți speculatori pe aceeași direcție.', 'Încă neevaluat sau poziționare moderată.', 'Puțini speculatori pe aceeași direcție.'],
  ['Risc politic mare: sancțiuni, crize, controale de capital.', 'Câteva riscuri politice de urmărit.', 'Risc politic mic.'],
];

const emergente: Three[] = [
  ['Economia crește puțin sau scade.', 'Creștere moderată.', 'Creștere puternică a economiei.'],
  ['Statul cheltuie mult peste venituri: deficit bugetar mare.', 'Deficit bugetar moderat.', 'Buget aproape echilibrat.'],
  ['Datorie mare și dependență de finanțare externă.', 'Datorie moderată.', 'Datorie suportabilă și puțină dependență externă.'],
  ['Puține sectoare noi care să tragă economia.', 'Câteva sectoare noi în dezvoltare.', 'Sectoare noi puternice: tehnologie, fabrici relocate, minerale critice.'],
  ['Capitalul străin e mai ales speculativ și poate pleca repede.', 'Capital amestecat: fabrici și speculă.', 'Investitorii străini construiesc fabrici și afaceri pe termen lung.'],
  ['Instituții slabe: lege aplicată inegal, decizii imprevizibile.', 'Instituții medii.', 'Instituții solide și previzibile.'],
  ['Inflație mare sau dobândă sub inflație.', 'Inflație și dobândă aproape echilibrate.', 'Inflație sub control și dobândă peste inflație.'],
  ['Exporturi concentrate pe puține produse.', 'Exporturi parțial diversificate.', 'Exporturi variate, către mulți parteneri.'],
  ['Rol mic în lanțurile globale.', 'Rol regional.', 'Poziție strategică: resurse sau fabrici greu de înlocuit.'],
  ['Bursa e scumpă față de ultimul an.', 'Bursa e la un nivel obișnuit.', 'Bursa e ieftină față de ultimul an.'],
  ['Euforie în presă despre această țară.', 'Atenție moderată.', 'Atenție echilibrată.'],
  ['Bursa a scăzut recent.', 'Bursa e stabilă.', 'Bursa a crescut recent.'],
  ['Fondurile internaționale sunt deja foarte expuse.', 'Încă neevaluat sau expunere moderată.', 'Fondurile internaționale încă sub-expuse.'],
  ['Risc geopolitic mare: conflicte, sancțiuni, schimbări bruște.', 'Câteva riscuri de urmărit.', 'Risc geopolitic mic.'],
];

const sp500: Three[] = [
  ['Veniturile scad sau stagnează.', 'Veniturile cresc încet.', 'Veniturile cresc puternic.'],
  ['Numărul de acțiuni crește: deținătorii sunt diluați.', 'Numărul de acțiuni e stabil.', 'Compania își răscumpără acțiunile din profit: fiecare acțiune valorează mai mult.'],
  ['Datorie mare față de banii pe care îi generează.', 'Datorie moderată.', 'Bilanț solid: datorie mică sau mai mult numerar decât datorie.'],
  ['Puțină expunere la piețe noi.', 'Expunere moderată la piețe noi.', 'Expunere reală la piețe noi în creștere (AI, energie, sănătate).'],
  ['Depinde de câțiva clienți mari sau de vânzări unice.', 'Clienți parțial recurenți.', 'Clienți care revin și plătesc constant (abonamente, consum repetat).'],
  ['Conducere cu promisiuni neținute sau probleme de guvernanță.', 'Conducere acceptabilă.', 'Conducere credibilă, care își ține promisiunile.'],
  ['Generează puțini bani liberi după investiții, sau chiar negativ.', 'Generează bani liberi moderați.', 'Generează mulți bani liberi după investiții.'],
  ['Depinde de un singur produs sau o singură piață.', 'Parțial diversificată.', 'Diversificată: multe produse și piețe.'],
  ['Ușor de copiat de concurenți.', 'Avantaj competitiv moderat.', 'Greu de copiat: rețea, marcă, tehnologie sau costuri.'],
  ['Scumpă față de banii pe care îi generează.', 'Preț corect.', 'Ieftină față de banii pe care îi generează.'],
  ['Euforie în presă: semnal istoric de vârf.', 'Atenție moderată.', 'Atenție echilibrată.'],
  ['Acțiunea a scăzut recent.', 'Acțiunea e stabilă.', 'Acțiunea a crescut recent.'],
  ['Una dintre cele mai aglomerate investiții: toată lumea o deține deja.', 'Moderat aglomerată.', 'Puțin aglomerată: loc pentru cumpărători noi.'],
  ['Riscuri mari: procese, anchete sau reglementare.', 'Câteva riscuri de urmărit.', 'Riscuri mici.'],
];

const imobiliare: Three[] = [
  ['Economia crește puțin sau șomajul e mare: cererea de locuințe e slabă.', 'Cerere moderată: creștere și locuri de muncă la nivel obișnuit.', 'Economie în creștere și locuri de muncă: oamenii își permit locuințe.'],
  ['Se construiește mult peste nevoi sau stocurile de locuințe nevândute sunt mari.', 'Construcțiile sunt aproape de nevoi.', 'Oferta nouă e disciplinată: nu există un val de apartamente goale.'],
  ['Gospodăriile sunt deja foarte îndatorate.', 'Datoria gospodăriilor e moderată.', 'Gospodăriile au datorii mici: creditul poate crește sănătos.'],
  ['Puțini factori noi care să aducă cumpărători.', 'Câțiva factori noi de cerere.', 'Cerere nouă puternică: urbanizare, migrație, investiții, fabrici noi.'],
  ['Mare parte din cerere vine de la investitori care pariază pe preț.', 'Cerere amestecată: locuire și investiție.', 'Cumpără mai ales cei care locuiesc în casă.'],
  ['Reguli schimbătoare, proprietate sau cadastru nesigure.', 'Instituții acceptabile.', 'Proprietate sigură și reguli stabile pentru credite și chirii.'],
  ['Creditul e fie prea scump (frânează piața), fie prea ieftin (umflă o bulă).', 'Costul creditului e acceptabil.', 'Dobânda reală e moderată: creditul e accesibil, dar sănătos.'],
  ['Cererea e concentrată într-un singur oraș.', 'Câteva orașe dinamice.', 'Multe orașe și regiuni dinamice.'],
  ['Locuințe suficiente sau în surplus.', 'Un deficit moderat de locuințe.', 'Lipsesc locuințe: cererea depășește oferta pe termen lung.'],
  ['Prețul real e mult peste media ultimilor 10 ani.', 'Prețul real e aproape de medie.', 'Prețul real e sub media ultimilor 10 ani.'],
  ['Euforie sau panică în presă.', 'Atenție moderată.', 'Atenție echilibrată.'],
  ['Prețul real al locuințelor scade.', 'Prețul real e stabil.', 'Prețul real al locuințelor crește.'],
  ['Mulți investitori străini sau fonduri pe aceeași piață.', 'Poziționare moderată.', 'Puțini investitori pe același pariu.'],
  ['Risc mare: bulă de credit, crize politice sau taxe bruște.', 'Câteva riscuri de urmărit.', 'Risc mic.'],
];
const proiecte: Three[] = [
  ['Spațiile nu sunt încă cerute: cererea e o promisiune.', 'Cerere parțială, încă în confirmare.', 'Spații închiriate sau vândute, cu venituri reale.'],
  ['Proiect grăbit sau finanțat din nevoie de bani.', 'Momentul lansării nu spune nimic special.', 'Lansat sau extins dintr-o poziție de forță.'],
  ['Datorie mare sau finanțare nesigură.', 'Finanțare rezonabilă, cu câteva riscuri.', 'Finanțare sănătoasă și refinanțări fără presiune.'],
  ['Atrage puțini chiriași sau parteneri importanți.', 'Atrage parteneri într-un ritm normal.', 'Chiriași și parteneri mari vin spre proiect.'],
  ['Spațiile sunt cumpărate mai ales pe hârtie, de investitori.', 'Clienți reali, amestecați cu speculatori.', 'Spațiile sunt folosite de cei care le cumpără sau le închiriază.'],
  ['Dezvoltator cu întârzieri sau promisiuni neținute.', 'Dezvoltator credibil, fără un istoric lung.', 'Dezvoltator credibil, cu proiecte livrate la timp.'],
  ['Un val de spații concurente se livrează în aceeași zonă.', 'Oferta concurentă e moderată.', 'Puțină ofertă concurentă.'],
  ['Locul e încă gol: puțini oameni locuiesc sau lucrează acolo.', 'Viață parțială.', 'Loc viu: oamenii locuiesc și lucrează efectiv acolo.'],
  ['Nevoia pe care o rezolvă e neclară.', 'Nevoie reală, dar nu presantă.', 'Nevoie evidentă, ușor de explicat.'],
  ['Acțiunea e scumpă față de valoarea activelor.', 'Preț corect.', 'Acțiunea e ieftină față de valoarea activelor.'],
  ['Euforie în presă: semnal istoric de vârf.', 'Atenție moderată.', 'Atenție echilibrată.'],
  ['Acțiunea a scăzut recent.', 'Acțiunea e stabilă.', 'Acțiunea a crescut recent.'],
  ['Mulți investitori pe același pariu.', 'Poziționare moderată.', 'Puțini investitori pe același pariu.'],
  ['Riscuri mari: întârzieri, procese sau geopolitică.', 'Câteva riscuri de urmărit.', 'Riscuri mici.'],
];

export const SETS: Record<string, Three[]> = { general, marfuri, forex, 'economii-emergente': emergente, sp500, imobiliare, 'proiecte-imobiliare': proiecte, ...Object.fromEntries(Object.entries(SOCIAL_SETS).map(([k, v]) => [k, v.exRo])) };

/** Propoziția pe înțeles pentru nota v la condiția i (0-13) din setul dat. */
export function explain(set: string, i: number, v: number | null | undefined): string {
  if (v == null) return 'Nu se poate evalua încă (de exemplu, activul nu se tranzacționează public).';
  const t = SETS[set]?.[i];
  if (!t) return '';
  return v >= 7 ? t[2] : v >= 5 ? t[1] : t[0];
}

/**
 * Fond sau formă: compară notele de fond (cerere reală, clienți reali, echipă/instituții,
 * ofertă/dobândă/flux de numerar) cu semnalele de formă umflată (preț scump, euforie în presă, aglomerație).
 */
export type FondTag = 'fond-fara-forma' | 'fond-confirmat' | 'forma-fara-fond' | 'in-confirmare';
export const FOND_LABEL: Record<FondTag, string> = {
  'fond-fara-forma': 'Fond fără formă',
  'fond-confirmat': 'Fond confirmat',
  'forma-fara-fond': 'Formă fără fond',
  'in-confirmare': 'Fond în confirmare',
};
export const FOND_HINT: Record<FondTag, string> = {
  'fond-fara-forma': 'Fondul e solid, dar piața încă nu l-a „umflat”: prețul, presa și mulțimea nu au ajuns aici. E zona pe care o căutăm.',
  'fond-confirmat': 'Fondul e solid, iar piața l-a recunoscut deja: e mai puțin loc de surpriză în sus.',
  'forma-fara-fond': 'Se vede mai multă formă (preț, presă, aglomerație) decât fond (utilizare, clienți, finanțe). Risc mare de dezumflare.',
  'in-confirmare': 'Fondul există doar parțial: de urmărit dacă se confirmă.',
};
export function fondTag(c: (number | null | undefined)[]): FondTag {
  const avg = (xs: (number | null | undefined)[]) => {
    const v = xs.filter((x): x is number => typeof x === 'number');
    return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 5;
  };
  const fond = avg([c[0], c[4], c[5], c[6]]);
  const forma = avg([c[9], c[10], c[12]].map((x) => (typeof x === 'number' ? 10 - x : x)));
  if (fond >= 6.5) return forma <= 4.5 ? 'fond-fara-forma' : 'fond-confirmat';
  if (fond < 5 && forma >= 5) return 'forma-fara-fond';
  return 'in-confirmare';
}
