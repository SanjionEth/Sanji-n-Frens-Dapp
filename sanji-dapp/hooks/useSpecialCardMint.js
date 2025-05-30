import { useEffect, useState } from "react";
import { ethers } from "ethers";
import SpecialCardABI from "../contracts/SpecialCardNFT.json";
import ERC20ABI from "../contracts/erc20.json";

const SANJI_ADDRESS = "0x8E0B3E3Cb4468B6aa07a64E69DEb72aeA8eddC6F";
const COOLDOWN = 14 * 24 * 60 * 60;

export default function useSpecialCardMint({ provider, contractAddress, cardType, requiredSanji, maxSupply }) {
  const [status, setStatus] = useState("");
  const [minting, setMinting] = useState(false);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [hasMinted, setHasMinted] = useState(false);
  const [supply, setSupply] = useState(null);

  // Load mint status on hook mount
  useEffect(() => {
    if (!provider || !contractAddress) return;

    (async () => {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await browserProvider.getSigner();
        const wallet = await signer.getAddress();

        const contract = new ethers.Contract(contractAddress, SpecialCardABI.abi, signer);

        const last = await contract.lastMintTime(wallet);
        const now = Math.floor(Date.now() / 1000);
        const diff = now - Number(last);

        const minted = await contract.hasMinted(wallet);
        setHasMinted(minted);

        if (diff < COOLDOWN) {
          setCooldownActive(true);
          setTimeLeft(COOLDOWN - diff);
        }

        const current = await contract.currentSupply();
        setSupply(Number(current));
      } catch (err) {
        console.error("⚠️ Error loading mint status:", err);
        setStatus("⚠️ Failed to load mint status.");
      }
    })();
  }, [provider, contractAddress]);

  // Mint the card
  const mint = async () => {
    try {
      setMinting(true);
      setStatus("Checking SANJI balance...");

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      const wallet = await signer.getAddress();

      const token = new ethers.Contract(SANJI_ADDRESS, ERC20ABI.abi, signer);
      const balance = await token.balanceOf(wallet);

      console.log("👛 Wallet:", wallet);
      console.log("💰 Balance:", balance.toString());
      console.log("📌 Required:", requiredSanji.toString());

      if (balance.lt(requiredSanji)) {
        setStatus(`❌ You need at least ${ethers.formatUnits(requiredSanji, 18)} SANJI to mint this card.`);
        return;
      }

      setStatus("Minting...");
      const contract = new ethers.Contract(contractAddress, SpecialCardABI.abi, signer);
      const tx = await contract.mintSpecialCard(wallet);
      await tx.wait();

      setStatus("✅ Special card minted!");
      setHasMinted(true);
      setCooldownActive(true);
      setTimeLeft(COOLDOWN);
    } catch (err) {
      console.error("❌ Mint error:", err);
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
