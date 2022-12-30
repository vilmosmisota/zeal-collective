import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,700&family=Abril+Fatface&family=Raleway:wght@300;400;700;900&family=Roboto:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="font-serif overflow-x-hidden bg-zinc300">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
