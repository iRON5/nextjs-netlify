import React from 'react';
import Link from 'next/link';
import { Layout } from 'components/layout';
import { getAllPosts } from 'data/posts';
import { GetStaticProps } from 'next';

interface ShortPost {
  title: string;
  date: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
}

interface BlogProps {
  posts: {
    locale: string;
    params: ShortPost;
  }[];
}

const Blog: React.FC<BlogProps> = ({ posts }) => (
  <Layout>
    {posts.map((post) => (
      <div key={post.params.slug} className="post">
        <div>{new Date(post.params.date).toLocaleString()}</div>
        <Link href={`/blog/${post.params.slug}`}>
          <a href="/#">
            <img src={post.params.thumbnail} alt="" />
            <h2>{post.params.title}</h2>
          </a>
        </Link>
        <p>{post.params.excerpt}</p>
      </div>
    ))}
    <style jsx>{`
      .post {
        text-align: center;
      }
      img {
        max-width: 100%;
      }
    `}</style>
  </Layout>
);

export const getStaticProps: GetStaticProps<BlogProps> = async ({
  locale = 'en'
}) => {
  const posts = getAllPosts<ShortPost>(
    [locale],
    ['title', 'date', 'slug', 'excerpt', 'thumbnail']
  );

  return {
    props: { posts }
  };
};

export default Blog;
