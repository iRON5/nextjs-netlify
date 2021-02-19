import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { contentDir } from 'consts';

// returns the first 4 lines of the contents
const firstLines = (file: string) => {
  const correctFile = (file as unknown) as { content: string; excerpt: string };

  correctFile.excerpt = correctFile.content.split('\n').slice(0, 4).join(' ');

  return correctFile.excerpt;
};

const findExactFileName = (folder: string, fileName: RegExp) => {
  return fs.readdirSync(folder).find(
    file => fileName.test(file),
  ) as string;
};

export const loadMarkdown = async (filePath: string, fileName: string | RegExp) => {
  const fileDir = join(contentDir, filePath);
  const fullPath = typeof fileName === 'string'
    ? join(fileDir, fileName)
    : await findExactFileName(fileDir, fileName);
  const fileContents = await fs.promises.readFile(fullPath, 'utf8');

  return {
    ...matter(fileContents, {
      excerpt: firstLines
    }),
  };
};
