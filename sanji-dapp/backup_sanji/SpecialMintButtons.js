import { useAccount } from "wagmi";
import useSpecialCardMint from "../hooks/useSpecialCardMint";

function formatSeconds(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}

export default function SpecialMintButtons({ provider }) {
  const { isConnected } = useAccount();

  // ✅ Replace with deployed contract addresses
  const whistleConfig = {
    provider,
    contractAddress: "0xWhistleNFTMainnetAddress",
    cardType: "Sanji's Tactical Whistle",
    requiredSanji: ethers.parseUnits("5000000", 18),
    maxSupply: 200,
  };

  const codeConfig = {
    provider,
    contractAddress: "0xFirstCodeNFTMainnetAddress",
    cardType: "Sam Altman's First Code",
    requiredSanji: ethers.parseUnits("10000000", 18),
    maxSupply: 100,
  };

  const whistle = useSpecialCardMint(whistleConfig);
  const code = useSpecialCardMint(codeConfig);

  const renderButton = (card, label) => (
    <div className="space-y-2">
      <h3 className="text-lg font-bold">{label}</h3>
      <p className="text-sm text-gray-600">Remaining: {card.remaining}</p>
      {card.cooldownActive ? (
        <p className="text-yellow-500">
          ⏳ Cooldown active. Try again in {formatSeconds(card.timeLeft)}.
        </p>
      ) : card.hasMinted ? (
        <p className="text-green-500">✅ You’ve already minted this card.</p>
      ) : (
        <p className="text-green-500">🎉 Eligible to mint!</p>
      )}
      <button
        onClick={card.mint}
        disabled={card.minting || card.cooldownActive || card.hasMinted}
        className="bg-purple-600 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {card.minting ? "Minting..." : `Mint ${label}`}
      </button>
      {card.status && <p>{card.status}</p>}
    </div>
  );

  return (
    <div className="special-mint space-y-6">
      <h2 className="text-xl font-bold">Special Cards</h2>
      {!isConnected && <p className="text-red-500">🔌 Connect your wallet to mint.</p>}
      {isConnected && (
        <>
          {renderButton(whistle, "Sanji's Tactical Whistle")}
          {renderButton(code, "Sam Altman's First Code")}
        </>
      )}
    </div>
  );
}
