const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x51E6C7538734d46EBCfA3142cc9745b213f9723d"; // your latest BaseDeckNFT
  const BaseDeckNFT = await ethers.getContractFactory("BaseDeckNFT");
  const contract = await BaseDeckNFT.attach(contractAddress);

  const usdc = await contract.USDC();
  const usdt = await contract.USDT();

  console.log("🧾 Accepted USDC:", usdc);
  console.log("🧾 Accepted USDT:", usdt);
}

main().catch(console.error);
