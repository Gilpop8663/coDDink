import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Script from "next/script";
import { useRouter } from "next/router";
import * as ga from "@libs/client/useGoogleAnalytic";
import { useEffect } from "react";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      ga.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          fetch(url).then((response) => response.json()),
      }}
    >
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Component {...pageProps} />
      </GoogleOAuthProvider>
    </SWRConfig>
  );
}

export default MyApp;
