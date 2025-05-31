<button
  onClick={handleSanjiMint}
  disabled={sanjiMinting || hasMinted || cooldownActive}
  className={`px-4 py-2 rounded disabled:opacity-50 ${
    hasMinted || cooldownActive
      ? "bg-gray-600"
      : "bg-green-600 hover:bg-green-700"
  }`}
>
  {sanjiMinting
    ? "Minting..."
    : hasMinted
    ? "Already Minted Base Deck"
    : "Mint Sanji 'n Frens Base Deck"}
</button>

{cooldownActive && (
  <p className="text-yellow-400">
    ⏳ Cooldown active. Try again in {Math.floor(timeLeft / 60)} minutes.
  </p>
)}

{sanjiStatus && <p>{sanjiStatus}</p>}
