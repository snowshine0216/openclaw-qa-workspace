import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Persist sitemap, metadata, and domain markdown files.
 * @param {string} outputDir
 * @param {Array<{domain: string, content: string}>} domainSheets
 * @param {string} sitemapContent
 * @param {{generatedAt: string, sourceRepo: string, domains: Record<string, {componentCount: number, filePath: string}>}} metadata
 * @returns {Promise<{outputDir: string, filesWritten: string[], metadata: object}>}
 */
export async function saveKnowledgeToFile(outputDir, domainSheets, sitemapContent, metadata) {
  await fs.mkdir(outputDir, { recursive: true });
  const writes = [
    writeFile(path.join(outputDir, 'SITEMAP.md'), sitemapContent).then(() => 'SITEMAP.md'),
    writeFile(path.join(outputDir, 'metadata.json'), `${JSON.stringify(metadata, null, 2)}\n`).then(() => 'metadata.json'),
    ...domainSheets.map((sheet) => {
      const fileName = `${sheet.domain}.md`;
      return writeFile(path.join(outputDir, fileName), sheet.content).then(() => fileName);
    }),
  ];
  const filesWritten = await Promise.all(writes);
  return { outputDir, filesWritten, metadata };
}

/**
 * Write file content (overwrite mode).
 * @param {string} filePath
 * @param {string} content
 * @returns {Promise<void>}
 */
export async function writeFile(filePath, content) {
  await fs.writeFile(filePath, content, { encoding: 'utf8', flag: 'w' });
}
