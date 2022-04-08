import type { AppProps } from "next/app";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/@picocss/pico@latest/css/pico.min.css"
        />
      </Head>

      <div className="container">
        <Component {...pageProps} />
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default MyApp;
