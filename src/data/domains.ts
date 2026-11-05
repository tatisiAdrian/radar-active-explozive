import type { Domain } from './types';

/**
 * Registrul domeniilor. Pentru un domeniu nou: adaugă un obiect aici.
 * Pagina lui (/domenii/<slug>/) se generează automat.
 * Subdomeniile se definesc prin slug ierarhic, ex. "startups/europa/romania".
 */
export const domains: Domain[] = [
  // ——— Domenii active ———
  {
    slug: 'startups',
    title: 'Start-ups la nivel mondial',
    radarMarket: 'comp',
    criteria: 'general',
    summary: 'Finanțare, evaluări și dinamica ecosistemelor de start-up la nivel global.',
    status: 'activ',
    questions: [
      'Cât capital de risc s-a investit, pe ani și pe regiuni?',
      'Ce sectoare atrag cea mai mare parte a finanțării?',
      'Cum evoluează numărul de companii „unicorn”?',
    ],
  },
  {
    slug: 'startups/europa',
    title: 'Start-ups în Europa',
    radarMarket: 'comp',
    criteria: 'general',
    countries: ['GB', 'FR', 'SE', 'DE', 'RO'],
    summary: 'Ecosistemele de start-up europene, comparate pe țări.',
    status: 'activ',
    questions: [
      'Care sunt cele mai finanțate ecosisteme europene?',
      'Ce start-ups europene adună cele mai multe condiții?',
    ],
  },
  {
    slug: 'startups/europa/romania',
    title: 'Start-ups în România',
    radarMarket: 'comp',
    criteria: 'general',
    countries: ['RO'],
    summary: '22 de companii tech fondate în România, de la UiPath și Bitdefender la start-up-uri seed, notate pe aceleași 14 condiții.',
    status: 'activ',
    questions: [
      'Cum se compară România cu regiunea (Europa Centrală și de Est)?',
      'Care start-ups românești merită urmărite pe aceleași 14 condiții?',
      'Ce exit-uri au avut loc și la ce evaluări?',
    ],
  },
  {
    slug: 'startups/europa/marea-britanie',
    title: 'Start-ups în Marea Britanie',
    radarMarket: 'comp',
    criteria: 'general',
    countries: ['GB'],
    summary: 'Londra: fintech și AI, cel mai mare ecosistem din Europa.',
    status: 'activ',
    questions: [
      'Ce start-ups britanice sunt pe radar și câte condiții îndeplinesc?',
    ],
  },
  {
    slug: 'startups/europa/franta',
    title: 'Start-ups în Franța',
    radarMarket: 'comp',
    criteria: 'general',
    countries: ['FR'],
    summary: 'Parisul și campionii europeni ai inteligenței artificiale.',
    status: 'activ',
    questions: [
      'Ce start-ups franceze sunt pe radar și câte condiții îndeplinesc?',
    ],
  },
  {
    slug: 'startups/europa/suedia',
    title: 'Start-ups în Suedia',
    radarMarket: 'comp',
    criteria: 'general',
    countries: ['SE'],
    summary: 'Stockholm: fintech și software cu ambiții globale.',
    status: 'activ',
    questions: [
      'Ce companii suedeze sunt pe radar și câte condiții îndeplinesc?',
    ],
  },
  {
    slug: 'startups/america-de-nord',
    title: 'Start-ups în America de Nord',
    radarMarket: 'comp',
    criteria: 'general',
    countries: ['US', 'CA'],
    summary: 'SUA și Canada: cel mai mare bazin de capital de risc.',
    status: 'activ',
    questions: [
      'Ce pondere are America de Nord în finanțarea globală?',
      'Ce companii nord-americane adună cele mai multe condiții?',
    ],
  },
  {
    slug: 'startups/america-de-nord/sua',
    title: 'Start-ups în SUA',
    radarMarket: 'comp',
    criteria: 'general',
    countries: ['US'],
    summary: 'Silicon Valley, New York și restul ecosistemului american.',
    status: 'activ',
    questions: [
      'Ce companii americane sunt pe radar și cum au evoluat cele listate?',
    ],
  },
  {
    slug: 'startups/asia',
    title: 'Start-ups în Asia',
    radarMarket: 'comp',
    criteria: 'general',
    countries: ['CN', 'SG', 'IN'],
    summary: 'China, India, Asia de Sud-Est și alte ecosisteme asiatice.',
    status: 'activ',
    questions: [
      'Cum s-a schimbat echilibrul de finanțare între China și India?',
      'Ce companii asiatice sunt pe radar?',
    ],
  },
  {
    slug: 'startups/asia/china',
    title: 'Start-ups în China',
    radarMarket: 'comp',
    criteria: 'general',
    countries: ['CN'],
    summary: 'Giganți tehnologici și industriali, cu risc geopolitic ridicat.',
    status: 'activ',
    questions: [
      'Ce companii chineze sunt pe radar și cât cântărește riscul geopolitic?',
    ],
  },
  {
    slug: 'startups/asia/singapore',
    title: 'Start-ups în Singapore',
    radarMarket: 'comp',
    criteria: 'general',
    countries: ['SG'],
    summary: 'Hub regional pentru Asia de Sud-Est.',
    status: 'activ',
    questions: [
      'Ce companii cu sediul în Singapore sunt pe radar?',
    ],
  },
  {
    slug: 'startups/asia/india',
    title: 'Start-ups în India',
    radarMarket: 'comp',
    criteria: 'general',
    countries: ['IN'],
    summary: 'Al treilea ecosistem de start-up din lume ca număr de companii.',
    status: 'planificat',
    questions: [
      'Ce start-ups indiene merită urmărite pe aceleași 14 condiții?',
    ],
  },
  {
    slug: 'startups/oceania',
    title: 'Start-ups în Oceania',
    radarMarket: 'comp',
    criteria: 'general',
    countries: ['AU'],
    summary: 'Australia și Noua Zeelandă.',
    status: 'activ',
    questions: [
      'Ce companii din Oceania sunt pe radar?',
    ],
  },
  {
    slug: 'startups/america-latina',
    title: 'Start-ups în America Latină',
    radarMarket: 'comp',
    criteria: 'general',
    countries: ['BR'],
    summary: 'Brazilia, Mexic și restul regiunii.',
    status: 'planificat',
    questions: [
      'Ce fintech-uri latino-americane merită urmărite?',
    ],
  },
  {
    slug: 'startups/africa',
    title: 'Start-ups în Africa',
    radarMarket: 'comp',
    criteria: 'general',
    countries: ['NG', 'KE', 'EG', 'ZA'],
    summary: 'Nigeria, Kenya, Egipt și Africa de Sud.',
    status: 'planificat',
    questions: [
      'Unde se concentrează capitalul de risc din Africa?',
    ],
  },
  {
    slug: 'crypto',
    title: 'Criptoactive',
    radarMarket: 'crypto',
    criteria: 'general',
    summary: 'Capitalizare, volatilitate, adopție și reglementare pe piața cripto.',
    status: 'activ',
    questions: [
      'Cum a evoluat capitalizarea totală a pieței?',
      'Cât de volatile sunt principalele active comparativ cu acțiunile și aurul?',
      'Ce indicatori de adopție sunt verificabili public?',
    ],
    interpretations: [
      {
        title: 'Piața e dominată de Bitcoin',
        text: 'Bitcoin are 57,7% din capitalizarea totală, de peste cinci ori ponderea Ethereum (10,2%). Toate celelalte criptoactive la un loc cântăresc circa o treime. Practic, direcția Bitcoin decide în mare măsură direcția întregii piețe, iar un activ mic poate crește spectaculos doar dacă iese din această corelație.',
        basedOn: ['crypto-dominanta'],
      },
    ],
  },
  {
    slug: 'marfuri',
    title: 'Mărfuri',
    radarMarket: 'comm',
    criteria: 'marfuri',
    summary: 'Energie, metale și produse agricole: prețuri, cerere și ofertă.',
    status: 'activ',
    questions: [
      'Cum au evoluat prețurile principalelor mărfuri?',
      'Ce factori de ofertă și cerere explică mișcările recente?',
    ],
    interpretations: [
      {
        title: 'Energia: șoc de preț în Europa, nu și în SUA',
        text: 'În septembrie 2026, petrolul Brent a ajuns la 116,8 USD/baril, cu 69% peste media din 2025. Gazul european a urcat la 25,42 USD/mmbtu, mai mult decât dublu față de media 2025, în timp ce gazul american (2,95) e chiar sub media de anul trecut. Diferența dintre cele două piețe a crescut de la circa 3,4 ori în 2025 la 8,6 ori.',
        basedOn: ['marfuri-petrol-brent', 'marfuri-gaz-sua-europa'],
      },
      {
        title: 'Metalele: cuprul și argintul conduc',
        text: 'Față de media 2025, cuprul a crescut cu 45% (14.474 USD/tonă), argintul cu 62%, platina cu 40% și aurul cu 26%. Aurul costă acum de peste două ori cât în 2023. Nichelul (+8%) și minereul de fier (în scădere ușoară) rămân în urmă: oferta lor e abundentă.',
        basedOn: ['marfuri-metale-industriale', 'marfuri-aur-platina', 'marfuri-argint', 'marfuri-minereu-fier'],
      },
      {
        title: 'Agricultura: cerealele urcă, cacaoa și portocalele coboară',
        text: 'Grâul american e cu 43% peste media 2025, iar porumbul cu 18%. În sens opus, cacaoa a scăzut cu 24% după vârful crizei din 2024, iar portocalele au ajuns la circa o treime din media 2024. Mărfurile agricole se pot mișca puternic în ambele direcții în doar câteva luni.',
        basedOn: ['marfuri-cereale', 'marfuri-softs'],
      },
    ],
  },

  // ——— Domenii planificate ———
  {
    slug: 'forex',
    criteria: 'forex',
    title: 'Forex',
    summary: '22 de monede notate pe aceleași 14 condiții, cu date de la FMI, BIS și cursuri săptămânale.',
    status: 'activ',
    questions: [
      'Ce monede au cele mai solide fundamente: cont curent, inflație, datorie, dobândă reală?',
      'Cum influențează diferențialele de dobândă cursurile de schimb?',
      'Unde se află leul românesc față de monedele din regiune și față de cele majore?',
    ],
  },
  {
    slug: 'economii-emergente',
    criteria: 'economii-emergente',
    title: 'Economii emergente',
    summary: '22 de economii emergente, inclusiv România, notate pe aceleași 14 condiții, cu date FMI, BIS și bursa fiecărei țări.',
    status: 'activ',
    questions: [
      'Care economii emergente au cele mai solide fundamente macro?',
      'Unde e creșterea susținută de finanțe publice sănătoase și unde de datorie?',
      'Cum se compară România cu Polonia și cu restul piețelor emergente?',
    ],
  },
  {
    slug: 'sp500',
    criteria: 'sp500',
    title: 'S&P 500',
    summary: '22 dintre cele mai mari companii din indicele S&P 500, notate pe aceleași 14 condiții, cu cifre din rapoartele anuale și prețuri săptămânale.',
    status: 'activ',
    questions: [
      'Care dintre cele mai mari companii americane au cele mai solide fundamente: creștere, flux de numerar, bilanț?',
      'Unde e prețul acțiunii justificat de fluxul de numerar și unde e susținut doar de așteptări?',
      'Cât de aglomerate sunt investițiile în companiile legate de inteligența artificială?',
    ],
  },
  {
    slug: 'imobiliare',
    criteria: 'imobiliare',
    title: 'Piața imobiliară națională',
    summary: '22 de piețe imobiliare naționale, inclusiv România, notate pe aceleași 14 condiții, cu date BIS și FMI: prețul real al locuințelor, datoria gospodăriilor, dobânda reală.',
    status: 'activ',
    questions: [
      'În ce țări sunt locuințele scumpe sau ieftine față de propriul istoric, în termeni reali?',
      'Unde e cererea susținută de economie și de un deficit real de locuințe, și unde de credit ieftin sau de investitori străini?',
      'Cum se compară piața imobiliară din România cu cele din regiune și cu marile piețe ale lumii?',
    ],
  },
  {
    slug: 'proiecte-imobiliare',
    criteria: 'proiecte-imobiliare',
    title: 'Proiecte imobiliare de interes mondial',
    summary: '22 de proiecte imobiliare de interes mondial, de la centre de date și parcuri logistice la capitale noi, notate pe aceleași 14 condiții.',
    status: 'activ',
    questions: [
      'Care proiecte imobiliare mari au cerere reală, chiriași și finanțare sănătoasă?',
      'Care sunt doar formă: clădiri spectaculoase sau orașe noi fără oameni și fără venituri?',
      'Prin ce companii listate poate un investitor să ajungă la aceste proiecte?',
    ],
  },
  {
    slug: 'investitori-startups',
    criteria: 'investitori',
    title: 'Investitori în start-ups ca al nostru',
    summary: '22 de investitori internaționali care au finanțat start-ups ca al nostru, notați pe 14 condiții adaptate: capital proaspăt, tichet potrivit, teză care se potrivește, acces din România.',
    status: 'activ',
    questions: [
      'Ce investitori internaționali finanțează start-ups de fintech, date financiare și educație financiară, și au mai făcut-o?',
      'Care au capital proaspăt și o primă investiție potrivită pentru un start-up la pre-seed sau seed?',
      'Care investesc cu adevărat în România și în Europa Centrală și de Est?',
      'Ar evalua vreunul o colaborare directă cu noi? Invitația e deschisă tuturor celor 22.',
    ],
  },
  {
    slug: 'licee-romania',
    criteria: 'licee',
    title: 'Cele mai bune licee din România',
    summary: '11 licee de top, notate pe 14 condiții: media la BAC 2025, promovarea, ultima medie de admitere și ce primesc elevii față de cât de greu intră.',
    status: 'activ',
    questions: ["Care licee au cele mai bune rezultate la bacalaureat?", "Unde primesc elevii cel mai mult față de cât de greu e să intri?", "Merită un liceu de top din București față de unul din Iași sau Cluj?"],
  },
  {
    slug: 'facultati-romania',
    criteria: 'facultati',
    title: 'Cele mai bune universități din România',
    summary: '22 de universități românești, notate pe 14 condiții: clasamentele QS și THE 2026, angajabilitatea absolvenților, domeniile cerute și orașul.',
    status: 'activ',
    questions: ["Care universități românești au cea mai bună recunoaștere internațională?", "Unde își găsesc absolvenții cel mai ușor de lucru?", "Cât contează orașul în care studiezi?"],
  },
  {
    slug: 'meserii-romania',
    criteria: 'meserii',
    title: 'Cele mai bune meserii în România',
    summary: '11 meserii, notate pe 14 condiții: câștig, cererea angajatorilor, creșterea până în 2030, rezistența la AI, timpul de pregătire și riscurile.',
    status: 'activ',
    questions: ["Ce meserii combină un câștig bun cu o cerere mare?", "Care meserii sunt cele mai greu de înlocuit de inteligența artificială?", "Merită o meserie cu pregătire scurtă față de una cu studii lungi?"],
  },
  {
    slug: 'angajatori-romania',
    criteria: 'angajatori',
    title: 'Cei mai buni angajatori din România',
    summary: '11 angajatori, notați pe 14 condiții: dorința candidaților (Catalyst 2025), certificarea Top Employers 2026, salarii, stabilitate și șansele reale de angajare.',
    status: 'activ',
    questions: ["Care sunt angajatorii cei mai doriți și cât de greu e să intri la ei?", "Ce angajatori oferă locuri de muncă în toată țara?", "Unde e riscul de restructurare mai mare?"],
  },
  {
    slug: 'localitati-romania',
    criteria: 'localitati',
    title: 'Cele mai bune localități din România pentru o viață de calitate',
    summary: '11 orașe, notate pe 14 condiții: venituri, locuri de muncă, atractivitate, educație, sănătate, natură, conectivitate, costul locuinței și riscuri.',
    status: 'activ',
    questions: ["În ce orașe se trăiește cel mai bine, luând în calcul și costurile?", "Unde sunt salarii și locuri de muncă bune, fără aglomerația Capitalei?", "Ce oraș mic oferă o viață bună la costuri mici?"],
  },
  {
    slug: 'licee-europa',
    criteria: 'licee-eu',
    title: "Cele mai bune sisteme de licee din Europa",
    summary: "11 sisteme de licee europene, comparate pe țări: scorurile PISA 2022 la matematică, citire și științe, echitate, profesori și accesul pentru familiile care se mută.",
    status: 'activ',
    questions: ["În ce țări europene învață cel mai bine elevii de liceu?", "Unde depind rezultatele cel mai puțin de familia elevului?", "Unde e cel mai ușor pentru o familie din România care se mută?"],
  },
  {
    slug: 'facultati-europa',
    criteria: 'facultati',
    title: "Cele mai bune universități din Europa",
    summary: "22 de universități europene, notate pe 14 condiții: clasamentele QS Europa și QS mondial 2026, reputația globală, angajabilitatea, costurile și accesibilitatea.",
    status: 'activ',
    questions: ["Care sunt cele mai bune universități din Europa?", "Unde primești o educație de top la costuri rezonabile?", "Cât de greu e să intri și cât costă viața de student?"],
  },
  {
    slug: 'meserii-europa',
    criteria: 'meserii',
    title: "Cele mai bune meserii în Europa",
    summary: "11 meserii, notate pe 14 condiții, pe baza lipsei de personal raportate de EURES în 2025 și a raportului WEF despre viitorul locurilor de muncă.",
    status: 'activ',
    questions: ["Ce meserii lipsesc în toată Europa?", "Care meserii îți permit să lucrezi în orice țară din UE?", "Care sunt cele mai greu de înlocuit de AI?"],
  },
  {
    slug: 'angajatori-europa',
    criteria: 'angajatori',
    title: "Cei mai buni angajatori din Europa",
    summary: "11 angajatori, notați pe 14 condiții: Forbes World’s Best Employers 2025, certificările Top Employers Europe 2026, salarii, stabilitate și șanse reale de angajare.",
    status: 'activ',
    questions: ["Care sunt cei mai apreciați angajatori din Europa?", "Ce angajatori au practici de resurse umane certificate extern?", "Unde ai șanse reale să fii angajat?"],
  },
  {
    slug: 'localitati-europa',
    criteria: 'localitati',
    title: "Cele mai bune orașe din Europa pentru o viață de calitate",
    summary: "11 orașe europene, notate pe 14 condiții: indicele EIU de calitate a vieții 2026, satisfacția locuitorilor din raportul UE, venituri, cultură, costul locuinței și riscuri.",
    status: 'activ',
    questions: ["În ce orașe europene se trăiește cel mai bine?", "Unde e viața bună fără prețurile din Zürich sau Copenhaga?", "Cum se compară Clujul cu marile orașe ale Europei?"],
  },
  {
    slug: 'licee-lume',
    criteria: 'licee-lume',
    title: "Cele mai bune sisteme de licee din lume",
    summary: "11 sisteme de licee din lume, comparate pe țări și economii: scorurile PISA 2022 la matematică, citire și științe, echitate, profesori, presiunea asupra elevilor și accesul pentru familiile care se mută.",
    status: 'activ',
    questions: ["În ce țări din lume învață cel mai bine elevii de liceu?", "Cât costă rezultatele din Asia de Est, ca presiune asupra elevilor?", "Unde e cel mai ușor pentru o familie din România care se mută?"],
  },
  {
    slug: 'facultati-lume',
    criteria: 'facultati-lume',
    title: "Cele mai bune universități din lume",
    summary: "22 de universități din lume, notate pe 14 condiții: clasamentul mondial QS 2026, Times Higher Education 2026, angajabilitatea, cercetarea, costurile și cât de greu e să intri.",
    status: 'activ',
    questions: ["Care sunt cele mai bune universități din lume?", "Care dintre ele sunt mai accesibile ca admitere și costuri?", "Cum se compară universitățile americane cu cele europene și asiatice?"],
  },
  {
    slug: 'meserii-lume',
    criteria: 'meserii-lume',
    title: "Cele mai bune meserii în lume",
    summary: "11 meserii, notate pe 14 condiții, pe baza raportului WEF Future of Jobs 2025 (cele mai rapide creșteri și cele mai multe locuri noi până în 2030) și a studiului ManpowerGroup 2025 privind lipsa de talente.",
    status: 'activ',
    questions: ["Ce meserii cresc cel mai repede în lume până în 2030?", "Care meserii creează cele mai multe locuri de muncă noi?", "Care combină câștigul bun cu rezistența la AI?"],
  },
  {
    slug: 'angajatori-lume',
    criteria: 'angajatori-lume',
    title: "Cei mai buni angajatori din lume",
    summary: "Primii 11 angajatori din clasamentul Forbes World’s Best Employers 2026, notați pe 14 condiții: salarii, dezvoltare, soliditate, prezență globală și șansele reale de angajare.",
    status: 'activ',
    questions: ["Care sunt cei mai apreciați angajatori din lume?", "La care dintre ei ai șanse reale să fii angajat?", "Ce angajatori sunt prezenți și în Europa sau în România?"],
  },
  {
    slug: 'localitati-lume',
    criteria: 'localitati-lume',
    title: "Cele mai bune orașe din lume pentru o viață de calitate",
    summary: "11 orașe din lume, notate pe 14 condiții: indicele EIU de calitate a vieții 2026, venituri, servicii publice, siguranță, costul locuinței față de venit și riscuri.",
    status: 'activ',
    questions: ["În ce orașe din lume se trăiește cel mai bine?", "Unde e viața bună fără prețurile locuințelor din Sydney sau Vancouver?", "Ce riscuri au orașele de top, de la cutremure la incendii?"],
  },
];

export const getDomain = (slug: string) => domains.find((d) => d.slug === slug);

export const topLevel = () => domains.filter((d) => !d.slug.includes('/'));

export const childrenOf = (slug: string) =>
  domains.filter((d) => {
    const parent = d.slug.split('/').slice(0, -1).join('/');
    return parent === slug;
  });

export const breadcrumbs = (slug: string) =>
  slug
    .split('/')
    .map((_, i, parts) => getDomain(parts.slice(0, i + 1).join('/')))
    .filter((d): d is Domain => Boolean(d));
