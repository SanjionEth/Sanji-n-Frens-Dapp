import { useState, useEffect } from "react";
import { ethers } from "ethers";
import BaseDeck from "../contracts/BaseDeckNFT.json";
import ERC20 from "../contracts/erc20.json";

const BASE_DECK_ADDRESS = "0x781e27C583B88751eCf73cd28909706c12E3fCe1";
const SANJI_ADDRESS = "0x8E0B3E3Cb4468B6aa07a64E69DEb72aeA8eddC6F";
const SANJI_REQUIRED = ethers.parseUnits("1000000", 18);

export default function useSanjiMint(provider) {
  const [minting, setMinting] = useState(false);
  const [status, setStatus] = useState("");
  const [hasMinted, setHasMinted] = useState(false);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  // ⚠️ Check mint status on load
  useEffect(() => {
    if (!provider) return;

    (async () => {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await browserProvider.getSigner();
        const wallet = await signer.getAddress();
        const contract = new ethers.Contract(BASE_DECK_ADDRESS, BaseDeck.abi, browserProvider);

        const last = await contract.lastMintTime(wallet, "Base Deck");
        const has = await contract.hasMintedType(wallet, "Base Deck");

        setHasMinted(has);

        const now = Math.floor(Date.now() / 1000);
        const diff = now - Number(last);
        const COOLDOWN = 14 * 24 * 60 * 60;

        if (diff < COOLDOWN) {
          setCooldownActive(true);
          setTimeLeft(COOLDOWN - diff);
        }
      } catch (err) {
        console.error("Error fetching base deck mint status:", err);
      }
    })();
  }, [provider]);

  const mintWithSanji = async () => {
    try {
      setMinting(true);
      setStatus("Checking SANJI balance...");

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      const wallet = await signer.getAddress();

      const sanji = new ethers.Contract(SANJI_ADDRESS, ERC20.abi, browserProvider);
      const balance = await sanji.balanceOf(wallet);

      if (balance < SANJI_REQUIRED) {
        setStatus("❌ You need at least 1,000,000 SANJI tokens to mint for free.");
        return false;
      }

      const baseDeck = new ethers.Contract(BASE_DECK_ADDRESS, BaseDeck.abi, signer);

      setStatus("Minting Base Deck...");
      const tx = await baseDeck.mintBaseDeck(ethers.ZeroAddress);
      await tx.wait();

      setStatus("✅ Base Deck minted with SANJI!");
      setHasMinted(true);
      return true;
    } catch (err) {
      console.error("SANJI mint failed:", err);
      const message = err?.message || "";

      if (message.includes("Already minted")) {
        setStatus("❌ You’ve already minted a Base Deck.");
      } else if (message.includes("Cooldown active")) {
        setStatus("⏳ Cooldown is still active. Please wait before minting again.");
      } else if (message.includes("Max supply")) {
        setStatus("❌ All 10,000 Base Decks have been minted.");
      } else {
        setStatus(`❌ SANJI mint failed: ${message}`);
      }

      return false;
    } finally {
      setMinting(false);
    }
  };

  return {
    mintWithSanji,
    minting,
    status,
    hasMinted,
    cooldownActive,
    timeLeft,
  };
}

