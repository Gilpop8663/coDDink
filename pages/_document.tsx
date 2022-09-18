import Document, { Head, Html, Main, NextScript } from "next/document";

class CustomDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="ko">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Nanum+Gothic&family=Noto+Sans+KR:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main></Main>
          <NextScript></NextScript>
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
