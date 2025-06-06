import { useState, useEffect } from "react";
import { ethers } from "ethers";
import BaseDeck from "../contracts/BaseDeckNFT.json";
import ERC20 from "../contracts/erc20.json";

const BASE_DECK_ADDRESS = "0x169d50acDfDe126776e969963343523e2d543283";
const SANJI_ADDRESS = "0x8E0B3E3Cb4468B6aa07a64E69DEb72aeA8eddC6F";
const SANJI_REQUIRED = ethers.parseUnits("1000000", 18);
const COOLDOWN = 365 * 24 * 60 * 60;
const MAX_SUPPLY = 10000;

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

        const hasMintedVal = await contract.hasMintedType(wallet, "Base Deck");
        setHasMinted(hasMintedVal);

        const last = await contract.lastMintTime(wallet, "Base Deck");
        const now = Math.floor(Date.now() / 1000);
        const diff = now - Number(last);

        if (diff < COOLDOWN) {
          setCooldownActive(true);
          setTimeLeft(COOLDOWN - diff);
        } else {
          setCooldownActive(false);
          setTimeLeft(0);
        }

        const currentSupply = await contract.totalSupply();
        setRemaining(`${MAX_SUPPLY - Number(currentSupply)} / ${MAX_SUPPLY}`);
      } catch (err) {
        console.error("Cooldown check error:", err);
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
      const hasMintedVal = await baseDeck.hasMintedType(wallet, "Base Deck");
      const last = await baseDeck.lastMintTime(wallet, "Base Deck");
      const now = Math.floor(Date.now() / 1000);

      if (hasMintedVal) {
        setStatus("❌ You have already minted the Base Deck.");
        return false;
      }

      if (now - Number(last) < COOLDOWN) {
        const daysLeft = Math.ceil((COOLDOWN - (now - Number(last))) / 86400);
        setStatus(`❌ Cooldown active. Try again in ${daysLeft} days.`);
        return false;
      }

      const tx = await baseDeck.mintBaseDeck(ethers.ZeroAddress);
      await tx.wait();

      setStatus("✅ Base Deck minted for free using SANJI!");
      setHasMinted(true);
      setCooldownActive(true);
      setTimeLeft(COOLDOWN);

      const updatedSupply = await baseDeck.totalSupply();
      setRemaining(`${MAX_SUPPLY - Number(updatedSupply)} / ${MAX_SUPPLY}`);
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
