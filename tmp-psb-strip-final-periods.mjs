import fs from 'node:fs';

const translationFiles = [
  'src/i18n/translations/payroll-small-business/en.ts',
  'src/i18n/translations/payroll-small-business/ru.ts',
  'src/i18n/translations/payroll-small-business/pt.ts',
  'src/i18n/translations/payroll-small-business/es.ts',
];

const contentFiles = [
  'astro/content/page-heroes.ts',
  'astro/content/page-final-ctas.ts',
  'astro/content/site-hero-visuals/payroll-small-business.html',
  'astro/content/site-pages/payroll-small-business.html',
  'astro/pages/payroll-small-business.astro',
];

const translationPrefixes = [
  'hero.description',
  'heroVisual.subtitle',
  'intro.point1.description',
  'platform.description',
  'platform.eor.title',
  'platform.eor.feature1.description',
  'platform.eor.feature2.description',
  'platform.eor.feature3.description',
  'platform.cor.title',
  'platform.cor.feature1.description',
  'platform.cor.feature2.description',
  'platform.cor.feature3.description',
  'steps.item1.description',
  'steps.item2.description',
  'steps.item3.description',
  'steps.item4.description',
  'why.description',
  'why.item1.description',
  'why.item2.description',
  'why.item3.description',
  'why.item4.description',
  'why.item5.description',
  'finalCta.description',
];

function removeTrailingPeriod(text) {
  return text.endsWith('.') ? text.slice(0, -1) : text;
}

function walkObjectLiteral(text, path = [], replacements = []) {
  let i = 0;
  while (i < text.length) {
    const keyMatch = text.slice(i).match(/^\s*([A-Za-z0-9_]+):\s*/);
    if (!keyMatch) {
      i += 1;
      continue;
    }

    const key = keyMatch[1];
    i += keyMatch[0].length;

    if (text[i] === '{') {
      const start = i;
      let depth = 1;
      i += 1;
      let inString = false;
      let escaped = false;
      while (i < text.length && depth > 0) {
        const ch = text[i];
        if (inString) {
          if (escaped) escaped = false;
          else if (ch === '\\') escaped = true;
          else if (ch === '"') inString = false;
        } else if (ch === '"') {
          inString = true;
        } else if (ch === '{') {
          depth += 1;
        } else if (ch === '}') {
          depth -= 1;
        }
        i += 1;
      }
      walkObjectLiteral(text.slice(start + 1, i - 1), [...path, key], replacements).forEach((replacement) => {
        replacements.push({
          start: start + 1 + replacement.start,
          end: start + 1 + replacement.end,
          value: replacement.value,
        });
      });
      continue;
    }

    if (text[i] === '"') {
      const valueStart = i + 1;
      i += 1;
      let value = '';
      let escaped = false;
      while (i < text.length) {
        const ch = text[i];
        if (escaped) {
          value += ch;
          escaped = false;
        } else if (ch === '\\') {
          value += ch;
          escaped = true;
        } else if (ch === '"') {
          break;
        } else {
          value += ch;
        }
        i += 1;
      }
      const fullPath = [...path, key].join('.');
      if (translationPrefixes.includes(fullPath) && value.endsWith('.')) {
        replacements.push({ start: valueStart, end: i, value: removeTrailingPeriod(value) });
      }
    }
  }
  return replacements;
}

for (const file of translationFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const objectStart = source.indexOf('{');
  const objectEnd = source.lastIndexOf('};');
  const objectBody = source.slice(objectStart + 1, objectEnd);
  const replacements = walkObjectLiteral(objectBody).sort((a, b) => b.start - a.start);
  let nextBody = objectBody;
  for (const replacement of replacements) {
    nextBody = nextBody.slice(0, replacement.start) + replacement.value + nextBody.slice(replacement.end);
  }
  fs.writeFileSync(file, source.slice(0, objectStart + 1) + nextBody + source.slice(objectEnd), 'utf8');
}

const literalReplacements = [
  [
    'astro/content/page-heroes.ts',
    'Hire employees and pay contractors all over the world. Everything in one platform: from taxes and contracts to one-click bulk payments.',
    'Hire employees and pay contractors all over the world. Everything in one platform: from taxes and contracts to one-click bulk payments',
  ],
  [
    'astro/content/page-final-ctas.ts',
    'Optimize your payroll and focus on business growth today. Join thousands of popular companies that have already automated their global payouts.',
    'Optimize your payroll and focus on business growth today. Join thousands of popular companies that have already automated their global payouts',
  ],
  [
    'astro/content/site-hero-visuals/payroll-small-business.html',
    'June 2026 batch across 9 countries, employees, contractors, and local tax rules.',
    'June 2026 batch across 9 countries, employees, contractors, and local tax rules',
  ],
  [
    'astro/content/site-pages/payroll-small-business.html',
    'Payroll shouldn’t slow your business down. For small businesses, payroll can turn into chaos: endless tables, manual recalculation of taxes, and the fear of missing a deadline. Every hour spent on accounting and administration is an hour stolen from your growth.',
    'Payroll shouldn’t slow your business down. For small businesses, payroll can turn into chaos: endless tables, manual recalculation of taxes, and the fear of missing a deadline. Every hour spent on accounting and administration is an hour stolen from your growth',
  ],
  [
    'astro/content/site-pages/payroll-small-business.html',
    'We have separated the important processes to make it easier for you to manage both full-time employees and freelancers.',
    'We have separated the important processes to make it easier for you to manage both full-time employees and freelancers',
  ],
  [
    'astro/content/site-pages/payroll-small-business.html',
    'Full-time recruitment without opening legal entities and hiring legal and accounting consultants abroad.',
    'Full-time recruitment without opening legal entities and hiring legal and accounting consultants abroad',
  ],
  [
    'astro/content/site-pages/payroll-small-business.html',
    'We become the official employer for your employees in 150+ countries.',
    'We become the official employer for your employees in 150+ countries',
  ],
  [
    'astro/content/site-pages/payroll-small-business.html',
    'We take care of the calculation of contributions, health insurance and pension contributions according to local laws.',
    'We take care of the calculation of contributions, health insurance and pension contributions according to local laws',
  ],
  [
    'astro/content/site-pages/payroll-small-business.html',
    'All employment contracts and reports are executed flawlessly and are available to you at any time.',
    'All employment contracts and reports are executed flawlessly and are available to you at any time',
  ],
  [
    'astro/content/site-pages/payroll-small-business.html',
    'Scale payments to team members in one click wherever they are.',
    'Scale payments to team members in one click wherever they are',
  ],
  [
    'astro/content/site-pages/payroll-small-business.html',
    'Pay via SWIFT, SEPA or in the crypto. Your performers can receive money in a convenient way.',
    'Pay via SWIFT, SEPA or in the crypto. Your performers can receive money in a convenient way',
  ],
  [
    'astro/content/site-pages/payroll-small-business.html',
    'No more billing. The system generates invoices automatically.',
    'No more billing. The system generates invoices automatically',
  ],
  [
    'astro/content/site-pages/payroll-small-business.html',
    'Automatic transfer of intellectual property rights to you with each payment.',
    'Automatic transfer of intellectual property rights to you with each payment',
  ],
  [
    'astro/content/site-pages/payroll-small-business.html',
    'Create a company profile and go through a quick verification process.',
    'Create a company profile and go through a quick verification process',
  ],
  [
    'astro/content/site-pages/payroll-small-business.html',
    'Invite employees (EoR) or contractors (CoR) and assign them roles.',
    'Invite employees (EoR) or contractors (CoR) and assign them roles',
  ],
  [
    'astro/content/site-pages/payroll-small-business.html',
    'Transfer funds to your account in a convenient way.',
    'Transfer funds to your account in a convenient way',
  ],
  [
    'astro/content/site-pages/payroll-small-business.html',
    'One click, and the money is sent to the entire team, including all taxes.',
    'One click, and the money is sent to the entire team, including all taxes',
  ],
  [
    'astro/content/site-pages/payroll-small-business.html',
    'Our advantages that save you time and money.',
    'Our advantages that save you time and money',
  ],
  [
    'astro/content/site-pages/payroll-small-business.html',
    'Automated contracts and calculations free you from working with documentation.',
    'Automated contracts and calculations free you from working with documentation',
  ],
  [
    'astro/content/site-pages/payroll-small-business.html',
    'All contracts, invoices, and transactions are available in one place within the service.',
    'All contracts, invoices, and transactions are available in one place within the service',
  ],
  [
    'astro/content/site-pages/payroll-small-business.html',
    'Clear and transparent pricing, adapted to your budget.',
    'Clear and transparent pricing, adapted to your budget',
  ],
  [
    'astro/content/site-pages/payroll-small-business.html',
    'Launch mass payouts automatically as your business grows.',
    'Launch mass payouts automatically as your business grows',
  ],
  [
    'astro/content/site-pages/payroll-small-business.html',
    'Our personal team of experts is always in touch with you and your team.',
    'Our personal team of experts is always in touch with you and your team',
  ],
];

for (const [file, from, to] of literalReplacements) {
  const source = fs.readFileSync(file, 'utf8');
  fs.writeFileSync(file, source.split(from).join(to), 'utf8');
}
