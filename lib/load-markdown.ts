import fsPromises from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import { contentDir } from 'consts';

// returns the first 4 lines of the contents
const firstLines = (file: string) => {
  const correctFile = (file as unknown) as { content: string; excerpt: string };

  correctFile.excerpt = correctFile.content.split('\n').slice(0, 4).join(' ');

  return correctFile.excerpt;
};

export const loadMarkdown = async (filePath: string, fileName: string) => {
  // {slug}.md -> {slug}
  const realSlug = fileName.replace(/\.md$/, '');
  const fullPath = join(contentDir, filePath, `${realSlug}.md`);
  const fileContents = await fsPromises.readFile(fullPath, 'utf8');

  return {
    ...matter(fileContents, {
      excerpt: firstLines
    }),
    realSlug
  };
};
