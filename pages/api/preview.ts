import { NextApiHandler } from "next";
import { getStaticPageData } from 'data/get-static-page-data';
import { getPostBySlug } from 'data/posts';

interface PreviewParams {
  slug?: string;
  ln?: 'en' | 'ru';
}

const resolveStaticPage = async <T extends AboutData | HomeData>(contentKind: 'home' | 'about', locale: string) => {
  const data = await getStaticPageData<T>(locale, contentKind, [
    'title',
    'date',
    'content'
  ]);

  return {
    data: data.params,
    path: contentKind,
  }
};

const resolvers = {
  home(_: string, locale: string) {
    return resolveStaticPage('home', locale);
  },

  about(_: string, locale: string) {
    return resolveStaticPage('about', locale);
  },

  async blog(slug: string, locale: string) {
    const data = await getPostBySlug({
      locale,
      path: slug,
    });

    return {
      data: data.params,
      // We don't use req.query.slug as that might lead to open redirect vulnerabilities
      path: `/blog/${data.params.slug}`
    };
  },
}

const preview: NextApiHandler = async (req, res) => {
  const query: PreviewParams = req.query;

  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (!query.slug) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const slug = query.slug;
  const slugPath = query.slug.split('/');
  const contentKind = slugPath[0] as 'blog' | 'about' | 'home';

  // Fetch the headless CMS to check if the provided `slug` exists
  // getPostBySlug would implement the required fetching logic to the headless CMS
  const page = await resolvers[contentKind](slug, query.ln || 'en');

  // If the slug doesn't exist prevent preview mode from being enabled
  if (!page.path) {
    return res.status(401).json({ message: 'Invalid slug' });
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData(page.data);

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  res.redirect(page.path);
}

export default preview;