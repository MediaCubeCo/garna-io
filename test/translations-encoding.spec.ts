import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Если файл перевода сохранить не в UTF-8, кириллица и буквы с акцентами
// превращаются в «?» (так сломался виджет записи на /ru/white-label-payroll).
// Ловим «???» подряд и «?» между двумя буквами.
const LOST_CHARS = /\?{3,}|\p{L}\?\p{L}/u;

function listFiles(dir: string): string[] {
	return readdirSync(dir).flatMap((name) => {
		const path = join(dir, name);
		return statSync(path).isDirectory() ? listFiles(path) : [path];
	});
}

describe('translation files encoding', () => {
	const files = listFiles('src/i18n/translations').filter((path) => path.endsWith('.ts'));

	it.each(files)('%s has no characters lost to "?"', (path) => {
		const broken = readFileSync(path, 'utf8')
			.split('\n')
			.map((line, index) => ({ line: index + 1, text: line.trim() }))
			.filter(({ text }) => LOST_CHARS.test(text));
		expect(broken).toEqual([]);
	});
});
