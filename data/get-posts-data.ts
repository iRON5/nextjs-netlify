import fs from 'fs';
import { contentDir } from 'consts';
import { loadMarkdown } from 'lib/load-markdown';
import flatten from 'lodash/flatten';

type PostField =
  | 'title'
  | 'slug'
  | 'excerpt'
  | 'content'
  | 'date'
  | 'thumbnail';
type PostParams = Partial<Record<PostField, string>>;

const getPostNames = (locales: string[]) => {
  return flatten(
    locales.map(locale => {
      // get file names and extract slug from there
      // the slug is equal to value in the file content
      // so there is easier than read and parse file
      // {date}__{slug}.md -> {slug}
      return fs.readdirSync(`${contentDir}/posts/${locale}`).map(
        fileName => ({
          locale,
          slug: fileName.replace(/.+__(.+)\.md/, '$1'),
        }),
      );
    })
  );
};

export const getPostBySlug = async <T extends PostParams>(
  locale: string = 'ru',
  slug: string = '',
  fields: PostField[] = []
) => {
  const { data, content, excerpt } = await loadMarkdown(
    `posts/${locale}`,
    new RegExp(`\\d{4}-\\d{2}-\\d{2}__${slug}\.md`),
  );

  const post: {
    locale: string;
    params: T;
  } = {
    params: {} as T,
    locale,
  };

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'content') {
      post.params[field] = content;
    }

    if (field === 'excerpt') {
      post.params[field] = excerpt;
    }

    if (data[field]) {
      post.params[field] = data[field];
    }

    if (field === 'date') {
      post.params[field] = String(data[field]);
    }
  });

  return post;
};

export const getAllPosts = async <T extends PostParams>(
  locales: string[] = [],
  fields: PostField[] = []
) => {
  const postsParams = getPostNames(locales);
  const posts = await Promise.all(
    postsParams.map(async ({ locale, slug }) => await getPostBySlug<T>(locale, slug, fields))
  );

  // sort posts by date in descending order
  return posts.sort(
    (post1, post2) =>
      Date.parse(post2.params.date || '') -
      Date.parse(post1.params.date || '')
  );
};
