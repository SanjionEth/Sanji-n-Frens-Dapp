
const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0xEf78796Ad8a3B18f83D1804bc7C2143fE5B8d07c"; // replace with your deployed contract
  const BaseDeckNFT = await ethers.getContractFactory("BaseDeckNFT");
  const signer = await ethers.provider.getSigner();
  const contract = await BaseDeckNFT.attach(contractAddress).connect(signer);

  const SANJI = "0x1c7e95fcFeFb32d1dB20d20084CCA2E4e8C53D66"; // mock SANJI

  const sanji = await ethers.getContractAt("IERC20", SANJI);
  const balance = await sanji.balanceOf(await signer.getAddress());
  const hasMinted = await contract.hasMintedSpecialA(signer.address);
  const lastMint = await contract.lastMintSpecialA(signer.address);
  const now = (await ethers.provider.getBlock("latest")).timestamp;

  console.log("🔎 Special Whistle Debug:");
  console.log("- SANJI balance:", ethers.formatUnits(balance, 18));
  console.log("- Already minted Special A:", hasMinted);
  console.log("- Last mint timestamp:", lastMint.toString());
  console.log("- Current block timestamp:", now.toString());

  if (hasMinted) {
    console.warn("❌ Already minted Special Whistle.");
    return;
  }

  if (balance < ethers.parseUnits("5000000", 18)) {
    console.warn("❌ Not enough SANJI for Whistle (need 5M+).");
    return;
  }

  const tx = await contract.mintSpecialWhistle();
  const receipt = await tx.wait();
  console.log("✅ Minted Sanji's Tactical Whistle! Tx hash:", receipt.hash);
}

main().catch(console.error);
