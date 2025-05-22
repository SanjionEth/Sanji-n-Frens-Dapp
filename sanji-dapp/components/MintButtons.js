
import { useState } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";

import useSanjiMint from "../hooks/useSanjiMint";
import useStablecoinMint from "../hooks/useStablecoinMint";
import useMintStatus from "../hooks/useMintStatus";
import useSpecialCardMint from "../hooks/useSpecialCardMint";

const MAX_BASE_SUPPLY = 10_000;
const MAX_TACTICAL_WHISTLE = 200;
const MAX_FIRST_CODE = 100;

function formatSeconds(seconds) {
  const days = Math.floor(seconds / (60 * 60 * 24));
  const hours = Math.floor((seconds % (60 * 60 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return \`\${days}d \${hours}h \${minutes}m\`;
}

export default function MintButtons({ provider }) {
  const { isConnected } = useAccount();
  const [selectedToken, setSelectedToken] = useState("USDT");

  if (!provider) {
    return <p className="text-red-500">Ethereum provider not detected.</p>;
  }

  // 🃏 Base Deck
  const { mintWithSanji, minting: sanjiMinting, status: sanjiStatus } = useSanjiMint(provider);
  const { mintWithToken, minting: tokenMinting, status: tokenStatus } = useStablecoinMint(provider);
  const { cooldownActive, timeLeft, hasMinted, supply } = useMintStatus(provider);

  const handleSanjiMint = () => {
    if (!cooldownActive) mintWithSanji();
  };
  const handleStablecoinMint = () => {
    if (!cooldownActive) mintWithToken(selectedToken);
  };
  const remaining = supply !== null ? \`Remaining Supply: \${MAX_BASE_SUPPLY - supply} / \${MAX_BASE_SUPPLY}\` : "Loading supply...";
  const cooldownMessage = cooldownActive
    ? \`⏳ Cooldown active. Try again in \${formatSeconds(timeLeft)}.\`
    : hasMinted
    ? "✅ Already minted. Cooldown passed — you may mint again."
    : "🎉 You are eligible to mint.";

  // 🌟 Special Card A – Tactical Whistle
  const whistle = useSpecialCardMint({
    provider,
    contractAddress: "0x0D23e63Db1D2e7346d0c09122c59b393557b98A2",
    cardType: "Sanji's Tactical Whistle",
    requiredSanji: ethers.parseUnits("5000000", 18),
    maxSupply: MAX_TACTICAL_WHISTLE,
  });

  // 🌟 Special Card B – Altman's First Code
  const code = useSpecialCardMint({
    provider,
    contractAddress: "0x48E15976C004FD90fD34dab36F1C06A543579D94",
    cardType: "Sam Altman's First Code",
    requiredSanji: ethers.parseUnits("10000000", 18),
    maxSupply: MAX_FIRST_CODE,
  });

  const renderSpecialCard = (card, label) => (
    <div className="space-y-2">
      <h3 className="text-md font-semibold">{label}</h3>
      <p className="text-sm text-gray-600">Remaining: {card.remaining}</p>
      {card.cooldownActive ? (
        <p className="text-yellow-500">⏳ Cooldown active: {formatSeconds(card.timeLeft)}</p>
      ) : card.hasMinted ? (
        <p className="text-green-500">✅ Already minted</p>
      ) : (
        <p className="text-green-600">🎉 Eligible to mint</p>
      )}
      <button
        onClick={card.mint}
        disabled={card.minting || card.cooldownActive || card.hasMinted}
        className="bg-purple-600 text-white py-2 px-4 rounded disabled:opacity-50 flex items-center"
      >
        {card.minting ? (
          <span className="flex items-center">
            <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Minting...
          </span>
        ) : (
          \`Mint \${label}\`
        )}
      </button>
      {card.status && <p>{card.status}</p>}
      <a
        href={\`https://etherscan.io/address/\${card.contractAddress}\`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline text-sm"
      >
        View on Etherscan
      </a>
    </div>
  );

  return (
    <div className="mint-buttons space-y-6">
      <h2 className="text-xl font-bold">Mint Your Base Deck</h2>
      <p className="text-sm text-gray-600">{remaining}</p>

      {!isConnected && <p className="text-red-500">🔌 Please connect your wallet.</p>}

      {isConnected && (
        <>
          <p className="text-yellow-600">{cooldownMessage}</p>

          {/* Free SANJI Mint */}
          <button
            onClick={handleSanjiMint}
            disabled={sanjiMinting || cooldownActive}
            className="bg-green-600 text-white py-2 px-4 rounded disabled:opacity-50"
          >
            {sanjiMinting ? "Minting..." : "Free Mint with SANJI (1M+)"}
          </button>
          {sanjiStatus && <p>{sanjiStatus}</p>}

          {/* Paid Stablecoin Mint */}
          <div className="space-y-2">
            <select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="USDT">Pay with USDT ($25)</option>
              <option value="USDC">Pay with USDC ($25)</option>
            </select>
            <button
              onClick={handleStablecoinMint}
              disabled={tokenMinting || cooldownActive}
              className="bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
            >
              {tokenMinting ? \`Minting with \${selectedToken}...\` : \`Mint with \${selectedToken}\`}
            </button>
            {tokenStatus && <p>{tokenStatus}</p>}
          </div>

          <a
            href="https://etherscan.io/address/0x49F41bc6Fd5126Fd07aF058a8Cb957c5262e6221"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-sm"
          >
            View BaseDeckNFT on Etherscan
          </a>

          {/* Special Cards Section */}
          <div className="space-y-6 pt-6">
            <h2 className="text-xl font-bold">Special Card Mints</h2>
            {renderSpecialCard(whistle, "Sanji's Tactical Whistle")}
            {renderSpecialCard(code, "Sam Altman's First Code")}
          </div>
        </>
      )}
    </div>
  );
}
