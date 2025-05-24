import Image from "next/image";
import { useAccount } from "wagmi";
import { ConnectButton } from "connectkit";

export default function MainPage() {
  const { isConnected } = useAccount();

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
        <a href="https://sanjioneth.fun/" target="_blank" rel="noopener noreferrer">
          <button className="w-36 h-10 bg-transparent pointer-events-auto" title="Sanji Website">Sanji</button>
        </a>
      </div>

      <div className="absolute left-[165px] top-[380px] w-[60px] h-[60px] z-30">
        <ConnectButton />
      </div>

      {isConnected && (
        <p className="absolute top-[600px] left-[820px] text-white z-30">Wallet Connected!</p>
      )}
    </main>
  );
}