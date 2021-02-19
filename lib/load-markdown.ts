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

const findExactFilePath = (folder: string, fileName: RegExp) => {
  const exactFileName = fs.readdirSync(folder).find(
    file => fileName.test(file),
  ) as string;

  return join(folder, exactFileName);
};

export const loadMarkdown = async (filePath: string, fileName: string | RegExp) => {
  const fileDir = join(contentDir, filePath);
  const fullPath = typeof fileName === 'string'
    ? join(fileDir, fileName)
    : await findExactFilePath(fileDir, fileName);
  const fileContents = await fs.promises.readFile(fullPath, 'utf8');

  return {
    ...matter(fileContents, {
      excerpt: firstLines
    }),
  };
};
