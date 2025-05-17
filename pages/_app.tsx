import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Container } from "react-bootstrap";
import AppRouterCacheProvider from "@mui/material-nextjs/v13-appRouter/appRouterV13";
import StyledComponentsRegistry from "@/@core/lib/registry";
import { StyledRoot } from "@/@theme/styledRoot";
import { Suspense, useEffect } from "react";
import Loading from "./loading";
import { wrapper } from "../store/store";
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  const queryClient = new QueryClient();
  useEffect(() => {
    const isLocalhost = window.location.hostname === "localhost";
    const isDev = process.env.NODE_ENV === "development";

    if (!isLocalhost && !isDev && window.location.protocol !== "https:") {
      window.location.href = window.location.href.replace(
        "http://",
        "https://"
      );
    }
  }, []);
  return (
    <Container fluid style={{ overflow: "hidden" }}>
      <AppRouterCacheProvider>
        <StyledComponentsRegistry>
          <StyledRoot>
            <Suspense fallback={<Loading />}>
              <SessionProvider session={session}>
                <QueryClientProvider client={queryClient}>
                  <HydrationBoundary state={pageProps.dehydratedState}>
                    <Component {...pageProps} />
                  </HydrationBoundary>
                </QueryClientProvider>
              </SessionProvider>
            </Suspense>
          </StyledRoot>
        </StyledComponentsRegistry>
      </AppRouterCacheProvider>
    </Container>
  );
};

export default wrapper.withRedux(App);
