import Head from "next/head";
import { WagmiConfig, createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { ConnectKitButton } from "connectkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MintButtons from "../components/MintButtons";

// 1. Create QueryClient
const queryClient = new QueryClient();

// 2. Create wagmi config for MAINNET
const config = createConfig({
  appName: "Sanji 'n Frens DApp",
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

export default function Home() {
  return (
    <>
      <Head>
        <title>Sanji 'n Frens NFT DApp</title>
      </Head>

      <QueryClientProvider client={queryClient}>
        <WagmiConfig config={config}>
          <main className="p-4">
            <ConnectKitButton />
            <MintButtons />
          </main>
        </WagmiConfig>
      </QueryClientProvider>
    </>
  );
}
