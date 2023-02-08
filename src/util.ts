import { readdir } from 'fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'fs';

export const dirExists = async (dirPath: string) => {
  try {
    const files = await readdir(dirPath);
    if (files.length == 0 || files.length > 0) {
      return true;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};

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
