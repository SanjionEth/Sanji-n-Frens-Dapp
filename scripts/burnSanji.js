
const { ethers } = require("hardhat");

async function main() {
  const SANJI = "0xF547999579e5672d6f8B3696722DDCbBd9b0e93A"; // Mock SANJI token
  const signer = await ethers.provider.getSigner();
  const address = await signer.getAddress();

  const sanji = await ethers.getContractAt("MockSANJI", SANJI);
  const balance = await sanji.balanceOf(address);

  console.log("🔻 Burning SANJI balance to simulate < 1M...");
  console.log("Current SANJI Balance:", ethers.formatUnits(balance, 18));

  const tx = await sanji.transfer("0x000000000000000000000000000000000000dEaD", balance);
  await tx.wait();

  const post = await sanji.balanceOf(address);
  console.log("New SANJI Balance:", ethers.formatUnits(post, 18));
}

main().catch(console.error);
