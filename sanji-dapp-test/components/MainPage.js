import Image from "next/image";

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* Background Image */}
      <Image
        src="/file-F2s9d4vZ2Ujeqxjv2nE2tU.png"
        alt="Sanji Meme Matchup Background"
        layout="fill"
        objectFit="cover"
        priority
        className="pointer-events-none z-0"
      />

      {/* Invisible Navigation Buttons */}
      <div className="absolute top-4 left-4 z-20 flex gap-3">
        <a href="https://sanjioneth.fun/" target="_blank" rel="noopener noreferrer">
          <button className="w-36 h-10" title="Sanji Website"></button>
        </a>
        <button className="w-36 h-10" title="Coming Soon" aria-label="Available Mints"></button>
        <button className="w-36 h-10" title="Coming Soon" aria-label="Card Library"></button>
        <button className="w-36 h-10" title="Coming Soon" aria-label="Matchup Time!"></button>
      </div>

      {/* Mint Buttons */}
      <div className="absolute z-10">
        <button className="absolute left-[438px] top-[540px] w-[120px] h-[100px]" title="Mint Altman's First Code" />
        <button className="absolute left-[630px] top-[540px] w-[120px] h-[100px]" title="Mint Sanji's Tactical Whistle" />
        <button className="absolute left-[825px] top-[540px] w-[120px] h-[100px]" title="Mint Base Deck" />
      </div>

      {/* Wallet Connect Button on Sanji medallion */}
      <div className="absolute left-[165px] top-[380px] w-[60px] h-[60px] z-30">
        <button
          className="w-full h-full bg-transparent"
          title="Connect Wallet"
          onClick={() => alert("Connect Wallet clicked")}
        />
      </div>
    </main>
  );
}
