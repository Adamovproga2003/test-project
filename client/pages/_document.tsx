import * as React from "react";
import {
  Html,
  Head,
  Main,
  NextScript,
  DocumentProps,
  DocumentContext,
} from "next/document";
import {
  DocumentHeadTags,
  DocumentHeadTagsProps,
  documentGetInitialProps,
} from "@mui/material-nextjs/v14-pagesRouter";
import { getDesignTokens } from "./../theme";

export default function MyDocument(
  props: DocumentProps & DocumentHeadTagsProps
) {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="theme-color"
          content={getDesignTokens("dark").palette.primary.main}
        />
        <link rel="icon" href="/images/favicon.ico" sizes="any" />
        <meta name="emotion-insertion-point" content="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          cross-origin={true}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <DocumentHeadTags {...props} />
      </Head>
      <body>
        <Main />
        <NextScript />
        <div id="globalLoader">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
            alt=""
          />
        </div>
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const finalProps = await documentGetInitialProps(ctx);
  return finalProps;
};
