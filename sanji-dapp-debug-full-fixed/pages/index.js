import Head from "next/head";
import { WagmiConfig, createConfig, configureChains, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";
import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../components/MainPage"), { ssr: false });

const { chains, publicClient } = configureChains([mainnet], [publicProvider()]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  publicClient,
});

export default function App() {
  return (
    <>
      <Head>
        <title>Sanji 'n Frens</title>
        <meta name="description" content="Mint Sanji NFTs" />
      </Head>
      <WagmiConfig config={wagmiConfig}>
        <main className="min-h-screen w-screen">
          <MainPage />
        </main>
      </WagmiConfig>
    </>
  );
}
