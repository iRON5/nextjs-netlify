// import fs from 'fs';
// import path from 'path';
import React from 'react';
import { Layout } from 'components/layout';
import { getPostBySlug, getAllPosts } from 'data/posts';
import { markdownToHtml } from 'lib/markdown-to-html';
import { GetStaticPaths, GetStaticProps } from 'next';

interface PostData {
  title: string;
  date: string;
  thumbnail: string;
  content: string;
}

interface PostProps {
  post: PostData;
}

const Post: React.FC<PostProps> = ({ post }) => {
  if (!post) return <div>not found</div>;

  return (
    <Layout>
      <article>
        <h1>{post.title}</h1>
        <img src={post.thumbnail} alt="" />
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
      <style jsx>{`
        article {
          margin: 0 auto;
        }
        h1 {
          text-align: center;
        }
      `}</style>
    </Layout>
  );
};

interface PostPathParams {
  post: string;
  [key: string]: string;
}

export const getStaticPaths: GetStaticPaths<PostPathParams> = async ({
  locales
}) => {
  const posts = getAllPosts<{ slug: string }>(locales, ['slug']);

  return {
    paths: posts.map((post) => {
      return {
        locale: post.locale || 'en',
        params: {
          post: post.params.slug
        }
      };
    }),
    fallback: false
  };
};

export const getStaticProps: GetStaticProps<
  PostProps,
  PostPathParams
> = async ({ locale = 'en', params = {} }) => {
  const post = getPostBySlug<PostData>(
    {
      locale,
      path: params.post || ''
    },
    ['title', 'date', 'thumbnail', 'content']
  );
  const content = await markdownToHtml(post.params.content || '');

  return {
    props: {
      post: {
        ...post.params,
        content
      }
    }
  };
};

// export async function getStaticPaths({ locales }) {
//   const paths = await locales.reduce(async (localizedPaths, locale) => {
//     const files = await fs.readdirSync(
//       path.join(process.cwd(), `content/posts/${locale}`)
//     );

//     return [
//       ...localizedPaths,
//       ...files.map((path) => ({
//         locale,
//         params: { slug: path.split('.')[0] }
//       }))
//     ];
//   }, []);

//   return {
//     paths,
//     fallback: false // constrols whether not predefined paths should be processed on demand, check for more info: https://nextjs.org/docs/basic-features/data-fetching#the-fallback-key-required
//   };
// }

// export async function getStaticProps({ params, locale }) {
//   const { slug } = params;

//   const blogpost = await import(
//     `../../../content/posts/${locale}/${slug}.md`
//   ).catch(() => null);

//   return {
//     props: {
//       blogpost: blogpost.default
//     }
//   };
// }

export default Post;
