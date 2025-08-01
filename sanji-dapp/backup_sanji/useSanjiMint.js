import { useState } from "react";
import { ethers } from "ethers";
import BaseDeckABI from "../contracts/BaseDeckNFT.json";
import ERC20ABI from "../contracts/erc20.json";

const BASE_DECK_ADDRESS = "0xYourDeployedBaseDeckAddress";
const SANJI_ADDRESS = "0x8E0B3E3Cb4468B6aa07a64E69DEb72aeA8eddC6F";
const SANJI_REQUIRED = ethers.parseUnits("1000000", 18);

export default function useSanjiMint(provider) {
  const [minting, setMinting] = useState(false);
  const [status, setStatus] = useState("");

  const mintWithSanji = async () => {
    try {
      setMinting(true);
      setStatus("Checking SANJI balance...");

      const signer = provider.getSigner();
      const wallet = await signer.getAddress();
      const sanji = new ethers.Contract(SANJI_ADDRESS, ERC20ABI, signer);
      const balance = await sanji.balanceOf(wallet);

      if (balance < SANJI_REQUIRED) {
        setStatus("❌ You need at least 1,000,000 SANJI tokens to mint for free.");
        setMinting(false);
        return;
      }

      const baseDeck = new ethers.Contract(BASE_DECK_ADDRESS, BaseDeckABI.abi, signer);
      const tx = await baseDeck.mintBaseDeck(ethers.ZeroAddress); // signal free mint
      await tx.wait();

      setStatus("✅ Base Deck minted for free using SANJI!");
    } catch (err) {
      console.error(err);
      setStatus("❌ SANJI mint failed.");
    } finally {
      setMinting(false);
    }
  };

  return { mintWithSanji, minting, status };
}
