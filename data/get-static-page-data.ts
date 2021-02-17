import { loadMarkdown } from 'lib/load-markdown';

export const getStaticPageData = <
  Params extends { [P in keyof Params]: Params[P] }
>(
  locale: string,
  page: 'home' | 'about',
  fields: (keyof Params)[] = []
) => {
  const { data, content } = loadMarkdown(page, locale);

  const post: {
    locale: string;
    params: Params;
  } = {
    params: {} as Params,
    locale
  };

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'content') {
      post.params[field] = content as Params[keyof Params];
    }

    if (data[field as string]) {
      post.params[field] = data[field as string];
    }
  });

  return post;
};
