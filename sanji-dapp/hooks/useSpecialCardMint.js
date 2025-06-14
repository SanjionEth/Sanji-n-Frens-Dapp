import { useEffect, useState } from "react";
import { ethers } from "ethers";
import SpecialCardABI from "../contracts/SpecialCardNFT.json";
import ERC20ABI from "../contracts/erc20.json";

const SANJI_ADDRESS = "0x8E0B3E3Cb4468B6aa07a64E69DEb72aeA8eddC6F";
const COOLDOWN = 365 * 24 * 60 * 60; // 1 year in seconds
const cardTypeId = 0; // 🔒 Hardcoded for "Sanji's Tactical Whistle"

export default function useSpecialCardMint({
  provider,
  contractAddress,
  requiredSanji,
  maxSupply
}) {
  const [status, setStatus] = useState("");
  const [minting, setMinting] = useState(false);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [hasMinted, setHasMinted] = useState(false);
  const [supply, setSupply] = useState(null);

  useEffect(() => {
    if (!provider) return;

    (async () => {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await browserProvider.getSigner();
        const wallet = await signer.getAddress();
        const contract = new ethers.Contract(contractAddress, SpecialCardABI.abi, signer);

        const last = await contract.lastMintTime(wallet, cardTypeId);
        const now = Math.floor(Date.now() / 1000);
        const diff = now - Number(last);

        const minted = await contract.hasMintedType(wallet, cardTypeId);
        setHasMinted(minted);

        if (diff < COOLDOWN) {
          setCooldownActive(true);
          setTimeLeft(COOLDOWN - diff);
        } else {
          setCooldownActive(false);
          setTimeLeft(0);
        }

        const current = await contract.cardSupply(cardTypeId);
        setSupply(Number(current));
      } catch (err) {
        console.error("SpecialCard status error:", err);
        setStatus("❌ Error fetching status.");
      }
    })();
  }, [provider, contractAddress]);

  const mint = async () => {
    try {
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
      const tx = await contract.mintSpecialCard(cardTypeId);
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
