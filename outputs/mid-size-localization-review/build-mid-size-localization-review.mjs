import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SpreadsheetFile, Workbook } from '@oai/artifact-tool';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..', '..');
const sourceCsv = path.join(root, 'docs', 'mid-size-translation-review.csv');
const outputXlsx = path.join(__dirname, 'mid-size-translation-review.xlsx');
const previewReview = path.join(__dirname, 'mid-size-translation-review-review.png');
const previewMissing = path.join(__dirname, 'mid-size-translation-review-missing.png');

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ',') {
      row.push(cell);
      cell = '';
    } else if (ch === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else if (ch !== '\r') {
      cell += ch;
    }
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function indexRows(rows) {
  const [headers, ...body] = rows;
  return body.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])));
}

function matrixFor(rows, headers) {
  return [headers, ...rows.map((row) => headers.map((header) => row[header] ?? ''))];
}

function setWidths(sheet, widths) {
  widths.forEach((width, index) => {
    sheet.getRangeByIndexes(0, index, 1, 1).format.columnWidth = width;
  });
}

function styleSheet(sheet, usedRange, headerRange) {
  sheet.showGridLines = false;
  usedRange.format = {
    font: { name: 'Aptos', size: 10, color: '#111827' },
    wrapText: true,
    verticalAlignment: 'Top',
  };
  headerRange.format = {
    fill: '#0F172A',
    font: { bold: true, color: '#FFFFFF' },
    horizontalAlignment: 'Center',
    verticalAlignment: 'Middle',
    wrapText: true,
  };
  headerRange.format.rowHeight = 34;
  usedRange.format.borders = {
    insideHorizontal: { style: 'thin', color: '#E5E7EB' },
    insideVertical: { style: 'thin', color: '#E5E7EB' },
  };
  sheet.freezePanes.freezeRows(1);
}

function addStatusFormatting(sheet, rowCount, statusColLetter) {
  const range = sheet.getRange(`${statusColLetter}2:${statusColLetter}${rowCount}`);
  range.conditionalFormats.add('containsText', {
    text: 'not_in_draft',
    format: { fill: '#FEF3C7', font: { color: '#92400E' } },
  });
  range.conditionalFormats.add('containsText', {
    text: 'needs',
    format: { fill: '#DBEAFE', font: { color: '#1E40AF' } },
  });
  range.conditionalFormats.add('containsText', {
    text: 'exact',
    format: { fill: '#DCFCE7', font: { color: '#166534' } },
  });
  range.conditionalFormats.add('containsText', {
    text: 'draft_updates',
    format: { fill: '#F3E8FF', font: { color: '#6B21A8' } },
  });
}

const csvRows = parseCsv(await fs.readFile(sourceCsv, 'utf8'));
const data = indexRows(csvRows);
const reviewRows = data.filter((row) => row.section !== 'current_page_extra');
const missingRows = data.filter((row) => row.section === 'current_page_extra');

const workbook = Workbook.create();

const review = workbook.worksheets.add('Review');
const reviewHeaders = ['id', 'section', 'target', 'current_en', 'draft_en', 'ru', 'pt', 'es', 'source', 'status', 'note'];
const reviewMatrix = matrixFor(reviewRows, reviewHeaders);
review.getRangeByIndexes(0, 0, reviewMatrix.length, reviewHeaders.length).values = reviewMatrix;
styleSheet(
  review,
  review.getRangeByIndexes(0, 0, reviewMatrix.length, reviewHeaders.length),
  review.getRangeByIndexes(0, 0, 1, reviewHeaders.length),
);
setWidths(review, [11, 16, 30, 42, 42, 42, 42, 42, 34, 24, 48]);
review.getRangeByIndexes(1, 0, reviewMatrix.length - 1, 3).format.wrapText = false;
review.getRangeByIndexes(1, 3, reviewMatrix.length - 1, 5).format.rowHeight = 74;
review.getRangeByIndexes(1, 0, reviewMatrix.length - 1, reviewHeaders.length).format.verticalAlignment = 'Top';
review.tables.add(`A1:K${reviewMatrix.length}`, true, 'MidSizeReviewTable');
addStatusFormatting(review, reviewMatrix.length, 'J');

const missing = workbook.worksheets.add('Missing from draft');
const missingHeaders = ['id', 'target', 'current_en', 'source', 'status', 'note'];
const missingMatrix = matrixFor(missingRows, missingHeaders);
missing.getRangeByIndexes(0, 0, missingMatrix.length, missingHeaders.length).values = missingMatrix;
styleSheet(
  missing,
  missing.getRangeByIndexes(0, 0, missingMatrix.length, missingHeaders.length),
  missing.getRangeByIndexes(0, 0, 1, missingHeaders.length),
);
setWidths(missing, [12, 34, 66, 36, 20, 58]);
missing.getRangeByIndexes(1, 2, missingMatrix.length - 1, 4).format.rowHeight = 56;
missing.tables.add(`A1:F${missingMatrix.length}`, true, 'MidSizeMissingTable');
addStatusFormatting(missing, missingMatrix.length, 'E');

const summary = workbook.worksheets.add('Notes');
summary.showGridLines = false;
summary.getRange('A1:B7').values = [
  ['Mid-size localization review', ''],
  ['Draft rows matched', reviewRows.length],
  ['Current page strings missing from draft', missingRows.length],
  ['How to use', 'Edit translations directly in Review. Use Missing from draft to decide what to skip or translate manually.'],
  ['Status: exact_or_punctuation_only', 'Current English and draft English match except small punctuation/spacing differences.'],
  ['Status: draft_updates_current_copy', 'Draft has updated English copy that should replace current page text during implementation.'],
  ['Status: needs_key_or_markup', 'The page needs a translation key/data-translate marker or manual placement before localization.'],
];
summary.getRange('A1:B1').format = {
  fill: '#0F172A',
  font: { bold: true, color: '#FFFFFF', size: 12 },
};
summary.getRange('A1:B7').format = {
  wrapText: true,
  verticalAlignment: 'Top',
  font: { name: 'Aptos', size: 10, color: '#111827' },
};
summary.getRange('A1:B7').format.borders = { preset: 'all', style: 'thin', color: '#E5E7EB' };
summary.getRange('A:A').format.columnWidth = 36;
summary.getRange('B:B').format.columnWidth = 88;
summary.freezePanes.freezeRows(1);

const reviewPreview = await workbook.render({ sheetName: 'Review', range: 'A1:K12', scale: 1, format: 'png' });
await fs.writeFile(previewReview, new Uint8Array(await reviewPreview.arrayBuffer()));
const missingPreview = await workbook.render({ sheetName: 'Missing from draft', range: 'A1:F12', scale: 1, format: 'png' });
await fs.writeFile(previewMissing, new Uint8Array(await missingPreview.arrayBuffer()));

const errorScan = await workbook.inspect({
  kind: 'match',
  searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A',
  options: { useRegex: true, maxResults: 20 },
  summary: 'formula error scan',
});
await fs.writeFile(path.join(__dirname, 'verification.ndjson'), errorScan.ndjson, 'utf8');

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputXlsx);

console.log(JSON.stringify({
  outputXlsx,
  previewReview,
  previewMissing,
  reviewRows: reviewRows.length,
  missingRows: missingRows.length,
}, null, 2));
