import Image from "next/image";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({ connector: new InjectedConnector() });
  const { disconnect } = useDisconnect();

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black">
      <Image
        src="/mint_background.jpg"
        alt="Sanji Meme Matchup Background"
        layout="fill"
        objectFit="cover"
        priority
        className="pointer-events-none z-0"
      />

      {/* GIANT DEBUG BUTTON CENTERED */}
      <button
        onClick={() => {
          console.log("BIG TEST CLICK");
          alert("BIG BUTTON WORKED");
        }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                   w-[300px] h-[150px] text-2xl font-bold text-white bg-red-600 border-4 border-white z-[9999] pointer-events-auto"
      >
        BIG TEST BUTTON
      </button>

      {/* Wallet Connect Button */}
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
