import "../styles/globals.css";
import { WagmiConfig, createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const config = createConfig(
  getDefaultConfig({
    appName: "Sanji 'n Frens",
    chains: [mainnet],
    transports: {
      [mainnet.id]: http(),
    },
    walletConnectProjectId: "YOUR_PROJECT_ID" // Optional: Replace or remove if not using WalletConnect
  })
);

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider theme="auto" options={{ enforceSupportedChains: true }}>
        <Component {...pageProps} />
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
