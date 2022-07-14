import { DarkThemeToggle, Flowbite } from "flowbite-react";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import "../styles/globals.css";

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps) => {
  return (
    <SessionProvider session={session}>
      <Flowbite>
        <Component {...pageProps} />
        <div className="absolute top-6 left-8">
          <DarkThemeToggle />
        </div>
      </Flowbite>
    </SessionProvider>
  );
};

export default MyApp;
