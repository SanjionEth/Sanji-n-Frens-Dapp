import { useState } from "react";
import { ethers } from "ethers";
import BaseDeckABI from "../contracts/BaseDeckNFT.json";
import ERC20ABI from "../contracts/erc20.json";

const BASE_DECK_ADDRESS = "0xYourDeployedBaseDeckAddress";
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const MINT_PRICE = ethers.parseUnits("25", 6); // USDC/USDT have 6 decimals

export default function useStablecoinMint(provider) {
  const [minting, setMinting] = useState(false);
  const [status, setStatus] = useState("");

  const mintWithToken = async (selectedToken = "USDC") => {
    try {
      setMinting(true);
      setStatus("Approving stablecoin...");

      const signer = provider.getSigner();
      const baseDeckContract = new ethers.Contract(BASE_DECK_ADDRESS, BaseDeckABI.abi, signer);
      const tokenAddress = selectedToken === "USDT" ? USDT_ADDRESS : USDC_ADDRESS;
      const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, signer);

      const approvalTx = await tokenContract.approve(BASE_DECK_ADDRESS, MINT_PRICE);
      await approvalTx.wait();

      setStatus("Minting Base Deck...");
      const mintTx = await baseDeckContract.mintBaseDeck(tokenAddress);
      await mintTx.wait();

      setStatus("✅ Base Deck minted successfully!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Minting failed. See console for details.");
    } finally {
      setMinting(false);
    }
  };

  return { mintWithToken, minting, status };
}
