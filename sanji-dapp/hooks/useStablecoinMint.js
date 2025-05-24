import { useState } from "react";
import { ethers } from "ethers";
import BaseDeckABI from "../contracts/BaseDeckNFT.json";
import ERC20ABI from "../contracts/erc20.json";

const BASE_DECK_ADDRESS = "0x49F41bc6Fd5126Fd07aF058a8Cb957c5262e6221";
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const MINT_PRICE = ethers.parseUnits("25", 6);

export default function useStablecoinMint(walletClient) {
  const [minting, setMinting] = useState(false);
  const [status, setStatus] = useState("");

  const mintWithToken = async (selectedToken = "USDC") => {
    try {
      setMinting(true);
      setStatus("Preparing mint...");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const wallet = await signer.getAddress();
      const tokenAddress = selectedToken === "USDT" ? USDT_ADDRESS : USDC_ADDRESS;

      const token = new ethers.Contract(tokenAddress, ERC20ABI, signer);
      const baseDeck = new ethers.Contract(BASE_DECK_ADDRESS, BaseDeckABI.abi, signer);

      const allowance = await token.allowance(wallet, BASE_DECK_ADDRESS);
      if (allowance.lt(MINT_PRICE)) {
        setStatus("Approving stablecoin...");
        const approvalTx = await token.approve(BASE_DECK_ADDRESS, MINT_PRICE);
        await approvalTx.wait();
      }

      setStatus("Minting Base Deck...");
      const tx = await baseDeck.mintBaseDeck(tokenAddress);
      await tx.wait();

      setStatus("✅ Base Deck minted successfully!");
    } catch (err) {
      console.error("Mint failed:", err);
      setStatus("❌ Mint failed.");
    } finally {
      setMinting(false);
    }
  };

  return { mintWithToken, minting, status };
};