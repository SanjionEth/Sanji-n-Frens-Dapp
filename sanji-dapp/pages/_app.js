import "../styles/globals.css";

import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const chains = [mainnet, sepolia];

const config = createConfig(
  getDefaultConfig({
    appName: "Sanji n Frens",
    chains,
    publicClient: publicProvider(),
    walletConnectProjectId: "demo", // Replace with your real WalletConnect ID if needed
  })
);

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider theme="auto" options={{ enforceSupportedChains: true }}>
          <Component {...pageProps} />
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}