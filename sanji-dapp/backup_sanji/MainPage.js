
import Image from "next/image";
import { ConnectKitButton } from "connectkit";

export default function Home() {
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

      <div className="absolute top-4 left-4 z-20 flex gap-3">
        {/* Top nav buttons */}
        <a href="https://sanjioneth.fun/" target="_blank" rel="noopener noreferrer">
          <button className="w-36 h-10 bg-transparent pointer-events-auto" title="Sanji Website"> </button>
        </a>
        {[..."Available Mints", "Card Library", "Matchup Time!", "Rewards", "Marketplace"].map((label, i) => (
          <button key={i} className="w-36 h-10 bg-transparent pointer-events-auto" title="Coming Soon" aria-label={label}> </button>
        ))}
      </div>

      <div className="absolute z-10">
        <button onClick={() => handleMint("altman")} className="absolute left-[438px] top-[540px] w-[120px] h-[100px] bg-transparent pointer-events-auto" title="Mint Altman's First Code"> </button>
        <button onClick={() => handleMint("whistle")} className="absolute left-[630px] top-[540px] w-[120px] h-[100px] bg-transparent pointer-events-auto" title="Mint Sanji's Tactical Whistle"> </button>
        <button onClick={() => handleMint("base")} className="absolute left-[825px] top-[530px] w-[130px] h-[115px] bg-transparent pointer-events-auto" title="Mint Base Deck"> </button>
      </div>

      <div className="absolute left-[165px] top-[380px] w-[60px] h-[60px] z-30">
        <ConnectKitButton.Custom>
          {({ isConnected, show }) => (
            <button
              className="w-full h-full bg-transparent pointer-events-auto"
              title={isConnected ? "Disconnect Wallet" : "Connect Wallet"}
              onClick={show}
            />
          )}
        </ConnectKitButton.Custom>
      </div>
    </main>
  );
}
