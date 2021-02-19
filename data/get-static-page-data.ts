import { loadMarkdown } from 'lib/load-markdown';

export const getStaticPageData = async <
  Params extends { [P in keyof Params]: Params[P] }
>(
  locale: string = 'ru',
  page: 'home' | 'about',
  fields: (keyof Params)[] = []
) => {
  const { data, content } = await loadMarkdown(`${page}/${locale}`, `${page}.md`);

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
