import { useEffect, useState } from "react";
import { ethers } from "ethers";
import BaseDeckABI from "../contracts/BaseDeckNFT.json";
import ERC20ABI from "../contracts/erc20.json";

const BASE_DECK_ADDRESS = "0x717f8d41EC7d76F3bB921aC71E9D6B5cD546060A";
const SANJI_ADDRESS = "0x8E0B3E3Cb4468B6aa07a64E69DEb72aeA8eddC6F";
const SANJI_REQUIRED = ethers.parseUnits("1000000", 18);
const COOLDOWN = 365 * 24 * 60 * 60; // 1 year cooldown

export default function useSanjiMint(provider) {
  const [minting, setMinting] = useState(false);
  const [status, setStatus] = useState("");
  const [cooldownActive, setCooldownActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [hasMinted, setHasMinted] = useState(false);

  useEffect(() => {
    if (!provider || typeof window === "undefined") return;

    (async () => {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await browserProvider.getSigner();
        const wallet = await signer.getAddress();
        const baseDeck = new ethers.Contract(BASE_DECK_ADDRESS, BaseDeckABI.abi, browserProvider);

        const minted = await baseDeck.hasMintedType(wallet, "Base Deck");
        setHasMinted(minted);

        const last = await baseDeck.lastMintTime(wallet, "Base Deck");
        const now = Math.floor(Date.now() / 1000);
        const diff = now - Number(last);

        if (diff < COOLDOWN) {
          setCooldownActive(true);
          setTimeLeft(COOLDOWN - diff);
        } else {
          setCooldownActive(false);
          setTimeLeft(0);
        }
      } catch (err) {
        console.error("Error fetching Base Deck status:", err);
        setStatus("⚠️ Error checking mint status.");
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

      if (cooldownActive || hasMinted) {
        setStatus("❌ You have already minted or are in cooldown.");
        return false;
      }

      const sanji = new ethers.Contract(SANJI_ADDRESS, ERC20ABI.abi, signer);
      const balance = await sanji.balanceOf(wallet);

      if (balance < SANJI_REQUIRED) {
        setStatus("❌ You need at least 1,000,000 SANJI tokens to mint for free.");
        return false;
      }

      const baseDeck = new ethers.Contract(BASE_DECK_ADDRESS, BaseDeckABI.abi, signer);
      const tx = await baseDeck.mintBaseDeck(ethers.ZeroAddress);
      await tx.wait();

      setStatus("✅ Base Deck minted for free using SANJI!");
      setHasMinted(true);
      setCooldownActive(true);
      setTimeLeft(COOLDOWN);
      return true;
    } catch (err) {
      console.error("SANJI mint failed:", err);
      setStatus(`❌ SANJI mint failed: ${err.message}`);
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
