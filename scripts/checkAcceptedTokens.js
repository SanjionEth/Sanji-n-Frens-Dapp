const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x51E6C7538734d46EBCfA3142cc9745b213f9723d";
  const BaseDeckNFT = await ethers.getContractFactory("BaseDeckNFT");
  const contract = await BaseDeckNFT.attach(contractAddress);

  const acceptedUSDC = await contract.USDC();
  const acceptedUSDT = await contract.USDT();

  console.log("✅ Accepted USDC:", acceptedUSDC);
  console.log("✅ Accepted USDT:", acceptedUSDT);
}

main().catch(console.error);
