import { useState, useEffect } from "react";
import { ethers } from "ethers";
import BaseDeck from "../contracts/BaseDeckNFT.json";
import ERC20 from "../contracts/erc20.json";

const BASE_DECK_ADDRESS = "0x169d50acDfDe126776e969963343523e2d543283";
const SANJI_ADDRESS = "0x8E0B3E3Cb4468B6aa07a64E69DEb72aeA8eddC6F";
const SANJI_REQUIRED = ethers.parseUnits("1000000", 18);
const COOLDOWN = 365 * 24 * 60 * 60;

export default function useSanjiMint(provider) {
  const [minting, setMinting] = useState(false);
  const [status, setStatus] = useState("");
  const [cooldownActive, setCooldownActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [hasMinted, setHasMinted] = useState(false);

  // Fetch mint status and cooldown on load
  useEffect(() => {
    if (!provider) return;

    (async () => {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await browserProvider.getSigner();
        const wallet = await signer.getAddress();
        const contract = new ethers.Contract(BASE_DECK_ADDRESS, BaseDeck.abi, signer);

        const last = await contract.lastMintTime(wallet, "Base Deck");
        const hasMintedVal = await contract.hasMintedType(wallet, "Base Deck");

        const now = Math.floor(Date.now() / 1000);
        const diff = now - Number(last);

        setHasMinted(hasMintedVal);

        if (diff < COOLDOWN) {
          setCooldownActive(true);
          setTimeLeft(COOLDOWN - diff);
        } else {
          setCooldownActive(false);
          setTimeLeft(0);
        }
      } catch (err) {
        console.error("Cooldown check error:", err);
        setStatus("❌ Error checking mint eligibility.");
      }
    })();
  }, [provider]);

  // Trigger mint
  const mintWithSanji = async () => {
    try {
      setMinting(true);
      setStatus("Checking SANJI balance...");

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      const wallet = await signer.getAddress();

      const sanji = new ethers.Contract(SANJI_ADDRESS, ERC20.abi, browserProvider);
      const balance = await sanji.balanceOf(wallet);

      if (BigInt(balance.toString()) < BigInt(SANJI_REQUIRED.toString())) {
        setStatus("❌ You need at least 1,000,000 SANJI tokens to mint for free.");
        return false;
      }

      const baseDeck = new ethers.Contract(BASE_DECK_ADDRESS, BaseDeck.abi, signer);
      setStatus("Minting Base Deck...");
      const tx = await baseDeck.mintBaseDeck(ethers.ZeroAddress);
      await tx.wait();

      setStatus("✅ Base Deck minted for free using SANJI!");
      setHasMinted(true);
      setCooldownActive(true);
      setTimeLeft(COOLDOWN);
      return true;
    } catch (err) {
      console.error("SANJI mint failed:", err);
      setStatus(`❌ SANJI mint failed: ${err?.reason || err?.message || "Unknown error"}`);
      return false;
    } finally {
      setMinting(false);
    }
  };

  return {
    mintWithSanji,
    minting,
    status,
    cooldownActive,
    timeLeft,
    hasMinted
  };
}
