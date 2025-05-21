
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "connectkit";

export default function Home() {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMint = (type) => {
    alert(`Minting: ${type}`);
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

      {/* Mint buttons */}
      <div className="absolute z-10">
        <button onClick={() => handleMint("altman")} className="absolute left-[438px] top-[540px] w-[120px] h-[100px] bg-transparent pointer-events-auto" />
        <button onClick={() => handleMint("whistle")} className="absolute left-[630px] top-[540px] w-[120px] h-[100px] bg-transparent pointer-events-auto" />
        <button onClick={() => handleMint("base")} className="absolute left-[825px] top-[530px] w-[130px] h-[115px] bg-transparent pointer-events-auto" />
      </div>

      {/* Wallet connect on medallion */}
      <div className="absolute left-[165px] top-[380px] w-[60px] h-[60px] z-30">
        {mounted && (
          <ConnectButton.Custom>
            {({ show }) => (
              <button
                className="w-full h-full bg-transparent pointer-events-auto"
                title="Connect Wallet"
                onClick={show}
              />
            )}
          </ConnectButton.Custom>
        )}
      </div>
    </main>
  );
}


