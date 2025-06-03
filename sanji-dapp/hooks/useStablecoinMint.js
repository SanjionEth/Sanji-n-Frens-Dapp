import { useEffect, useState } from "react";
import { ethers } from "ethers";
import BaseDeckABI from "../contracts/BaseDeckNFT.json";
import ERC20ABI from "../contracts/erc20.json";

const BASE_DECK_ADDRESS = "0x717f8d41EC7d76F3bB921aC71E9D6B5cD546060A";
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const MINT_PRICE = ethers.parseUnits("25", 6);
const COOLDOWN = 365 * 24 * 60 * 60;

export default function useStablecoinMint(provider) {
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
        const contract = new ethers.Contract(BASE_DECK_ADDRESS, BaseDeckABI.abi, signer);

        const [minted, max] = await Promise.all([
          contract.totalSupply(),
          contract.maxSupply()
        ]);
        setRemaining(`${max - minted} / ${max}`);

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
      } catch (err) {
        console.error("Stablecoin status error:", err);
        setStatus("❌ Error checking mint status.");
        setRemaining("Error");
      }
    })();
  }, [provider]);

  const mintWithToken = async (selectedToken = "USDC") => {
    try {
      setMinting(true);
      setStatus("Preparing mint...");

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      const wallet = await signer.getAddress();

      const tokenAddress = selectedToken === "USDT" ? USDT_ADDRESS : USDC_ADDRESS;
      const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI.abi, signer);
      const baseDeckContract = new ethers.Contract(BASE_DECK_ADDRESS, BaseDeckABI.abi, signer);

      const allowance = await tokenContract.allowance(wallet, BASE_DECK_ADDRESS);
      if (allowance < MINT_PRICE) {
        setStatus("Approving stablecoin...");
        const approvalTx = await tokenContract.approve(BASE_DECK_ADDRESS, MINT_PRICE);
        await approvalTx.wait();
      }

      setStatus("Minting Base Deck...");
      const mintTx = await baseDeckContract.mintBaseDeck(tokenAddress);
      await mintTx.wait();

      setStatus(`✅ Base Deck minted with ${selectedToken}!`);
      setHasMinted(true);
      setCooldownActive(true);
      setTimeLeft(COOLDOWN);
    } catch (err) {
      console.error("Minting failed:", err);
      setStatus("❌ Minting failed: " + (err?.message || "Unknown error"));
    } finally {
      setMinting(false);
    }
  };

  return {
    mintWithToken,
    minting,
    status,
    cooldownActive,
    timeLeft,
    hasMinted,
    remaining
  };
}
