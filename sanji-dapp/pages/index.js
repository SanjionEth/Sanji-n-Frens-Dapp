import dynamic from "next/dynamic";
import Head from "next/head";

const MainPage = dynamic(() => import("../components/MainPage"), { ssr: false });

export default function Home() {
  return (
    <>
      <Head>
        <title>Sanji 'n Frens</title>
      </Head>
      <MainPage />
    </>
  );
}
