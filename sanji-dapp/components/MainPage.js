import Image from "next/image";
import { useAccount, useWalletClient } from "wagmi";
import { useState } from "react";
import useSanjiMint from "../hooks/useSanjiMint";
import useStablecoinMint from "../hooks/useStablecoinMint";
import useSpecialCardMint from "../hooks/useSpecialCardMint";
import { ethers } from "ethers";

export default function MainPage() {
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [showStablecoin, setShowStablecoin] = useState(false);
  const [selectedToken, setSelectedToken] = useState("USDT");

  const {
    mintWithSanji,
    minting: sanjiMinting,
    status: sanjiStatus
  } = useSanjiMint(walletClient);

  const {
    mintWithToken,
    minting: tokenMinting,
    status: tokenStatus
  } = useStablecoinMint(walletClient);

  const whistle = useSpecialCardMint({
    provider: walletClient,
    contractAddress: "0xaea80Dce0b8Fa39DbB27aDe30Ec0e7164ce8c5E5",
    requiredSanji: ethers.parseUnits("5000000", 18),
    maxSupply: 200
  });

  const altman = useSpecialCardMint({
    provider: walletClient,
    contractAddress: "0xF85Ec44370f1dCbea4765B7481bA83E8634062FA",
    requiredSanji: ethers.parseUnits("10000000", 18),
    maxSupply: 100
  });

  const handleSanjiMint = async () => {
    try {
      const result = await mintWithSanji();
      if (!result) setShowStablecoin(true);
    } catch (err) {
      console.error("SANJI mint error:", err);
      setShowStablecoin(true);
    }
  };

  const handleStablecoinMint = async () => {
    try {
      await mintWithToken(selectedToken);
    } catch (err) {
      console.error("Stablecoin mint error:", err);
    }
  };

  const handleWhistleMint = async () => {
    try {
      await whistle.mint();
    } catch (err) {
      console.error("Whistle mint error:", err);
    }
  };

  const handleAltmanMint = async () => {
    try {
      await altman.mint();
    } catch (err) {
      console.error("Altman mint error:", err);
    }
  };

  const formatSeconds = (seconds) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden text-white">
      <Image
        src="/mint_background.jpg"
        alt="Sanji Meme Matchup Background"
        layout="fill"
        objectFit="cover"
        priority
        className="pointer-events-none z-0"
      />

      <div className="absolute top-4 left-4 z-20 p-4 bg-black bg-opacity-70 rounded space-y-4">
        <p>✅ useAccount is working: {isConnected ? "Connected" : "Not connected"}</p>
        <p>🧪 useWalletClient result: {walletClient ? "✅ WalletClient available" : "❌ WalletClient not available"}</p>

        <button
          onClick={handleSanjiMint}
          disabled={sanjiMinting}
          className="bg-green-600 px-4 py-2 rounded disabled:opacity-50"
        >
          {sanjiMinting ? "Minting..." : "Mint Sanji 'n Frens Base Deck"}
        </button>

        {sanjiStatus && <p>{sanjiStatus}</p>}

        {showStablecoin && (
          <div className="space-y-2">
            <select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              className="text-black p-1 rounded"
            >
              <option value="USDT">Pay with USDT ($25)</option>
              <option value="USDC">Pay with USDC ($25)</option>
            </select>
            <button
              onClick={handleStablecoinMint}
              disabled={tokenMinting}
              className="bg-blue-600 px-4 py-2 rounded disabled:opacity-50"
            >
              {tokenMinting ? "Minting..." : `Mint with ${selectedToken}`}
            </button>
            {tokenStatus && <p>{tokenStatus}</p>}
          </div>
        )}

        <hr className="my-4" />

        <button
          onClick={handleWhistleMint}
          disabled={whistle.minting || whistle.cooldownActive || whistle.hasMinted}
          className="bg-purple-600 px-4 py-2 rounded disabled:opacity-50"
        >
          {whistle.minting ? "Minting..." : "Mint Sanji’s Tactical Whistle (5M SANJI)"}
        </button>
        <p>{whistle.status}</p>
        <p>Remaining: {whistle.remaining}</p>
        {whistle.cooldownActive && <p>⏳ Cooldown: {formatSeconds(whistle.timeLeft)}</p>}

        <button
          onClick={handleAltmanMint}
          disabled={altman.minting || altman.cooldownActive || altman.hasMinted}
          className="bg-yellow-500 px-4 py-2 rounded disabled:opacity-50"
        >
          {altman.minting ? "Minting..." : "Mint Sam Altman's First Code (10M SANJI)"}
        </button>
        <p>{altman.status}</p>
        <p>Remaining: {altman.remaining}</p>
        {altman.cooldownActive && <p>⏳ Cooldown: {formatSeconds(altman.timeLeft)}</p>}
      </div>
    </main>
  );
}
