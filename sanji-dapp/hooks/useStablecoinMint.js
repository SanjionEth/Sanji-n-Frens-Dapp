import { useState } from "react";
import { ethers } from "ethers";
import BaseDeckABI from "../contracts/BaseDeckNFT.json";
import ERC20ABI from "../contracts/erc20.json";

const BASE_DECK_ADDRESS = "0xA6914Aba300F1280AA9b6038BD409c9E2700fab1";
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const MINT_PRICE = ethers.parseUnits("25", 6); // 25 USDC/USDT

export default function useStablecoinMint(walletClient) {
  const [minting, setMinting] = useState(false);
  const [status, setStatus] = useState("");

  const mintWithToken = async (selectedToken = "USDC") => {
    try {
      if (!walletClient) {
        setStatus("❌ Wallet client not available.");
        return;
      }

      setMinting(true);
      setStatus("Preparing mint...");

      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const wallet = await signer.getAddress();

      const tokenAddress = selectedToken === "USDT" ? USDT_ADDRESS : USDC_ADDRESS;
      const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, signer);
      const baseDeckContract = new ethers.Contract(BASE_DECK_ADDRESS, BaseDeckABI.abi, signer);

      const allowance = await tokenContract.allowance(wallet, BASE_DECK_ADDRESS);
      if (allowance.lt(MINT_PRICE)) {
        setStatus("Approving stablecoin...");
        const approvalTx = await tokenContract.approve(BASE_DECK_ADDRESS, MINT_PRICE);
        await approvalTx.wait();
      }

      setStatus("Minting Base Deck...");
      const mintTx = await baseDeckContract.mintBaseDeck(tokenAddress);
      await mintTx.wait();

      setStatus("✅ Base Deck minted successfully!");
    } catch (err) {
      console.error("Minting failed:", err);
      setStatus("❌ Minting failed: " + (err.message || "Unknown error"));
    } finally {
      setMinting(false);
    }
  };

  return { mintWithToken, minting, status };
}