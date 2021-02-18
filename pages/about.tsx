import React from 'react';
import { Layout } from 'components/layout';
import { GetStaticProps } from 'next';
import { markdownToHtml } from 'lib/markdown-to-html';
import { getStaticPageData } from 'data/get-static-page-data';

interface AboutProps {
  locale: string;
  data: AboutData;
}

const About: React.FC<AboutProps> = ({ data }) => (
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

interface AboutPathParams {
  slug: string;
  [key: string]: string;
}

export const getStaticProps: GetStaticProps<
  AboutProps,
  AboutPathParams
> = async ({ locale = 'en' }) => {
  const data = await getStaticPageData<AboutData>(locale, 'about', [
    'title',
    'date',
    'content'
  ]);
  const content = await markdownToHtml(data.params.content || '');

  return {
    props: {
      locale,
      data: {
        ...data.params,
        date: String(data.params.date),
        content
      }
    }
  };
};

export default About;
