import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'fs';

export const getTemplateDirPath = (templateName: string) => {
  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    '../..',
    `template-${templateName}`,
  );
  return templateDir;
};

export const copy = (src: string, dest: string) => {
  fs.copyFileSync(src, dest);
};

export const mkDir = (dirPath: string) => {
  fs.mkdirSync(dirPath, { recursive: true });
};
