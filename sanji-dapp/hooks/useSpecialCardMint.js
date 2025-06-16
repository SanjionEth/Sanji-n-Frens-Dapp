import { useEffect, useState } from "react";
import { ethers } from "ethers";
import WhistleABI from "../contracts/SpecialCardNFT.json";
import AltmanABI from "../contracts/SpecialCardNFT_Altman.json";
import ERC20ABI from "../contracts/erc20.json";

const SANJI_ADDRESS = "0x8E0B3E3Cb4468B6aa07a64E69DEb72aeA8eddC6F";
const COOLDOWN = 365 * 24 * 60 * 60; // 1 year in seconds

export default function useSpecialCardMint({
  provider,
  contractAddress,
  requiredSanji,
  maxSupply,
  cardType // "Whistle" or "Altman"
}) {
  const [status, setStatus] = useState("");
  const [minting, setMinting] = useState(false);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [hasMinted, setHasMinted] = useState(false);
  const [supply, setSupply] = useState(null);

  const isAltman = cardType === "Altman";
  const selectedABI = isAltman ? AltmanABI.abi : WhistleABI.abi;

  useEffect(() => {
    if (!provider) return;

    (async () => {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await browserProvider.getSigner();
        const wallet = await signer.getAddress();

        if (!ethers.isAddress(wallet)) throw new Error("Invalid wallet address");

        const contract = new ethers.Contract(contractAddress, selectedABI, signer);

        const last = await contract.lastMintTime(wallet);
        const now = Math.floor(Date.now() / 1000);
        const diff = now - Number(last);

        const minted = await contract.hasMinted(wallet);
        setHasMinted(minted);

        if (diff < COOLDOWN) {
          setCooldownActive(true);
          setTimeLeft(COOLDOWN - diff);
        } else {
          setCooldownActive(false);
          setTimeLeft(0);
        }

        const current = await contract.currentSupply();
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
      const contract = new ethers.Contract(contractAddress, selectedABI, signer);

      const tx = isAltman
        ? await contract.mintSpecialCard()        // ✅ no param
        : await contract.mintSpecialCard(wallet); // ✅ pass address only for Whistle

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
