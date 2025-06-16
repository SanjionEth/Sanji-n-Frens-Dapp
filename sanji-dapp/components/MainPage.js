// MainPage.js

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
    status: sanjiStatus,
    cooldownActive: sanjiCooldown,
    timeLeft: sanjiTimeLeft,
    hasMinted: sanjiHasMinted,
    remaining: sanjiRemaining
  } = useSanjiMint(walletClient);

  const {
    mintWithToken,
    minting: tokenMinting,
    status: tokenStatus,
    cooldownActive: tokenCooldown,
    timeLeft: tokenTimeLeft,
    hasMinted: tokenHasMinted,
    remaining: tokenRemaining
  } = useStablecoinMint(walletClient);

  const whistle = useSpecialCardMint({
    provider: walletClient,
    contractAddress: "0x1A7475d874E07860a5b4E4a026FFb49D0614AD87",
    cardType: "Whistle",
    requiredSanji: ethers.parseUnits("5000000", 18),
    maxSupply: 200
  });

  const altman = useSpecialCardMint({
    provider: walletClient,
    contractAddress: "0xbd4087A4991278407B2275D17D94942e96D3Dac4",
    cardType: "Altman",
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
    if (whistle.hasMinted || whistle.cooldownActive) return;
    try {
      await whistle.mint();
    } catch (err) {
      console.error("Whistle mint error:", err);
    }
  };

  const handleAltmanMint = async () => {
    if (altman.hasMinted || altman.cooldownActive) return;
    try {
      await altman.mint();
    } catch (err) {
      console.error("Altman mint error:", err);
    }
  };

  const renderMintSection = (label, handler, minting, hasMinted, cooldownActive, timeLeft, remaining, status, disabledClass, colorClass) => (
    <div className={`p-4 rounded ${disabledClass ? "bg-gray-700 opacity-50 cursor-not-allowed" : colorClass}`}>
      <button
        onClick={handler}
        disabled={minting || cooldownActive || hasMinted}
        className="w-full px-4 py-2 rounded text-white disabled:opacity-50"
      >
        {minting
          ? "Minting..."
          : hasMinted
          ? "✅ Already Minted"
          : cooldownActive
          ? `⏳ Cooldown Active (${Math.ceil(timeLeft / 86400)} days left)`
          : label}
      </button>
      <p className="mt-2">Remaining: {remaining}</p>
      {status && !status.startsWith("✅") && <p className="text-yellow-300">{status}</p>}
    </div>
  );

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

        {renderMintSection(
          "Mint Sanji 'n Frens Base Deck",
          handleSanjiMint,
          sanjiMinting,
          sanjiHasMinted,
          sanjiCooldown,
          sanjiTimeLeft,
          sanjiRemaining,
          sanjiStatus,
          sanjiHasMinted || sanjiCooldown,
          "bg-green-600"
        )}

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
              disabled={tokenMinting || tokenCooldown || tokenHasMinted}
              className="bg-blue-600 px-4 py-2 rounded disabled:opacity-50"
            >
              {tokenMinting ? "Minting..." : `Mint with ${selectedToken}`}
            </button>
            <p>{tokenStatus}</p>
            <p>Remaining Base Decks: {tokenRemaining}</p>
            {tokenCooldown && tokenTimeLeft && <p>Cooldown: {Math.ceil(tokenTimeLeft / 86400)} days left</p>}
          </div>
        )}

        <hr className="my-4" />

        {renderMintSection(
          "Mint Sanji’s Tactical Whistle (5M SANJI)",
          handleWhistleMint,
          whistle.minting,
          whistle.hasMinted,
          whistle.cooldownActive,
          whistle.timeLeft,
          whistle.remaining,
          whistle.status,
          whistle.hasMinted || whistle.cooldownActive,
          "bg-purple-600"
        )}

        {renderMintSection(
          "Mint Sam Altman's First Code (10M SANJI)",
          handleAltmanMint,
          altman.minting,
          altman.hasMinted,
          altman.cooldownActive,
          altman.timeLeft,
          altman.remaining,
          altman.status,
          altman.hasMinted || altman.cooldownActive,
          "bg-yellow-500"
        )}
      </div>
    </main>
  );
}
