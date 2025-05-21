const { ethers } = require("hardhat");

async function main() {
  const usdc = "0x0000000000000000000000000000000000000000"; // Replace with real or testnet address
  const usdt = "0x0000000000000000000000000000000000000000"; // Replace with real or testnet address
  const payout = "0x71d4587E55bC3C25f7821b7dDFaE7Cf93457E77E";

  const BaseDeckNFT = await ethers.getContractFactory("BaseDeckNFT");
  const baseDeck = await BaseDeckNFT.deploy(usdc, usdt, payout);  // ✅ this is the deploy call
  await baseDeck.waitForDeployment();                             // ✅ updated for Hardhat/ethers v6

  console.log(`✅ BaseDeckNFT deployed at: ${baseDeck.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

