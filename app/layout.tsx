import type { Metadata } from 'next';
import * as Base from '@/components/Base/Index';
import { Noto_Sans_JP, Montserrat, Bubblegum_Sans } from 'next/font/google';
import '@/public/Styles/app.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

config.autoAddCss = false;

export const notoSansJP = Noto_Sans_JP({
  weight: ['400'],
  subsets: ['latin'],
  style: ['normal'],
});

export const montserrat = Montserrat({
  weight: ['400'],
  subsets: ['latin'],
  style: ['normal'],
});

export const metadata: Metadata = {
  title: 'Yos_sy Portfolio',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ja'>
      <script
        async
        src='https:24px;ead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7672438019900336'
        crossOrigin='anonymous'
      ></script>
      <body className={notoSansJP.className}>
        <Base.Header />
        <main id='main'>{children}</main>
        {/* <layouts.Footer /> */}
      </body>
    </html>
  );
}
