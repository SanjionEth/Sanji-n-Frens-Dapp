import Image from "next/image";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import useSanjiMint from "../hooks/useSanjiMint";
import useStablecoinMint from "../hooks/useStablecoinMint";
import useSpecialCardMint from "../hooks/useSpecialCardMint";

export default function MainPage({ provider }) {
  const { isConnected } = useAccount();

  const { mintWithSanji } = useSanjiMint(provider);
  const { mintWithToken } = useStablecoinMint(provider);

  const whistle = useSpecialCardMint({
    provider,
    contractAddress: "0x0D23e63Db1D2e7346d0c09122c59b393557b98A2",
    cardType: "Sanji's Tactical Whistle",
    requiredSanji: ethers.parseUnits("5000000", 18),
    maxSupply: 200,
  });

  const altman = useSpecialCardMint({
    provider,
    contractAddress: "0x48E15976C004FD90fD34dab36F1C06A543579D94",
    cardType: "Sam Altman's First Code",
    requiredSanji: ethers.parseUnits("10000000", 18),
    maxSupply: 100,
  });

  const mintWithSanjiOrToken = async () => {
    try {
      const result = await mintWithSanji();
      if (!result) await mintWithToken("USDT");
    } catch (err) {
      console.error("Mint failed:", err);
    }
  };

  const mintSpecialCard = async (type) => {
    const card = type === "whistle" ? whistle : altman;
    await card.mint();
  };

  const handleMint = async (type) => {
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
      <div className="absolute z-10">
        <button onClick={() => handleMint("altman")} className="absolute left-[438px] top-[540px] w-[120px] h-[100px] bg-transparent pointer-events-auto" title="Mint Altman's First Code"> </button>
        <button onClick={() => handleMint("whistle")} className="absolute left-[630px] top-[540px] w-[120px] h-[100px] bg-transparent pointer-events-auto" title="Mint Sanji's Tactical Whistle"> </button>
        <button onClick={() => handleMint("base")} className="absolute left-[825px] top-[530px] w-[130px] h-[115px] bg-transparent pointer-events-auto" title="Mint Base Deck"> </button>
      </div>
    </main>
  );
}