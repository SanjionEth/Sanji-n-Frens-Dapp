import { useEffect, useState } from "react";
import { ethers } from "ethers";
import SpecialCardABI from "../contracts/SpecialCardNFT.json";
import ERC20ABI from "../contracts/erc20.json";

const SANJI_ADDRESS = "0x8E0B3E3Cb4468B6aa07a64E69DEb72aeA8eddC6F";
const COOLDOWN_SECONDS = 14 * 24 * 60 * 60;

export default function useSpecialCardMint({
  provider,
  contractAddress,
  cardType,
  requiredSanji,
  maxSupply,
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
        const signer = provider.getSigner();
        const wallet = await signer.getAddress();
        const contract = new ethers.Contract(contractAddress, SpecialCardABI.abi, provider);

        const lastTime = await contract.lastMintTime(wallet, cardType);
        const minted = await contract.hasMintedType(wallet, cardType);
        setHasMinted(minted);

        const now = Math.floor(Date.now() / 1000);
        const diff = now - Number(lastTime);
        if (diff < COOLDOWN_SECONDS) {
          setCooldownActive(true);
          setTimeLeft(COOLDOWN_SECONDS - diff);
        }

        const current = await contract.currentTokenId();
        setSupply(Number(current));
      } catch (err) {
        console.error(err);
      }
    })();
  }, [provider]);

  const mint = async () => {
    try {
      setMinting(true);
      setStatus("Checking SANJI balance...");

      const signer = provider.getSigner();
      const wallet = await signer.getAddress();
      const sanji = new ethers.Contract(SANJI_ADDRESS, ERC20ABI, signer);
      const balance = await sanji.balanceOf(wallet);

      if (balance < requiredSanji) {
        setStatus("❌ Not enough SANJI tokens.");
        return;
      }

      const contract = new ethers.Contract(contractAddress, SpecialCardABI.abi, signer);
      const tx = await contract.mintSpecialCard(wallet);
      await tx.wait();
      setStatus("✅ Minted successfully!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Mint failed.");
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
    remaining: supply !== null ? `${maxSupply - supply} / ${maxSupply}` : "Loading...",
  };
}
