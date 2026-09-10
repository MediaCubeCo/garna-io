import { describe, expect, it } from 'vitest';
import ts from 'typescript';
import path from 'node:path';

describe('Worker TypeScript project boundary', () => {
  it('checks the Worker without depending on the standalone React widget installation', () => {
    const root = process.cwd();
    const configPath = path.join(root, 'tsconfig.json');
    const config = ts.readConfigFile(configPath, ts.sys.readFile);
    expect(config.error).toBeUndefined();
    const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
    expect(parsed.errors).toEqual([]);
    const program = ts.createProgram(parsed.fileNames, parsed.options);
    const files = program.getSourceFiles().map(file => file.fileName.replaceAll('\\', '/'));
    expect(files).toContain(path.join(root, 'src/index.ts').replaceAll('\\', '/'));
    expect(files.some(file => file.includes('/src/components/form-garna-component-main/'))).toBe(false);
  });
});
