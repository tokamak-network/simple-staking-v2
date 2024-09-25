import Head from "next/head";
import type { NextPage } from "next";

const HeadMeta: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Simple Staking - Tokamak</title>
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://simple.staking.tokamak.network" />
        <meta property="title" content="Simple Staking - Tokamak" />
        <meta property="og:title" content="Simple Staking - Tokamak" />
        <meta
          property="description"
          content="Easier UI for Tokamak Staking"
        />
        <meta
          property="og:description"
          content="Easier UI for Tokamak Staking"
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-E0YQDXW30R"></script>
        <script>
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-E0YQDXW30R');`}
        </script>
        <link rel="icon" href="/tokamak_favicon_8tt.ico" />
      </Head>
    </div>
  );
};

export default HeadMeta;
