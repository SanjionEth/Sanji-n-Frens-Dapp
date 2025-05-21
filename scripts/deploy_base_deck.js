const { ethers } = require("hardhat");

async function main() {
  const SANJI = "0xF547999579e5672d6f8B3696722DDCbBd9b0e93A"; // Mock SANJI
  const USDC = "0x87Ff57E71f9BFb2c7e6c64bea3C1254356De86f8"; // Mock USDC
  const USDT = "0x11A8F44832CC06122B4Ba24Cb8b934444BAB6Cd5"; // Mock USDT
  const PAYOUT = "0x71d4587E55bC3C25f7821b7dDFaE7Cf93457E77E"; // payout wallet

  const BaseDeckNFT = await ethers.getContractFactory("BaseDeckNFT");
  const contract = await BaseDeckNFT.deploy(SANJI, USDC, USDT, PAYOUT);
  await contract.waitForDeployment();

  console.log("✅ BaseDeckNFT deployed at:", contract.target);
}

main().catch(console.error);
