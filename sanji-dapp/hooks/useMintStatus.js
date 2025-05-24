import { WalletClient } from "viem";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import BaseDeckABI from "../contracts/BaseDeckNFT.json";

const BASE_DECK_ADDRESS = "0x49F41bc6Fd5126Fd07aF058a8Cb957c5262e6221";

export default function useMintStatus(walletClient) {
  const [cooldownActive, setCooldownActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [hasMinted, setHasMinted] = useState(false);
  const [supply, setSupply] = useState(null);

  useEffect(() => {
    if (!walletClient) return;

    const fetchStatus = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const wallet = await signer.getAddress();

        const contract = new ethers.Contract(
          BASE_DECK_ADDRESS,
          BaseDeckABI.abi,
          signer
        );

        const hasMintedBaseDeck = await contract.hasMintedType(wallet, "Base Deck");
        const lastMintTimestamp = await contract.lastMintTime(wallet, "Base Deck");
        const currentTokenId = await contract.currentTokenId();

        const cooldownPeriod = 14 * 24 * 60 * 60;
        const now = Math.floor(Date.now() / 1000);
        const elapsed = now - Number(lastMintTimestamp);
        const onCooldown = elapsed < cooldownPeriod;

        setCooldownActive(onCooldown);
        setTimeLeft(onCooldown ? cooldownPeriod - elapsed : 0);
        setHasMinted(hasMintedBaseDeck);
        setSupply(Number(currentTokenId));
      } catch (err) {
        console.error("❌ Error fetching mint status", err);
      }
    };

    fetchStatus();
  }, [walletClient]);

  return { cooldownActive, timeLeft, hasMinted, supply };
}
