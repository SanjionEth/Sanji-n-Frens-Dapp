
const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x6FAC03cB6068B814e68cFDC9A177eB654a4b529F"; // BaseDeckNFT
  const BaseDeckNFT = await ethers.getContractFactory("BaseDeckNFT");
  const signer = await ethers.provider.getSigner();
  const contract = await BaseDeckNFT.attach(contractAddress).connect(signer);

  const SANJI = "0xF547999579e5672d6f8B3696722DDCbBd9b0e93A"; // correct SANJI

  const sanji = await ethers.getContractAt("IERC20", SANJI);
  const address = await signer.getAddress();
  const balance = await sanji.balanceOf(address);
  const hasMinted = await contract.hasMintedSpecialB(address);
  const lastMint = await contract.lastMintSpecialB(address);
  const now = (await ethers.provider.getBlock("latest")).timestamp;
  const count = await contract.specialBMinted();
  const max = 100;

  console.log("🔍 Enhanced Debug: Sam Altman's First Code");
  console.log("SANJI Balance:", ethers.formatUnits(balance, 18));
  console.log("Already Minted Special B:", hasMinted);
  console.log("Last Mint Timestamp:", lastMint.toString());
  console.log("Current Time:", now.toString());
  console.log("First Code Minted:", count.toString(), "/", max);

  if (hasMinted) return console.warn("❌ Already minted First Code");
  if (Number(count) >= max) return console.warn("❌ Max supply reached");
  if (Number(now) - Number(lastMint) < 14 * 24 * 60 * 60) return console.warn("❌ Cooldown active");
  if (balance < ethers.parseUnits("10000000", 18)) return console.warn("❌ Need at least 10M SANJI");

  const tx = await contract.mintSpecialFirstCode();
  const receipt = await tx.wait();
  console.log("✅ Minted Altman's First Code! Tx Hash:", receipt.hash);
}

main().catch(console.error);
