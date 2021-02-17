import React from 'react';
import Link from 'next/link';

export const Layout: React.FC = ({ children }) => (
  <>
    <nav>
      <Link href="/">
        <a href="/#">home</a>
      </Link>
      <Link href="/blog">
        <a href="/#">blog</a>
      </Link>
      <Link href="/about">
        <a href="/#">about</a>
      </Link>
    </nav>
    <main>{children}</main>

    <style jsx>{`
      nav {
        text-align: center;
      }
      nav a {
        margin-right: 2px;
        padding: 4px;
      }
      main {
        display: flex;
        flex-direction: column;
      }
    `}</style>
  </>
);
