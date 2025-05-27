import { useState } from "react";
import { BrowserProvider, Contract, parseUnits, ZeroAddress } from "ethers";
import BaseDeckArtifact from "../contracts/BaseDeckNFT.json";
import ERC20Artifact from "../contracts/erc20.json";

const BASE_DECK_ADDRESS = "0x4F8824F0c4185743Ec420b91C7163023d3a83587";
const SANJI_ADDRESS = "0x8E0B3E3Cb4468B6aa07a64E69DEb72aeA8eddC6F";
const SANJI_REQUIRED = parseUnits("1000000", 18);

const BaseDeckABI = BaseDeckArtifact.abi;
const ERC20ABI = ERC20Artifact.abi;

export default function useSanjiMint(walletClient) {
  const [minting, setMinting] = useState(false);
  const [status, setStatus] = useState("");

  const mintWithSanji = async () => {
    try {
      setMinting(true);
      setStatus("Checking SANJI balance...");

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const wallet = await signer.getAddress();

      const sanji = new Contract(SANJI_ADDRESS, ERC20ABI, signer);
      const balance = await sanji.balanceOf(wallet);

      if (balance < SANJI_REQUIRED) {
        setStatus("❌ You need at least 1,000,000 SANJI tokens to mint for free.");
        return false;
      }

      const baseDeck = new Contract(BASE_DECK_ADDRESS, BaseDeckABI, signer);
      const tx = await baseDeck.mintBaseDeck(ZeroAddress);
      await tx.wait();

      setStatus("✅ Base Deck minted for free using SANJI!");
      return true;
    } catch (err) {
      console.error("❌ SANJI mint failed:", err);
      setStatus(`❌ SANJI mint failed: ${err.message || "Unknown error"}`);
      return false;
    } finally {
      setMinting(false);
    }
  };

  return { mintWithSanji, minting, status };
}
