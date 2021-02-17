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

const getPostSlugs = (locales: string[]) => {
  return flatten(
    locales.map((locale) => {
      return fs.readdirSync(`${contentDir}/posts/${locale}`).map((path) => ({
        path,
        locale
      }));
    })
  );
};

export const getPostBySlug = <T extends PostParams>(
  slug: {
    locale: string;
    path: string;
  },
  fields: PostField[] = []
) => {
  const { data, content, realSlug, excerpt } = loadMarkdown(
    `posts/${slug.locale}`,
    slug.path
  );

  const post: {
    locale: string;
    params: T;
  } = {
    params: {} as T,
    locale: slug.locale
  };

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      post.params[field] = realSlug;
    }

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

export const getAllPosts = <T extends PostParams>(
  locales: string[] = [],
  fields: PostField[] = []
) => {
  const slugs = getPostSlugs(locales);
  const posts = slugs
    .map((slug) => getPostBySlug<T>(slug, fields))
    // sort posts by date in descending order
    .sort(
      (post1, post2) =>
        Date.parse(post2.params.date || '') -
        Date.parse(post1.params.date || '')
    );

  return posts;
};
