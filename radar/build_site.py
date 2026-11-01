import json, os, re

# Generează pagina radar (RO + EN) și instantaneul înghețat în public/.
# Rulează din rădăcina repo-ului: python3 radar/build_site.py
HERE = os.path.dirname(os.path.abspath(__file__))

TPL = open(os.path.join(HERE, "template.html"), encoding="utf-8").read()
DATA = json.load(open(os.path.join(HERE, "assets.json"), encoding="utf-8"))
OUT = os.path.join(HERE, "..", "public")

CRIT_LONG = {
 "ro": [["Folosit cu adevărat", "Venituri, utilizatori sau cerere reală, nu promisiuni."], ["Lansare din forță", "Cei mai buni nu se grăbesc: lansează când sunt gata."], ["Finanțare sănătoasă", "Fără investitori care pot vinde masiv imediat."], ["Atrage oameni pricepuți", "Talent, parteneri și constructori vin spre el."], ["Clienți reali", "Activitate naturală, nu cumpărată sau subvenționată."], ["Echipă credibilă", "Istoric de lucruri duse la capăt, fără scandaluri."], ["Ofertă bine împărțită", "Puține acțiuni sau tokenuri gata să inunde piața."], ["Comunitate naturală", "Oameni veniți pentru produs, nu doar pentru câștig rapid."], ["Problemă evidentă", "Se explică într-o propoziție."], ["Preț de intrare bun", "Loc de creștere față de rivali sau față de cost."], ["Media echilibrată", "Euforia mediatică a marcat, istoric, vârful."], ["Preț și volum sănătoase", "Preț stabil în timp ce utilizarea crește."], ["Puțini pe același pariu", "Cu cât mai puțină aglomerație, cu atât mai bine."], ["Riscuri mici", "Fără procese, scandaluri sau risc geopolitic mare."]],
 "en": [["Actually used", "Real revenue, users or demand, not promises."], ["Launch from strength", "The best don’t rush: they launch when ready."], ["Healthy funding", "No investors who can sell heavily right away."], ["Attracts skilled people", "Talent, partners and builders move toward it."], ["Real customers", "Natural activity, not bought or subsidised."], ["Credible team", "A record of finishing things, no scandals."], ["Well-distributed supply", "Few shares or tokens waiting to flood the market."], ["Organic community", "People who came for the product, not quick gains."], ["Obvious problem", "Explainable in one sentence."], ["Good entry price", "Room to grow versus rivals or versus cost."], ["Balanced media", "Media euphoria has historically marked the top."], ["Healthy price and volume", "A steady price while usage grows."], ["Few on the same bet", "The less crowded, the better."], ["Low risks", "No lawsuits, scandals or major geopolitical risk."]],
}
CRIT_GEN = {"ro": [c[0] for c in CRIT_LONG["ro"]], "en": [c[0] for c in CRIT_LONG["en"]]}
CRIT_COMM = {
 "ro": ["Cerere reală", "Disciplina ofertei", "Stocuri mici", "Utilizări noi", "Cerere fizică", "Preț transparent", "Deficit, nu surplus", "Cumpărători diverși", "De neînlocuit", "Preț vs. cost", "Media echilibrată", "Preț și volum", "Puțini speculatori", "Risc geopolitic mic"],
 "en": ["Real demand", "Supply discipline", "Low inventories", "New uses", "Physical demand", "Transparent price", "Deficit, not surplus", "Diverse buyers", "Irreplaceable", "Price vs cost", "Balanced media", "Price and volume", "Few speculators", "Low geopolitical risk"],
}

RO = dict(
 lang="ro", alt_lang="en", alt_href="en/", title="Radar Active Explozive", brand="Radar Active Explozive",
 meta_desc="Pre-identificăm din timp activele (crypto, companii, mărfuri) care adună cele mai multe condiții pentru o creștere explozivă a prețului. Acces gratuit. Nu este recomandare de investiții.",
 og_desc="Ce active adună acum cele mai multe condiții pentru o creștere explozivă — 88 de active în crypto, companii și mărfuri. Metodologie transparentă, acces gratuit.",
 nav_label="Navigare", nav_method="Metoda", nav_explorer="Toate activele", nav_buy="Unde cumperi", nav_trust="Transparență",
 lang_switch='<b>RO</b><a href="en/" hreflang="en" lang="en">EN</a>',
 hero_eyebrow="Pre-identificare · actualizat 29 octombrie 2026",
 hero_title="Găsim din timp activele care adună <em>cele mai multe condiții</em> pentru o creștere explozivă.",
 hero_lede="Creșterile de 5, 10 sau 50 de ori au fost precedate, de obicei, de aceleași semne. Le căutăm sistematic în crypto, companii și mărfuri și le punem pe un singur radar. E o listă de candidați de urmărit, nu un sfat de cumpărare.",
 st_assets="active analizate", st_markets="piețe", st_conditions="condiții verificate", st_strong="candidați puternici (10+)",
 cta_explore="Vezi toate activele", cta_method="Cum funcționează",
 radar_title="Radar cu toate activele: cu cât un punct e mai aproape de centru, cu atât îndeplinește mai multe condiții.",
 radar_hint="Centru = 14 condiții · zona verde = 10+",
 m_crypto="Crypto", m_comp="Companii", m_comm="Mărfuri",
 mk_eyebrow="Trei piețe, aceeași întrebare", mk_title="Unde se adună cele mai multe condiții?",
 mk_lede="Aplicăm aceleași 14 condiții la trei tipuri de active, ca să le putem compara corect.",
 mk_crypto_p="Tokenuri nelansate, unde te poziționezi folosind produsul, și tokenuri lansate care au căzut mult de la vârf.",
 mk_comp_p="Companii listate recent, companii private înainte de listare și startup-uri cu sau fără produs.",
 mk_comm_p="Mărfuri mature ajunse mult sub vârf și mărfuri emergente, încă fără o bursă lichidă.",
 mk_assets="active", mk_avg="condiții în medie", mk_leader="Pe primul loc:",
 ch_eyebrow="Pe scurt, în grafice", ch_title="Ce arată radarul acum", ch_lede="Trei grafice simple. Treci cu mouse-ul peste bare ca să vezi detaliile.",
 ch1_t="Top 10 active după condițiile îndeplinite", ch1_p="Linia verde punctată marchează pragul de 10 condiții, de la care un activ devine candidat puternic.",
 ch2_t="Câte active sunt în fiecare zonă", ch2_p="Cele mai multe active nu adună destule condiții. Asta e normal: căutăm excepțiile.",
 ch3_t="Înainte vs. după lansare", ch3_p="Media condițiilor îndeplinite. Proiectele bune care încă nu s-au lansat bifează, de regulă, mai multe condiții.",
 ch3_k1="Înainte de lansare", ch3_k2="După lansare",
 lv1_b="10+ din 14", lv1_s="Candidat puternic. Rar. Se urmărește săptămânal.", lv2_b="6 – 9", lv2_s="În observație. Urmărim dacă se adaugă condiții.", lv3_b="Sub 6", lv3_s="Lipsesc prea multe condiții, oricât de bună ar fi povestea.",
 picks_eyebrow="Acum pe radar", picks_title="Primii doi candidați din fiecare piață", picks_lede="Desenul arată profilul pe cele 14 condiții: cu cât forma e mai mare și mai rotundă, cu atât activul e mai complet. Punctele verzi sunt condițiile îndeplinite.",
 method_eyebrow="Metoda", method_title="Cum citești radarul, în trei pași", method_lede="Fără formule complicate. Fiecare activ trece prin aceleași 14 întrebări.",
 s1_t="Notăm 14 condiții", s1_p="Fiecare activ primește o notă de la 0 la 10 la fiecare condiție, pe baza datelor publice.",
 s2_t="Numărăm ce e îndeplinit", s2_p="O condiție e îndeplinită de la nota 7 în sus. Cu cât sunt mai multe, cu atât tabloul e mai complet.",
 s3_t="Comparăm și urmărim", s3_p="Scorul (0-10) arată calitatea de ansamblu. Candidații cu cele mai multe condiții intră pe lista de urmărit.",
 ex_eyebrow="Toate activele", ex_title="Caută, filtrează, compară", ex_lede="Apasă pe un rând ca să vezi profilul complet pe cele 14 condiții, contextul și unde se cumpără.",
 ex_markets="Piețe", ex_groups="Categorii", ex_search="Caută un activ…", ex_min="Condiții minime", ex_min_all="Toate", ex_min_6="6+ condiții", ex_min_10="10+ condiții",
 ex_sort="Ordonează după", ex_sort_k="Condiții îndeplinite", ex_sort_s="Scor", ex_sort_n="Nume",
 th_asset="Activ", th_score="Scor", th_cond="Condiții", th_access="Acces", th_where="Link", th_more="Detalii",
 buy_eyebrow="Unde cumperi", buy_title="Platforme, pe tipuri de active", buy_lede="Exemple, nu recomandări. Verifică disponibilitatea în țara ta și comisioanele înainte să-ți deschizi un cont.",
 v1_t="Crypto", v1_p="Burse centralizate pentru tokenurile deja lansate. Toate cer verificarea identității.", v1_binance="cele mai multe tokenuri de pe radar",
 v2_t="Acțiuni listate", v2_p="Brokeri cu acces la bursele din SUA și Hong Kong, unde sunt listate companiile de pe radar.", v2_etoro="include și CFD-uri, cu risc ridicat",
 v3_t="Mărfuri", v3_p="În UE, cea mai simplă cale sunt ETC-urile listate în Europa. Futures-urile cer cont special și folosesc levier.",
 v4_t="Companii private (pre-IPO)", v4_p="Piețe secundare, de obicei doar pentru investitori acreditați și cu sume minime mari.",
 scam_b="Atenție la site-urile false.", scam_p="Popularitatea unui proiect atrage copii frauduloase. Intră doar de pe adresa oficială și nu-ți da niciodată fraza secretă a portofelului.",
 tr_eyebrow="Transparență", tr_title="Cum lucrăm",
 t1_t="Date publice", t1_p="Prețuri și evaluări din surse publice: World Bank, burse, rapoarte ale companiilor și presă de specialitate.",
 t2_t="Judecată, nu algoritm secret", t2_p="Notele sunt puse de oameni, după criterii scrise. Le poți vedea pe fiecare, în profilul fiecărui activ.",
 t3_t="Actualizare săptămânală", t3_p="Radarul se revizuiește o dată pe săptămână. Data ultimei actualizări e mereu sus, pe prima pagină.",
 t4_t="Conflicte de interese", t4_p="Autorii pot deține poziții în unele dintre activele analizate. Le declarăm ca să poți judeca singur.",
 risk_b="Nu este o recomandare de investiții.", risk_p="Radarul nu garantează nicio creștere. Cele mai multe active cu potențial de explozie nu explodează, iar mișcarea poate fi și în jos, cu pierderi de 80-90%. Investește doar bani pe care îți permiți să-i pierzi integral.",
 footer="Radar Active Explozive · analiză independentă, acces gratuit · actualizat 29 octombrie 2026",
)
EN = dict(
 lang="en", alt_lang="ro", alt_href="../", title="Explosive Assets Radar", brand="Explosive Assets Radar",
 meta_desc="We pre-identify the assets (crypto, companies, commodities) that meet the most conditions for an explosive price rise. Free access. Not investment advice.",
 og_desc="Which assets now meet the most conditions for an explosive rise — 88 assets across crypto, companies and commodities. Transparent method, free access.",
 nav_label="Navigation", nav_method="Method", nav_explorer="All assets", nav_buy="Where to buy", nav_trust="Transparency",
 lang_switch='<a href="../" hreflang="ro" lang="ro">RO</a><b>EN</b>',
 hero_eyebrow="Pre-identification · updated 29 October 2026",
 hero_title="We spot early the assets that meet <em>the most conditions</em> for an explosive rise.",
 hero_lede="Rises of 5, 10 or 50 times were usually preceded by the same signs. We look for them systematically across crypto, companies and commodities and put them on one radar. It is a watchlist of candidates, not advice to buy.",
 st_assets="assets analysed", st_markets="markets", st_conditions="conditions checked", st_strong="strong candidates (10+)",
 cta_explore="See all assets", cta_method="How it works",
 radar_title="Radar of all assets: the closer a dot is to the centre, the more conditions it meets.",
 radar_hint="Centre = 14 conditions · green zone = 10+",
 m_crypto="Crypto", m_comp="Companies", m_comm="Commodities",
 mk_eyebrow="Three markets, one question", mk_title="Where do the most conditions add up?",
 mk_lede="We apply the same 14 conditions to three types of assets so they can be compared fairly.",
 mk_crypto_p="Tokens not yet launched, where you position yourself by using the product, and launched tokens far below their peak.",
 mk_comp_p="Recently listed companies, private companies before listing, and startups with or without a product.",
 mk_comm_p="Mature commodities far below their peak, and emerging commodities still without a liquid exchange.",
 mk_assets="assets", mk_avg="conditions on average", mk_leader="Top of the list:",
 ch_eyebrow="At a glance", ch_title="What the radar shows now", ch_lede="Three simple charts. Hover over the bars for details.",
 ch1_t="Top 10 assets by conditions met", ch1_p="The dotted green line marks the 10-condition threshold, where an asset becomes a strong candidate.",
 ch2_t="How many assets sit in each zone", ch2_p="Most assets do not meet enough conditions. That is normal: we are looking for the exceptions.",
 ch3_t="Before vs. after launch", ch3_p="Average conditions met. Good projects that have not launched yet usually meet more conditions.",
 ch3_k1="Before launch", ch3_k2="After launch",
 lv1_b="10+ of 14", lv1_s="Strong candidate. Rare. Checked weekly.", lv2_b="6 – 9", lv2_s="On watch. We track whether conditions get added.", lv3_b="Under 6", lv3_s="Too many conditions missing, however good the story.",
 picks_eyebrow="On the radar now", picks_title="The top two candidates in each market", picks_lede="The shape shows the profile on all 14 conditions: the larger and rounder, the more complete the asset. Green dots are conditions met.",
 method_eyebrow="Method", method_title="How to read the radar, in three steps", method_lede="No complicated formulas. Every asset goes through the same 14 questions.",
 s1_t="We score 14 conditions", s1_p="Each asset gets a score from 0 to 10 on every condition, based on public data.",
 s2_t="We count what is met", s2_p="A condition is met from a score of 7 upward. The more are met, the more complete the picture.",
 s3_t="We compare and watch", s3_p="The score (0-10) shows overall quality. Candidates with the most conditions go on the watchlist.",
 ex_eyebrow="All assets", ex_title="Search, filter, compare", ex_lede="Click a row to see the full profile on the 14 conditions, the context and where to buy.",
 ex_markets="Markets", ex_groups="Categories", ex_search="Search an asset…", ex_min="Minimum conditions", ex_min_all="All", ex_min_6="6+ conditions", ex_min_10="10+ conditions",
 ex_sort="Sort by", ex_sort_k="Conditions met", ex_sort_s="Score", ex_sort_n="Name",
 th_asset="Asset", th_score="Score", th_cond="Conditions", th_access="Access", th_where="Link", th_more="Details",
 buy_eyebrow="Where to buy", buy_title="Platforms, by type of asset", buy_lede="Examples, not recommendations. Check availability in your country and the fees before you open an account.",
 v1_t="Crypto", v1_p="Centralised exchanges for tokens already launched. All require identity verification.", v1_binance="most tokens on the radar",
 v2_t="Listed shares", v2_p="Brokers with access to US and Hong Kong exchanges, where the companies on the radar are listed.", v2_etoro="also offers CFDs, high risk",
 v3_t="Commodities", v3_p="In the EU, the simplest route is ETCs listed in Europe. Futures need a special account and use leverage.",
 v4_t="Private companies (pre-IPO)", v4_p="Secondary markets, usually for accredited investors only and with high minimums.",
 scam_b="Beware of fake sites.", scam_p="A popular project attracts fraudulent copies. Only use the official address and never share your wallet’s secret phrase.",
 tr_eyebrow="Transparency", tr_title="How we work",
 t1_t="Public data", t1_p="Prices and valuations from public sources: the World Bank, exchanges, company reports and specialist press.",
 t2_t="Judgement, not a secret algorithm", t2_p="Scores are set by people, against written criteria. You can see every one in each asset’s profile.",
 t3_t="Weekly updates", t3_p="The radar is reviewed once a week. The date of the last update is always at the top of the page.",
 t4_t="Conflicts of interest", t4_p="The authors may hold positions in some of the assets analysed. We say so, so you can judge for yourself.",
 risk_b="This is not investment advice.", risk_p="The radar guarantees no rise. Most assets with explosive potential never explode, and the move can go down too, with losses of 80-90%. Only invest money you can afford to lose entirely.",
 footer="Explosive Assets Radar · independent analysis, free access · updated 29 October 2026",
)
JS = {
 "ro": dict(score="Scor", cond_met="condiții îndeplinite", see_details="Vezi profilul", context="Context", profile="Profil pe 14 condiții (notă 0-10)", where="Unde se cumpără", open_link="Deschide", all="Toate", empty="Niciun activ nu corespunde filtrelor.",
   ring10="10", ring6="6", ring0="0 condiții", avgcond="medie condiții",
   lvname={"strong": "10+ condiții", "watch": "6-9 condiții", "weak": "sub 6"},
   access={"use": "Prin utilizare", "buy": "Cumpărabil", "restricted": "Acces restrâns", "closed": "Închis", "indirect": "Indirect"},
   g={"pre": "Crypto nelansat", "post": "Crypto lansat, sub vârf", "ipo": "Listate recent", "preipo": "Pre-IPO", "startup": "Startup cu produs", "seed": "Startup fără produs", "mature": "Matură, sub vârf", "emerging": "Emergentă"},
   pairlabel={"pre-post": "nelansate vs. lansate", "preipo-ipo": "pre-IPO vs. listate", "seed-startup": "startup fără vs. cu produs", "emerging-mature": "emergente vs. mature"},
   mnote={"crypto": "Tokenuri nelansate (te poziționezi folosind platforma) și lansate, mult sub vârf. Prețuri din 23 octombrie 2026.", "comp": "Companii listate, private și startup-uri. Doar cele listate se cumpără direct. Date din 26-29 octombrie 2026.", "comm": "Mărfuri mature și emergente. În UE, multe ETF-uri americane nu sunt disponibile; caută echivalentul european. Prețuri din sep.-oct. 2026."},
   gnote={"pre": "Nu se pot cumpăra încă. Linkul duce la platforma pe care o folosești ca să te poziționezi pentru o alocare gratuită (airdrop).", "post": "Se cumpără pe burse crypto. Istoric, cel mai bun moment a venit după capitulare, când utilizarea crește iar prețul stă.", "ipo": "Se cumpără prin orice broker cu acces la bursele din SUA sau Hong Kong.", "preipo": "Nu sunt pe bursă. Acțiuni apar ocazional pe piețe secundare, de regulă doar pentru investitori acreditați.", "startup": "Nu se tranzacționează public. Le urmărim pentru că anunță adesea următoarele listări.", "seed": "Evaluări de miliarde înainte de produs. Rundele sunt închise investitorilor obișnuiți.", "mature": "Se cumpără prin ETC/ETF-uri sau futures.", "emerging": "Cele mai multe nu se pot cumpăra direct; expunerea vine prin companii. Prețul din China și cel din afara ei pot diferi de câteva ori."}),
 "en": dict(score="Score", cond_met="conditions met", see_details="See profile", context="Context", profile="Profile on 14 conditions (score 0-10)", where="Where to buy", open_link="Open", all="All", empty="No asset matches these filters.",
   ring10="10", ring6="6", ring0="0 conditions", avgcond="average conditions",
   lvname={"strong": "10+ conditions", "watch": "6-9 conditions", "weak": "under 6"},
   access={"use": "By using it", "buy": "Buyable", "restricted": "Restricted", "closed": "Closed", "indirect": "Indirect"},
   g={"pre": "Crypto, not launched", "post": "Crypto, below peak", "ipo": "Recently listed", "preipo": "Pre-IPO", "startup": "Startup with product", "seed": "Pre-product startup", "mature": "Mature, below peak", "emerging": "Emerging"},
   pairlabel={"pre-post": "not launched vs. launched", "preipo-ipo": "pre-IPO vs. listed", "seed-startup": "startups without vs. with product", "emerging-mature": "emerging vs. mature"},
   mnote={"crypto": "Tokens not yet launched (you position yourself by using the platform) and launched tokens far below their peak. Prices from 23 October 2026.", "comp": "Listed companies, private companies and startups. Only the listed ones can be bought directly. Data from 26-29 October 2026.", "comm": "Mature and emerging commodities. In the EU many US ETFs are unavailable; look for the European equivalent. Prices from Sep-Oct 2026."},
   gnote={"pre": "Cannot be bought yet. The link goes to the platform you use to position yourself for a free allocation (airdrop).", "post": "Bought on crypto exchanges. Historically the best moment came after capitulation, when usage grows while the price stays flat.", "ipo": "Bought through any broker with access to US or Hong Kong exchanges.", "preipo": "Not listed. Shares occasionally appear on secondary markets, usually for accredited investors only.", "startup": "Not publicly traded. We track them because they often signal the next listings.", "seed": "Billion-dollar valuations before any product. Rounds are closed to ordinary investors.", "mature": "Bought through ETCs/ETFs or futures.", "emerging": "Most cannot be bought directly; exposure comes through companies. Prices inside and outside China can differ several-fold."}),
}


import hashlib
SNAP_DATE = "2026-10-29"
snap = {
  "snapshot": SNAP_DATE,
  "title": "Radar Active Explozive / Explosive Assets Radar - instantaneu #1",
  "method": {"conditions": 14, "met_threshold": 7, "weights": [16,6,6,8,6,8,8,4,6,6,6,6,6,8]},
  "price_rule": "Performanta se masoara cu pretul de inchidere publicat la data instantaneului si la data masurarii (CoinGecko pentru crypto, Yahoo Finance pentru actiuni si ETF-uri, World Bank pentru marfuri), comparat cu: Bitcoin, S&P 500, indicele de marfuri World Bank.",
  "assets": [{"id": a["id"], "market": a["m"], "group": a["g"], "name": a["n"]["ro"], "score": a["s"], "conditions_met": a["k"], "criteria": a["c"]} for a in sorted(DATA, key=lambda x: (x["m"], x["g"], x["id"]))],
}
snap_bytes = json.dumps(snap, ensure_ascii=False, indent=1, sort_keys=False).encode("utf-8")
SNAP_HASH = hashlib.sha256(snap_bytes).hexdigest()
os.makedirs(OUT + "/snapshots", exist_ok=True)
open(OUT + f"/snapshots/{SNAP_DATE}.json", "wb").write(snap_bytes)
open(OUT + f"/snapshots/{SNAP_DATE}.sha256", "w").write(f"{SNAP_HASH}  {SNAP_DATE}.json\n")
N = str(len(DATA)); NS = str(sum(1 for a in DATA if a["k"] >= 10))
COMMON = dict(snap_hash=SNAP_HASH, snap_hash_short=SNAP_HASH[:12] + "…", snap_n=N, snap_strong=NS)
RO.update(COMMON, nav_data="Date oficiale", data_href="domenii/", nav_history="Istoric", nav_about="Despre noi", snap_href=f"snapshots/{SNAP_DATE}.json",
 hi_eyebrow="Istoric verificabil", hi_title="Nu doar predicții: fiecare radar rămâne înghețat și se verifică",
 hi_lede="În fiecare vineri publicăm radarul ca fișier datat, care nu se mai modifică. La următoarele instantanee măsurăm cum s-au mișcat activele, pe toate, nu doar pe cele care au ieșit bine.",
 hs1_t="Înghețăm radarul", hs1_p="Lista completă, cu scoruri și condiții, se salvează ca fișier datat. Oricine îl poate descărca.",
 hs2_t="Dovedim că n-am umblat la el", hs2_p="Publicăm amprenta digitală (SHA-256) a fișierului. Dacă s-ar schimba măcar o virgulă, amprenta n-ar mai corespunde.",
 hs3_t="Măsurăm public rezultatul", hs3_p="Folosim prețuri de închidere din surse publice și comparăm cu Bitcoin, S&P 500 și un indice de mărfuri. Includem și greșelile.",
 sn_date="Instantaneu", sn_assets="Active", sn_strong="10+ condiții", sn_hash="Amprentă", sn_file="Fișier", sn_perf="Performanță",
 snap_date_label="29 octombrie 2026", sn_first="Instantaneul #1, punctul de pornire", sn_download="Descarcă JSON",
 sn_pending="Se calculează de la instantaneul următor (6 noiembrie 2026)",
 pf_t="Testul metodei", pf_p="Întrebarea pe care o urmărim public: activele cu 10+ condiții au evoluat mai bine decât cele cu sub 6? Graficul se completează după primele patru săptămâni. Dacă metoda nu funcționează, o spunem și o ajustăm.",
 pf_chart="Randament mediu pe zone. Disponibil după 4 instantanee.",
 past_perf="Performanța trecută nu este un indicator de încredere pentru rezultatele viitoare. Prețurile de referință se iau din surse publice la datele indicate, fără comisioane sau taxe.",
 ab_eyebrow="Despre noi", ab_title="Cine face radarul și de ce", ab_role="Autor · IT și piețe de capital",
 ab_p1="Am fost administrator al Primăvara SA, o companie listată la Bursa de Valori București, pe care am moștenit-o de la tatăl meu. Acolo am văzut din interior cum funcționează o companie listată: acționari, raportări, decizii sub presiune. Am văzut și cât de repede se poate pierde valoare când piața se întoarce.",
 ab_p2="Lucrez în IT de peste 22 de ani. Am implementat proiecte IT pentru Bursa de Valori București la Siveco, cu EY ca subcontractor, așa că am văzut bursa și din interiorul sistemelor ei. Investesc în crypto din 2015.",
 ab_p3="Radarul e metoda pe care mi-aș fi dorit-o atunci: aceleași 14 întrebări pentru orice activ, reguli scrise dinainte și un istoric public. Îl construiesc împreună cu fiul meu, ca să-l învăț să judece o investiție cu cap, nu din impuls.",
 ab_p4="Nu vindem semnale și nu spunem când să cumperi. Publicăm metoda, rezultatele și greșelile.",
 fq1_q="Dacă metoda e bună, de ce e publică?", fq1_a="Pentru că nu vindem nimic pe baza ei. Radarul nu spune când să cumperi sau să vinzi: arată doar ce active adună cele mai multe condiții. Publicând-o cu istoric înghețat, ne obligăm să fim verificați. O metodă ascunsă nu poate fi verificată de nimeni.",
 fq2_q="Vreți să faceți bani din vânzarea ei?", fq2_a="Nu. Accesul e gratuit și nu avem nimic de vândut: nici abonamente, nici semnale, nici cursuri plătite pe baza radarului.",
 fq3_q="Dețineți activele de pe radar?", fq3_a="Uneori, da. Autorul deține sau a deținut poziții în Lighter (LIT) și folosește Polymarket. Le declarăm ca să poți judeca singur și nu modificăm notele în funcție de pozițiile noastre.",
 fq4_q="Pot verifica eu singur un instantaneu?", fq4_a="Da. Descarcă fișierul JSON și calculează-i amprenta SHA-256 cu orice utilitar (de exemplu, comanda sha256sum sau un calculator online). Trebuie să obții exact amprenta publicată mai sus.",
)
EN.update(COMMON, nav_data="Official data", data_href="../domenii/", nav_history="Track record", nav_about="About", snap_href=f"../snapshots/{SNAP_DATE}.json",
 hi_eyebrow="Verifiable track record", hi_title="Not just predictions: every radar is frozen and checkable",
 hi_lede="Every Friday we publish the radar as a dated file that never changes. At the following snapshots we measure how the assets moved — all of them, not only the ones that worked out.",
 hs1_t="We freeze the radar", hs1_p="The full list, with scores and conditions, is saved as a dated file. Anyone can download it.",
 hs2_t="We prove we didn’t touch it", hs2_p="We publish the file’s digital fingerprint (SHA-256). If even one comma changed, the fingerprint would no longer match.",
 hs3_t="We measure the result in public", hs3_p="We use closing prices from public sources and compare with Bitcoin, the S&P 500 and a commodity index. Misses included.",
 sn_date="Snapshot", sn_assets="Assets", sn_strong="10+ conditions", sn_hash="Fingerprint", sn_file="File", sn_perf="Performance",
 snap_date_label="29 October 2026", sn_first="Snapshot #1, the starting point", sn_download="Download JSON",
 sn_pending="Calculated from the next snapshot (6 November 2026)",
 pf_t="The test of the method", pf_p="The question we track in public: did assets with 10+ conditions do better than those with under 6? The chart fills in after the first four weeks. If the method doesn’t work, we will say so and adjust it.",
 pf_chart="Average return by zone. Available after 4 snapshots.",
 past_perf="Past performance is not a reliable indicator of future results. Reference prices come from public sources on the dates shown, before any fees or taxes.",
 ab_eyebrow="About", ab_title="Who builds the radar, and why", ab_role="Author · IT and capital markets",
 ab_p1="I was a director of Primăvara SA, a company listed on the Bucharest Stock Exchange that I inherited from my father. There I saw from the inside how a listed company works: shareholders, reporting, decisions under pressure. I also saw how fast value can disappear when the market turns.",
 ab_p2="I have worked in IT for over 22 years. I delivered IT projects for the Bucharest Stock Exchange at Siveco, with EY as a subcontractor, so I have also seen the exchange from inside its systems. I have invested in crypto since 2015.",
 ab_p3="The radar is the method I wish I had back then: the same 14 questions for every asset, rules written in advance and a public track record. I am building it with my son, to teach him to judge an investment with his head, not on impulse.",
 ab_p4="We don’t sell signals and we don’t tell you when to buy. We publish the method, the results and the mistakes.",
 fq1_q="If the method is good, why is it public?", fq1_a="Because we sell nothing based on it. The radar doesn’t tell you when to buy or sell: it only shows which assets meet the most conditions. Publishing it with a frozen track record forces us to be checked. A hidden method can’t be checked by anyone.",
 fq2_q="Do you want to make money selling it?", fq2_a="No. Access is free and we have nothing to sell: no subscriptions, no signals, no paid courses based on the radar.",
 fq3_q="Do you hold the assets on the radar?", fq3_a="Sometimes, yes. The author holds or has held Lighter (LIT) and uses Polymarket. We disclose this so you can judge for yourself, and we don’t change scores based on our positions.",
 fq4_q="Can I verify a snapshot myself?", fq4_a="Yes. Download the JSON file and compute its SHA-256 fingerprint with any tool (for example the sha256sum command or an online calculator). You should get exactly the fingerprint published above.",
)

def build(lang, d, path):
    html = TPL
    for k, v in d.items():
        html = html.replace("[[" + k + "]]", v)
    js = dict(JS[lang], crit_long=CRIT_LONG[lang], crit_gen=CRIT_GEN[lang], crit_comm=CRIT_COMM[lang],
              m_crypto=d["m_crypto"], m_comp=d["m_comp"], m_comm=d["m_comm"])
    html = html.replace("[[DATA]]", json.dumps(DATA, ensure_ascii=False).replace("</", "<\\/"))
    html = html.replace("[[I18N]]", json.dumps(js, ensure_ascii=False).replace("</", "<\\/"))
    left = re.findall(r"\[\[[a-z0-9_]+\]\]", html)
    assert not left, (lang, sorted(set(left)))
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, "w", encoding="utf-8").write(html)
    print(lang, path, len(html))

assert set(RO) == set(EN), set(RO) ^ set(EN)
build("ro", RO, OUT + "/index.html")
build("en", EN, OUT + "/en/index.html")
