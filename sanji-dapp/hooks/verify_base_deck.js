// scripts/verify_base_deck.js
const hre = require("hardhat");

async function main() {
  const contractAddress = "0x169d50acDfDe126776e969963343523e2d543283"; // Replace with actual address

  const SANJI = "0x8E0B3E3Cb4468B6aa07a64E69DEb72aeA8eddC6F";
  const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  const PAYOUT = "0x71d4587E55bC3C25f7821b7dDFaE7Cf93457E77E";

  await hre.run("verify:verify", {
    address: contractAddress,
    constructorArguments: [SANJI, USDC, USDT, PAYOUT],
    contract: "contracts/BaseDeckNFT.sol:BaseDeckNFT"
  });

  console.log(`✅ BaseDeckNFT verified at: ${contractAddress}`);
}

main().catch((error) => {
  console.error("❌ Verification failed:", error);
  process.exitCode = 1;
});
