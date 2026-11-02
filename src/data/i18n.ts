/**
 * Traducerea în engleză a ce apare pe prima pagină (/en/): domenii, nume, grupuri,
 * cele 14 condiții pe fiecare set și explicațiile pe înțeles ale notelor.
 * Notele și datele sunt aceleași; se traduce doar textul.
 */
export type Lang = 'ro' | 'en';
type Three = [low: string, mid: string, high: string];

export const DOMAIN_EN: Record<string, { title: string; short: string; what: string; summary: string }> = {
  crypto: { title: 'Crypto assets', short: 'Crypto', what: 'launched and unlaunched tokens', summary: 'Market cap, volatility, adoption and regulation in the crypto market.' },
  startups: { title: 'Start-ups worldwide', short: 'Start-ups', what: 'recently listed companies, pre-IPO and start-ups', summary: 'Funding, valuations and the dynamics of start-up ecosystems worldwide.' },
  'startups/europa/romania': { title: 'Start-ups in Romania', short: 'Romania', what: 'tech companies founded in Romania', summary: '8 tech companies founded in Romania, from UiPath and Bitdefender to seed-stage start-ups, scored on the same 14 conditions.' },
  sp500: { title: 'S&P 500', short: 'S&P 500', what: 'the largest US companies', summary: '20 of the largest companies in the S&P 500, scored on the same 14 conditions, with figures from annual reports and weekly prices.' },
  marfuri: { title: 'Commodities', short: 'Commodities', what: 'mature and emerging commodities', summary: 'Energy, metals and agricultural products: prices, demand and supply.' },
  forex: { title: 'Forex', short: 'Forex', what: 'major and emerging currencies', summary: '15 currencies scored on the same 14 conditions, with IMF and BIS data and weekly exchange rates.' },
  'economii-emergente': { title: 'Emerging economies', short: 'Emerging', what: 'emerging economies, including Romania', summary: '15 emerging economies, including Romania, scored on the same 14 conditions, with IMF and BIS data and each country’s stock market.' },
};

export const NAME_EN: Record<string, string> = {
  // Forex (după cod)
  CHF: 'Swiss franc', EUR: 'Euro', JPY: 'Japanese yen', CNY: 'Chinese yuan', CAD: 'Canadian dollar', PLN: 'Polish zloty', USD: 'US dollar', AUD: 'Australian dollar',
  GBP: 'Pound sterling', MXN: 'Mexican peso', INR: 'Indian rupee', TRY: 'Turkish lira', BRL: 'Brazilian real', RON: 'Romanian leu', ZAR: 'South African rand',
};
export const COUNTRY_EN: Record<string, string> = {
  CL: 'Chile', VN: 'Vietnam', ID: 'Indonesia', IN: 'India', CN: 'China', MX: 'Mexico', PL: 'Poland', BR: 'Brazil', TR: 'Turkey', SA: 'Saudi Arabia',
  PH: 'Philippines', ZA: 'South Africa', AR: 'Argentina', RO: 'Romania', EG: 'Egypt',
};
export const STAGE_EN: Record<string, string> = {
  'Privată (seed)': 'Private (seed)',
  'Privată (Serie B + finanțare 2026)': 'Private (Series B + 2026 funding)',
  'Privată (Serie C, 2025)': 'Private (Series C, 2025)',
  'Privată, listare amânată': 'Private, listing postponed',
  'Privată (Serie A)': 'Private (Series A)',
  'Privată, fără investitori externi': 'Private, no outside investors',
  'Listată (NYSE: PATH)': 'Listed (NYSE: PATH)',
  'Privată (granturi UE + rundă seed)': 'Private (EU grants + seed round)',
};
export const GROUP_EN: Record<string, string> = {
  pre: 'Crypto, not launched', post: 'Crypto, launched, below peak', ipo: 'Recently listed', preipo: 'Pre-IPO',
  startup: 'Start-up with product', seed: 'Pre-product start-up', mature: 'Mature, below peak', emerging: 'Emerging',
};
export const ACCESS_EN: Record<string, string> = {
  'Cumpărabil': 'Buyable', 'Prin utilizare': 'By using it', 'Acces restrâns': 'Restricted access', 'Indirect': 'Indirect',
};
export const FOND_EN: Record<string, string> = {
  'Fond fără formă': 'Substance without form',
  'Fond confirmat': 'Substance confirmed',
  'Formă fără fond': 'Form without substance',
  'Fond în confirmare': 'Substance being confirmed',
};
export const PHOTO_ALT_EN: Record<string, string> = {
  crypto: 'A bitcoin coin resting on gold nuggets',
  startups: 'A team working on laptops in a modern office',
  romania: 'The Arch of Triumph in Bucharest, with cars in traffic',
  sp500: 'The New York Stock Exchange building with American flags',
  marfuri: 'Combines harvesting a wheat field',
  forex: 'Dollar and euro banknotes spread on a table',
  emergente: 'The tall buildings of Jakarta, Indonesia',
  fond: 'Tall shelves of old books in a library',
};

export const CRITERIA_EN: Record<string, [string, string][]> = {
  general: [
    ['Actually used', 'Real revenue, users or demand, not promises.'],
    ['Launch from strength', 'The best don’t rush: they launch when ready.'],
    ['Healthy funding', 'No investors who can sell heavily right away.'],
    ['Attracts skilled people', 'Talent, partners and builders move toward it.'],
    ['Real customers', 'Natural activity, not bought or subsidised.'],
    ['Credible team', 'A record of finishing things, no scandals.'],
    ['Well-distributed supply', 'Few shares or tokens waiting to flood the market.'],
    ['Organic community', 'People who came for the product, not quick gains.'],
    ['Obvious problem', 'Explainable in one sentence.'],
    ['Good entry price', 'Room to grow versus rivals or versus cost.'],
    ['Balanced media', 'Media euphoria has historically marked the top.'],
    ['Healthy price and volume', 'A steady price while usage grows.'],
    ['Few on the same bet', 'The less crowded, the better.'],
    ['Low risks', 'No lawsuits, scandals or major geopolitical risk.'],
  ],
  marfuri: [
    ['Real demand', 'Real, growing physical consumption, not just a story.'],
    ['Supply discipline', 'Producers or states limit supply (quotas, cuts, export controls).'],
    ['Inventories and market structure', 'Low and falling inventories = high score.'],
    ['New uses', 'New demand from technology: AI, batteries, energy, defence.'],
    ['Physical vs. speculative demand', 'Bought by those who use it, not only by funds betting on it.'],
    ['Price transparency', 'Public price, liquid exchange, reliable data.'],
    ['Supply-demand balance', 'Expected deficit = high score; surplus = low score.'],
    ['Buyer diversity', 'Many buyers across different industries.'],
    ['Irreplaceable', 'No cheap substitutes.'],
    ['Price vs. production cost', 'Price close to production cost = room to rise.'],
    ['Media (non-linear)', 'Balanced attention; media euphoria signals a top.'],
    ['Price and volume', 'Steady price with growing demand = good sign.'],
    ['Crowding (inverse)', 'Few speculators positioned = high score.'],
    ['Geopolitical / regulatory risk', 'Production concentrated in one country = low score.'],
  ],
  forex: [
    ['Real flows', 'Currency demand from trade and investment: current account, exports.'],
    ['Central bank discipline', 'Inflation under control, independent central bank.'],
    ['Reserves and external debt', 'Large FX reserves versus short-term debt.'],
    ['New roles', 'The currency gains ground in trade settlement or other states’ reserves.'],
    ['Genuine flows', 'Demand from the real economy, not just speculative carry trade.'],
    ['Credible institutions', 'Predictable government and central bank, no erratic intervention.'],
    ['Real interest rate', 'Interest rate minus inflation favours the currency.'],
    ['Diversified economy', 'Varied exports, not dependence on one commodity.'],
    ['Safe-haven role', 'Sought in crises or for settlement.'],
    ['Valuation', 'Undervalued versus fundamentals (purchasing power parity, real effective rate).'],
    ['Media (non-linear)', 'Balanced attention; panic or euphoria mark the extremes.'],
    ['Trend and volatility', 'Healthy trend, no sudden jumps.'],
    ['Crowding (inverse)', 'Few speculators on the same side (CFTC reports).'],
    ['Political risk', 'No sanctions, capital controls or political crises.'],
  ],
  'economii-emergente': [
    ['Real growth', 'GDP and domestic demand growing, driven by consumption and investment.'],
    ['Fiscal discipline', 'Budget deficit under control.'],
    ['Debt and financing', 'Sustainable external debt, little of it short-term.'],
    ['New sectors', 'Technology, nearshoring, critical minerals.'],
    ['Long-term capital', 'Foreign direct investment, not just speculative capital.'],
    ['Quality of institutions', 'Rule of law, predictability, low corruption.'],
    ['Inflation and real rate', 'Falling inflation, positive real interest rate.'],
    ['Diversified exports', 'Several industries and many trading partners.'],
    ['Strategic position', 'Resources or a hard-to-replace role in global supply chains.'],
    ['Valuation', 'Stock market and currency cheap versus history and peers.'],
    ['Media (non-linear)', 'Balanced attention; euphoria marks the top.'],
    ['Trend and volume', 'The market rises on healthy volume.'],
    ['Crowding (inverse)', 'International funds still underweight.'],
    ['Geopolitical risk', 'No conflicts, sanctions or sudden regime change.'],
  ],
  sp500: [
    ['Real revenue', 'Growing revenue and profit, not just promises.'],
    ['Capital discipline', 'Buybacks from profit, no shareholder dilution.'],
    ['Solid balance sheet', 'Low debt versus cash and profit.'],
    ['New markets', 'Real exposure to new growth (AI, energy, health).'],
    ['Recurring customers', 'Diversified, repeat revenue, not a few big clients.'],
    ['Credible management', 'Promises kept, clean governance.'],
    ['Margins and cash flow', 'Rising margins and free cash flow.'],
    ['Diversity', 'Several products, markets and customer types.'],
    ['Competitive advantage', 'Hard to copy: network, brand, technology, costs.'],
    ['Valuation', 'Price versus earnings and cash flow, against history and sector.'],
    ['Media (non-linear)', 'Balanced attention; euphoria marks the top.'],
    ['Price and volume', 'Healthy trend, no volume divergence.'],
    ['Crowding (inverse)', 'Moderate institutional positioning, few bets on the same side.'],
    ['Low risks', 'No major lawsuits, investigations or regulatory risk.'],
  ],
};

const general: Three[] = [
  ['No users or revenue yet to prove demand; it is mostly a promise.', 'Has users or revenue, but demand is not fully proven yet.', 'Genuinely used: real users or revenue, not just promises.'],
  ['Rushed to market or listing, usually when enthusiasm peaked.', 'The launch timing says nothing special, good or bad.', 'Did not rush: launched (or delays launching) from strength, not out of need for money.'],
  ['Large investors can sell a lot quickly, which can weigh on the price.', 'Reasonable funding, with some risk of large sales.', 'Healthy funding: no investors able to flood the market.'],
  ['Attracts few skilled people, partners or new developers.', 'Attracts talent and partners at a normal pace.', 'Skilled people and partners move toward it: value recognised from the inside.'],
  ['Activity looks bought with rewards or subsidies, not organic.', 'Customers are real, but part of the activity is artificially boosted.', 'Customers come naturally and pay, not only for rewards.'],
  ['The team has scandals, key departures or broken promises.', 'Credible team, but without a long track record.', 'Credible team: has delivered and has no scandals.'],
  ['Many shares or tokens may soon hit the market and dilute holders.', 'Balanced supply, with some unlocks or issuance to watch.', 'Well-distributed supply: few new shares or tokens ready to flood the market.'],
  ['The community came mostly for quick gains.', 'A real community, mixed with speculators.', 'Organic community: people came for the product.'],
  ['The problem it solves is hard to explain or unclear.', 'The problem is real, but not very pressing.', 'Obvious problem: explained in one sentence, and people feel it.'],
  ['Expensive versus rivals or versus what it produces.', 'Fair price, with no clear discount.', 'Good entry price: cheap versus rivals, its peak or what it produces.'],
  ['The press is euphoric: historically, euphoria often marked the top.', 'Moderate press attention.', 'Balanced attention: neither ignored nor in euphoria.'],
  ['The price is falling or erratic, without support.', 'Stable price, no clear signals.', 'Healthy price behaviour: stable or rising, backed by volume.'],
  ['Too many have already bet on it: little room for new buyers.', 'Some investors are positioned, but it is not crowded.', 'Few on the same bet: still room for new buyers.'],
  ['High risks: lawsuits, scandals, regulation or geopolitics.', 'A few risks to watch, nothing serious.', 'Low risks: no lawsuits, scandals or major geopolitical exposure.'],
];
const marfuri: Three[] = [
  ['Real consumption is weak or falling.', 'Consumption is stable, with no clear growth.', 'Real and growing demand: the commodity is consumed, not just traded.'],
  ['Producers produce a lot and do not limit supply.', 'Supply is only partly limited.', 'Producers or states limit supply: quotas, cuts, export controls.'],
  ['Inventories are high, so there is no pressure on price.', 'Inventories are at a normal level.', 'Low or falling inventories: any demand shock can lift the price.'],
  ['No important new uses are appearing.', 'A few new uses, still small.', 'New uses from technology (AI, batteries, energy, defence) add demand.'],
  ['The price is moved mainly by funds placing bets.', 'Mixed demand: physical and speculative.', 'Bought mostly by those who use it, not only by those betting on it.'],
  ['The price is hard to find or differs widely between markets.', 'The price is public, but the market is small.', 'Transparent price: liquid exchange and reliable data.'],
  ['A surplus is expected: more supply than demand.', 'Demand and supply are roughly balanced.', 'A deficit is expected: more demand than supply.'],
  ['Few buyers, from few industries.', 'Buyers from a few industries.', 'Many buyers, across different industries.'],
  ['Has cheap substitutes.', 'Can be partly replaced.', 'Hard to replace: no cheap substitutes.'],
  ['The price is far above production cost.', 'The price is moderately above cost.', 'The price is close to production cost: more room up than down.'],
  ['Press euphoria: a historical top signal.', 'Moderate attention.', 'Balanced press attention.'],
  ['The price is falling with no sign of stopping.', 'The price is flat.', 'The price is stable or rising, backed by demand.'],
  ['Many speculators on the same side.', 'Moderate positioning.', 'Few speculators positioned: room for new buyers.'],
  ['Production is concentrated in a risky country or region.', 'A few geopolitical risks to watch.', 'Low geopolitical risk: spread-out production, stable rules.'],
];
const forex: Three[] = [
  ['The country imports far more than it exports: real demand for the currency is weak.', 'Foreign trade is roughly balanced.', 'The country exports more than it imports: the world needs its currency.'],
  ['Inflation is far from target: the central bank is not controlling it.', 'Inflation is slightly above target.', 'Inflation is close to target: a disciplined central bank.'],
  ['Large debt and deficits: the country depends on foreign financing.', 'Moderate debt.', 'Low debt and solid finances.'],
  ['The currency is not gaining new roles in the world.', 'Gaining some ground in trade or reserves.', 'Gaining new roles: increasingly used in trade or in other states’ reserves.'],
  ['Much of the demand comes from interest-rate bets (carry trade), which leave quickly.', 'Mixed demand: trade and speculation.', 'Demand comes from the real economy: trade and long-term investment.'],
  ['Unpredictable institutions: sudden decisions, political pressure.', 'Acceptable institutions, with some question marks.', 'Credible, predictable government and central bank.'],
  ['The interest rate is below inflation: money held in this currency loses value.', 'The interest rate is close to inflation.', 'The interest rate is above inflation: holding this currency is rewarded.'],
  ['The economy depends on a few products or a single commodity.', 'A partly diversified economy.', 'A diversified economy: many industries and partners.'],
  ['Not sought in crises.', 'Sought only regionally.', 'Safe-haven currency: the world buys it in a crisis.'],
  ['The currency is expensive versus the past year.', 'The currency is at a normal level.', 'The currency is cheap versus the past year.'],
  ['Extreme press attention: panic or euphoria often mark the extremes.', 'Moderate attention.', 'Balanced attention.'],
  ['The currency has lost ground recently.', 'The currency is stable.', 'The currency has appreciated recently, without sudden jumps.'],
  ['Many speculators on the same side.', 'Not yet assessed, or moderate positioning.', 'Few speculators on the same side.'],
  ['High political risk: sanctions, crises, capital controls.', 'A few political risks to watch.', 'Low political risk.'],
];
const emergente: Three[] = [
  ['The economy grows little or shrinks.', 'Moderate growth.', 'Strong economic growth.'],
  ['The state spends far more than it collects: a large budget deficit.', 'A moderate budget deficit.', 'A nearly balanced budget.'],
  ['High debt and dependence on foreign financing.', 'Moderate debt.', 'Sustainable debt and little foreign dependence.'],
  ['Few new sectors pulling the economy.', 'A few new sectors developing.', 'Strong new sectors: technology, relocated factories, critical minerals.'],
  ['Foreign capital is mostly speculative and can leave quickly.', 'Mixed capital: factories and speculation.', 'Foreign investors build factories and long-term businesses.'],
  ['Weak institutions: unevenly applied law, unpredictable decisions.', 'Average institutions.', 'Solid, predictable institutions.'],
  ['High inflation or an interest rate below inflation.', 'Inflation and interest rate roughly balanced.', 'Inflation under control and an interest rate above inflation.'],
  ['Exports concentrated in a few products.', 'Partly diversified exports.', 'Varied exports to many partners.'],
  ['A small role in global supply chains.', 'A regional role.', 'A strategic position: resources or factories that are hard to replace.'],
  ['The stock market is expensive versus the past year.', 'The stock market is at a normal level.', 'The stock market is cheap versus the past year.'],
  ['Press euphoria about this country.', 'Moderate attention.', 'Balanced attention.'],
  ['The stock market has fallen recently.', 'The stock market is stable.', 'The stock market has risen recently.'],
  ['International funds are already heavily exposed.', 'Not yet assessed, or moderate exposure.', 'International funds still underweight.'],
  ['High geopolitical risk: conflicts, sanctions, sudden changes.', 'A few risks to watch.', 'Low geopolitical risk.'],
];
const sp500: Three[] = [
  ['Revenue is falling or flat.', 'Revenue is growing slowly.', 'Revenue is growing strongly.'],
  ['The share count is rising: holders are diluted.', 'The share count is stable.', 'The company buys back shares from profit: each share is worth more.'],
  ['High debt versus the cash it generates.', 'Moderate debt.', 'Solid balance sheet: low debt or more cash than debt.'],
  ['Little exposure to new markets.', 'Moderate exposure to new markets.', 'Real exposure to growing new markets (AI, energy, health).'],
  ['Depends on a few large clients or one-off sales.', 'Partly recurring customers.', 'Customers who return and pay steadily (subscriptions, repeat consumption).'],
  ['Management with broken promises or governance issues.', 'Acceptable management.', 'Credible management that keeps its promises.'],
  ['Generates little free cash after investment, or even negative.', 'Generates moderate free cash.', 'Generates a lot of free cash after investment.'],
  ['Depends on a single product or market.', 'Partly diversified.', 'Diversified: many products and markets.'],
  ['Easy for competitors to copy.', 'A moderate competitive advantage.', 'Hard to copy: network, brand, technology or costs.'],
  ['Expensive versus the cash it generates.', 'Fair price.', 'Cheap versus the cash it generates.'],
  ['Press euphoria: a historical top signal.', 'Moderate attention.', 'Balanced attention.'],
  ['The stock has fallen recently.', 'The stock is stable.', 'The stock has risen recently.'],
  ['One of the most crowded trades: everyone already owns it.', 'Moderately crowded.', 'Not crowded: room for new buyers.'],
  ['High risks: lawsuits, investigations or regulation.', 'A few risks to watch.', 'Low risks.'],
];
export const SETS_EN: Record<string, Three[]> = { general, marfuri, forex, 'economii-emergente': emergente, sp500 };
export const NA_EN = 'Cannot be assessed yet (for example, the asset is not publicly traded).';
