import Head from "next/head";
import { WagmiConfig, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MintButtons from "../components/MintButtons";
import { ConnectButton } from "connectkit";

// 1. Create QueryClient
const queryClient = new QueryClient();

// 2. Create wagmi config
const config = createConfig(
  getDefaultConfig({
    appName: "Sanji 'n Frens DApp",
    chains: [sepolia],
    transports: {
      [sepolia.id]: http(),
    },
  })
);

export default function Home() {
  return (
    <>
      <Head>
        <title>Sanji 'n Frens NFT DApp</title>
      </Head>
      {/* 3. Provide QueryClient context */}
      <QueryClientProvider client={queryClient}>
        <WagmiConfig config={config}>
          <ConnectKitProvider>
            <main className="p-4">
              <ConnectButton />
              <MintButtons />
            </main>
          </ConnectKitProvider>
        </WagmiConfig>
      </QueryClientProvider>
    </>
  );
}
