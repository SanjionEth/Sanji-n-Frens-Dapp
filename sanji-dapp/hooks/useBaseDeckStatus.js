import { useEffect, useState } from "react";
import { ethers } from "ethers";
import BaseDeckABI from "../contracts/BaseDeckNFT.json";

const BASE_DECK_ADDRESS = "0x717f8d41EC7d76F3bB921aC71E9D6B5cD546060A";

export default function useBaseDeckStatus(provider) {
  const [hasMinted, setHasMinted] = useState(false);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!provider) return;

    (async () => {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await browserProvider.getSigner();
        const wallet = await signer.getAddress();
        const contract = new ethers.Contract(BASE_DECK_ADDRESS, BaseDeckABI.abi, signer);

        const minted = await contract.hasMintedType(wallet, "Base Deck");
        setHasMinted(minted);

        const last = await contract.lastMintTime(wallet, "Base Deck");
        const now = Math.floor(Date.now() / 1000);
        const diff = now - Number(last);

        if (diff < 365 * 24 * 60 * 60) {
          setCooldownActive(true);
          setTimeLeft(365 * 24 * 60 * 60 - diff);
        }

        setLoading(false);
      } catch (err) {
        console.error("Base Deck status error:", err);
        setLoading(false);
      }
    })();
  }, [provider]);

  return { hasMinted, cooldownActive, timeLeft, loading };
}
