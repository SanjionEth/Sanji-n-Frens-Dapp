import "../styles/globals.css";

import { WagmiConfig, createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const WALLETCONNECT_PROJECT_ID = "cbf4d086650149bbedc3ebf58ff8855e";

const config = createConfig(
  getDefaultConfig({
    appName: "Sanji 'n Frens",
    chains: [mainnet],
    transports: {
      [mainnet.id]: http(),
    },
    walletConnectProjectId: WALLETCONNECT_PROJECT_ID,
  })
);

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <ConnectKitProvider theme="auto" options={{ enforceSupportedChains: true }}>
          <Component {...pageProps} />
        </ConnectKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}