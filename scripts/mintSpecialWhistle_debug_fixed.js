
const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x6FAC03cB6068B814e68cFDC9A177eB654a4b529F";
  const BaseDeckNFT = await ethers.getContractFactory("BaseDeckNFT");
  const signer = await ethers.provider.getSigner();
  const contract = await BaseDeckNFT.attach(contractAddress).connect(signer);

  const SANJI = "0x1c7e95fcFeFb32d1dB20d20084CCA2E4e8C53D66"; // your mock SANJI

  const sanji = await ethers.getContractAt("IERC20", SANJI);
  const address = await signer.getAddress();
  const balance = await sanji.balanceOf(address);
  const hasMinted = await contract.hasMintedSpecialA(address);
  const lastMint = await contract.lastMintSpecialA(address);
  const now = (await ethers.provider.getBlock("latest")).timestamp;
  const whistleCount = await contract.specialAMinted();
  const max = 200;

  console.log("🔍 Enhanced Debug: Sanji's Tactical Whistle");
  console.log("SANJI Balance:", ethers.formatUnits(balance, 18));
  console.log("Already Minted Special A:", hasMinted);
  console.log("Last Mint Timestamp:", lastMint.toString());
  console.log("Current Time:", now.toString());
  console.log("Whistles Minted:", whistleCount.toString(), "/", max);

  if (hasMinted) return console.warn("❌ Already minted Special Whistle");
  if (Number(whistleCount) >= max) return console.warn("❌ Max supply reached");
  if (Number(now) - Number(lastMint) < 14 * 24 * 60 * 60) return console.warn("❌ Cooldown active");
  if (balance < ethers.parseUnits("5000000", 18)) return console.warn("❌ Need at least 5M SANJI");

  const tx = await contract.mintSpecialWhistle();
  const receipt = await tx.wait();
  console.log("✅ Minted! Tx Hash:", receipt.hash);
}

main().catch(console.error);
