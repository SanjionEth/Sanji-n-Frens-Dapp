
import Image from "next/image";
import { useAccount, useSigner } from "wagmi";
import { ethers } from "ethers";
import useSanjiMint from "../hooks/useSanjiMint";
import useStablecoinMint from "../hooks/useStablecoinMint";
import useSpecialCardMint from "../hooks/useSpecialCardMint";
import useMintStatus from "../hooks/useMintStatus";

function formatSeconds(seconds) {
  const days = Math.floor(seconds / (60 * 60 * 24));
  const hours = Math.floor((seconds % (60 * 60 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}

export default function MainPage() {
  const { isConnected } = useAccount();
  const { data: signer } = useSigner();

  const {
    mintWithSanji,
    minting: sanjiMinting,
    status: sanjiStatus
  } = useSanjiMint(signer);

  const {
    mintWithToken,
    minting: tokenMinting,
    status: tokenStatus
  } = useStablecoinMint(signer);

  const {
    cooldownActive,
    timeLeft,
    hasMinted,
    supply
  } = useMintStatus(signer);

  const whistle = useSpecialCardMint({
    provider: signer,
    contractAddress: "0x0D23e63Db1D2e7346d0c09122c59b393557b98A2",
    cardType: "Sanji's Tactical Whistle",
    requiredSanji: ethers.parseUnits("5000000", 18),
    maxSupply: 200
  });

  const altman = useSpecialCardMint({
    provider: signer,
    contractAddress: "0x48E15976C004FD90fD34dab36F1C06A543579D94",
    cardType: "Sam Altman's First Code",
    requiredSanji: ethers.parseUnits("10000000", 18),
    maxSupply: 100
  });

  const mintWithSanjiOrToken = async () => {
    if (cooldownActive) return;
    try {
      const result = await mintWithSanji();
      if (!result) await mintWithToken("USDT");
    } catch (err) {
      console.error("Mint failed:", err);
    }
  };

  const mintSpecialCard = async (type) => {
    const card = type === "whistle" ? whistle : altman;
    if (card.cooldownActive || card.hasMinted) return;
    await card.mint();
  };

  const handleMint = async (type) => {
    if (!signer) return;
    if (type === "base") {
      await mintWithSanjiOrToken();
    } else if (type === "whistle") {
      await mintSpecialCard("whistle");
    } else if (type === "altman") {
      await mintSpecialCard("altman");
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <Image
        src="/mint_background.jpg"
        alt="Sanji Meme Matchup Background"
        layout="fill"
        objectFit="cover"
        priority
        className="pointer-events-none z-0"
      />

      {/* Top nav buttons */}
      <div className="absolute top-4 left-4 z-20 flex gap-3">
        <a href="https://sanjioneth.fun/" target="_blank" rel="noopener noreferrer">
          <button className="w-36 h-10 bg-transparent pointer-events-auto" title="Sanji Website"> </button>
        </a>
        <button className="w-36 h-10 bg-transparent pointer-events-auto" title="Coming Soon"> </button>
        <button className="w-36 h-10 bg-transparent pointer-events-auto" title="Coming Soon"> </button>
        <button className="w-36 h-10 bg-transparent pointer-events-auto" title="Coming Soon"> </button>
        <button className="w-36 h-10 bg-transparent pointer-events-auto" title="Coming Soon"> </button>
        <button className="w-36 h-10 bg-transparent pointer-events-auto" title="Coming Soon"> </button>
      </div>

      {/* Mint Buttons */}
      <div className="absolute z-10 text-white text-sm">
        <button onClick={() => handleMint("altman")} className="absolute left-[438px] top-[540px] w-[120px] h-[100px] bg-transparent pointer-events-auto" title="Mint Altman's First Code"> </button>
        <button onClick={() => handleMint("whistle")} className="absolute left-[630px] top-[540px] w-[120px] h-[100px] bg-transparent pointer-events-auto" title="Mint Sanji's Tactical Whistle"> </button>
        <button onClick={() => handleMint("base")} className="absolute left-[825px] top-[530px] w-[130px] h-[115px] bg-transparent pointer-events-auto" title="Mint Base Deck"> </button>

        {cooldownActive && (
          <p className="absolute top-[660px] left-[820px] bg-black bg-opacity-70 px-2 py-1 rounded">
            ⏳ Base deck cooldown: {formatSeconds(timeLeft)}
          </p>
        )}
        {sanjiStatus && (
          <p className="absolute top-[680px] left-[820px] bg-black bg-opacity-70 px-2 py-1 rounded">
            {sanjiStatus}
          </p>
        )}
        {tokenStatus && (
          <p className="absolute top-[700px] left-[820px] bg-black bg-opacity-70 px-2 py-1 rounded">
            {tokenStatus}
          </p>
        )}
      </div>
    </main>
  );
}
