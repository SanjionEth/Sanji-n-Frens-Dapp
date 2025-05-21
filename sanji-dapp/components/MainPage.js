import Image from "next/image";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({ connector: new InjectedConnector() });
  const { disconnect } = useDisconnect();

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

      {/* Top nav buttons (invisible but clickable) */}
      <div className="absolute top-4 left-4 z-20 flex gap-3">
        <a href="https://sanjioneth.fun/" target="_blank" rel="noopener noreferrer">
          <button className="w-36 h-10 bg-transparent pointer-events-auto" title="Sanji Website"> </button>
        </a>
        <button className="w-36 h-10 bg-transparent pointer-events-auto" title="Coming Soon" aria-label="Available Mints"> </button>
        <button className="w-36 h-10 bg-transparent pointer-events-auto" title="Coming Soon" aria-label="Card Library"> </button>
        <button className="w-36 h-10 bg-transparent pointer-events-auto" title="Coming Soon" aria-label="Matchup Time!"> </button>
        <button className="w-36 h-10 bg-transparent pointer-events-auto" title="Coming Soon" aria-label="Rewards"> </button>
        <button className="w-36 h-10 bg-transparent pointer-events-auto" title="Coming Soon" aria-label="Marketplace"> </button>
      </div>

      {/* Mint Buttons (invisible) */}
      <div className="absolute z-10">
        <button onClick={() => handleMint("altman")} className="absolute left-[438px] top-[540px] w-[120px] h-[100px] bg-transparent pointer-events-auto" title="Mint Altman's First Code"> </button>
        <button onClick={() => handleMint("whistle")} className="absolute left-[630px] top-[540px] w-[120px] h-[100px] bg-transparent pointer-events-auto" title="Mint Sanji's Tactical Whistle"> </button>
        <button onClick={() => handleMint("base")} className="absolute left-[825px] top-[530px] w-[130px] h-[115px] bg-transparent pointer-events-auto" title="Mint Base Deck"> </button>
      </div>

      {/* Wallet Connect Button (on Sanji medallion) */}
      <div className="absolute left-[165px] top-[380px] w-[60px] h-[60px] z-30">
        {!isConnected ? (
          <button
            className="w-full h-full bg-transparent pointer-events-auto"
            title="Connect Wallet"
            onClick={() => connect()}
          > </button>
        ) : (
          <button
            className="w-full h-full bg-transparent pointer-events-auto"
            title="Disconnect Wallet"
            onClick={() => disconnect()}
          > </button>
        )}
      </div>
    </main>
  );
}
