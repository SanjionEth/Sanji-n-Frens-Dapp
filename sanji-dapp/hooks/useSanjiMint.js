import { useState } from "react";
import { ethers } from "ethers";
import BaseDeckABI from "../contracts/BaseDeckNFT.json";
import ERC20ABI from "../contracts/erc20.json";

const BASE_DECK_ADDRESS = "0x4F8824F0c4185743Ec420b91C7163023d3a83587";
const SANJI_ADDRESS = "0x8E0B3E3Cb4468B6aa07a64E69DEb72aeA8eddC6F";
const SANJI_REQUIRED = ethers.parseUnits("1000000", 18);

export default function useSanjiMint(provider) {
  const [minting, setMinting] = useState(false);
  const [status, setStatus] = useState("");

  const mintWithSanji = async () => {
    try {
      setMinting(true);
      setStatus("Checking SANJI balance...");

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      const wallet = await signer.getAddress();

      const sanji = new ethers.Contract(SANJI_ADDRESS, ERC20ABI, signer);
      const balance = await sanji.balanceOf(wallet);

      if (balance.lt(SANJI_REQUIRED)) {
        setStatus("❌ You need at least 1,000,000 SANJI tokens to mint for free.");
        return false;
      }

      const baseDeck = new ethers.Contract(BASE_DECK_ADDRESS, BaseDeckABI.abi, signer);
      const tx = await baseDeck.mintBaseDeck(wallet);
      await tx.wait();

      setStatus("✅ Base Deck minted for free using SANJI!");
      return true;
    } catch (err) {
      console.error("SANJI mint failed:", err);
      setStatus(`❌ SANJI mint failed: ${err.message}`);
      return false;
    } finally {
      setMinting(false);
    }
  };

  return { mintWithSanji, minting, status };
}
