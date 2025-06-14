import { useEffect, useState } from "react";
import { ethers } from "ethers";
import SpecialCardABI from "../contracts/SpecialCardNFT.json";
import ERC20ABI from "../contracts/erc20.json";

const SANJI_ADDRESS = "0x8E0B3E3Cb4468B6aa07a64E69DEb72aeA8eddC6F";
const COOLDOWN = 365 * 24 * 60 * 60; // 1 year in seconds

export default function useSpecialCardMint({
  provider,
  contractAddress,
  cardType,
  requiredSanji,
  maxSupply
}) {
  const [status, setStatus] = useState("");
  const [minting, setMinting] = useState(false);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [hasMinted, setHasMinted] = useState(false);
  const [supply, setSupply] = useState(null);

  // Utility: Validates cardType before use
  const isValidCardType = (value) =>
    typeof value === "number" && Number.isInteger(value) && value >= 0;

  useEffect(() => {
    if (!provider || !isValidCardType(cardType)) {
      console.warn("❌ useSpecialCardMint: Invalid cardType:", cardType);
      return;
    }

    (async () => {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await browserProvider.getSigner();
        const wallet = await signer.getAddress();
        const contract = new ethers.Contract(contractAddress, SpecialCardABI.abi, signer);

        const last = await contract.lastMintTime(wallet, cardType);
        const now = Math.floor(Date.now() / 1000);
        const diff = now - Number(last);

        const minted = await contract.hasMintedType(wallet, cardType);
        setHasMinted(minted);

        if (diff < COOLDOWN) {
          setCooldownActive(true);
          setTimeLeft(COOLDOWN - diff);
        } else {
          setCooldownActive(false);
          setTimeLeft(0);
        }

        const current = await contract.cardSupply(cardType);
        setSupply(Number(current));
      } catch (err) {
        console.error("SpecialCard status error:", err);
        setStatus("❌ Error fetching status.");
      }
    })();
  }, [provider, cardType]);

  const mint = async () => {
    try {
      console.log("🔍 Attempting mint with cardType:", cardType, "Type:", typeof cardType);

      if (!isValidCardType(cardType)) {
        setStatus("❌ Invalid card type provided. Must be a non-negative integer.");
        return;
      }

      setMinting(true);
      setStatus("Checking SANJI balance...");

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      const wallet = await signer.getAddress();

      const token = new ethers.Contract(SANJI_ADDRESS, ERC20ABI.abi, signer);
      const balance = await token.balanceOf(wallet);

      if (BigInt(balance.toString()) < BigInt(requiredSanji.toString())) {
        setStatus(`❌ You need at least ${ethers.formatUnits(requiredSanji, 18)} SANJI to mint this card.`);
        return;
      }

      setStatus("Minting...");
      const contract = new ethers.Contract(contractAddress, SpecialCardABI.abi, signer);

      const tx = await contract.mintSpecialCard(Number(cardType));
      await tx.wait();

      setStatus("✅ Minted!");
      setHasMinted(true);
      setCooldownActive(true);
      setTimeLeft(COOLDOWN);
    } catch (err) {
      console.error("SpecialCard mint failed:", err);
      setStatus(`❌ Mint failed: ${err.message || "Unknown error"}`);
    } finally {
      setMinting(false);
    }
  };

  return {
    mint,
    minting,
    status,
    cooldownActive,
    timeLeft,
    hasMinted,
    remaining: supply !== null ? `${maxSupply - supply} / ${maxSupply}` : "Loading..."
  };
}
