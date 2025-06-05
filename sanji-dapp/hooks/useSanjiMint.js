import { useState, useEffect } from "react";
import { ethers } from "ethers";
import BaseDeck from "../contracts/BaseDeckNFT.json";
import ERC20 from "../contracts/erc20.json";

const BASE_DECK_ADDRESS = "0x6383d2CB2a9e17a95548917805104A181ac58E3D";
const SANJI_ADDRESS = "0x8E0B3E3Cb4468B6aa07a64E69DEb72aeA8eddC6F";
const SANJI_REQUIRED = ethers.parseUnits("1000000", 18);
const COOLDOWN = 365 * 24 * 60 * 60;

export default function useSanjiMint(provider) {
  const [minting, setMinting] = useState(false);
  const [status, setStatus] = useState("");
  const [cooldownActive, setCooldownActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [hasMinted, setHasMinted] = useState(false);
  const [remaining, setRemaining] = useState("Loading...");

  useEffect(() => {
    if (!provider) return;

    (async () => {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await browserProvider.getSigner();
        const wallet = await signer.getAddress();
        const contract = new ethers.Contract(BASE_DECK_ADDRESS, BaseDeck.abi, signer);

        const last = await contract.lastMintTime(wallet, "Base Deck");
        const now = Math.floor(Date.now() / 1000);
        const diff = now - Number(last);

        const hasMintedVal = await contract.hasMintedType(wallet, "Base Deck");
        setHasMinted(hasMintedVal);

        if (diff < COOLDOWN) {
          setCooldownActive(true);
          setTimeLeft(COOLDOWN - diff);
        } else {
          setCooldownActive(false);
          setTimeLeft(0);
        }

        const current = await contract.totalSupply();
        setRemaining(`${10000 - Number(current)} / 10000`);
      } catch (err) {
        console.error("Cooldown or remaining check error:", err);
        setRemaining("Error");
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
      const tx = await baseDeck.mintBaseDeck(ethers.ZeroAddress);
      await tx.wait();

      setStatus("✅ Base Deck minted for free using SANJI!");
      setHasMinted(true);
      setCooldownActive(true);
      setTimeLeft(COOLDOWN);

      const current = await baseDeck.totalSupply();
      setRemaining(`${10000 - Number(current)} / 10000`);

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
    hasMinted,
    remaining
  };
}
