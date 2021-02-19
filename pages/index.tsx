import React from 'react';
import { Layout } from 'components/layout';
import { GetStaticProps } from 'next';
import { markdownToHtml } from 'lib/markdown-to-html';
import { getStaticPageData } from 'data/get-static-page-data';

interface HomeProps {
  data: HomeData;
}

const Home: React.FC<HomeProps> = ({ data }) => (
  <Layout>
    <h1>{data.title}</h1>
    <div dangerouslySetInnerHTML={{ __html: data.content }} />
    <style jsx>{`
      h1,
      div {
        text-align: center;
      }
    `}</style>
  </Layout>
);

type HomePathParams = {
  slug: string;
  [key: string]: string;
};

export const getStaticProps: GetStaticProps<
  HomeProps,
  HomePathParams
> = async ({ locale }) => {
  const data = await getStaticPageData<HomeData>(locale, 'home', [
    'title',
    'date',
    'content'
  ]);
  const content = await markdownToHtml(data.params.content || '');

  return {
    props: {
      data: {
        ...data.params,
        date: String(data.params.date),
        content
      }
    }
  };
};

export default Home;
