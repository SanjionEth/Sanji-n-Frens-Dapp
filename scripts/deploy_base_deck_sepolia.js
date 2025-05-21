const { ethers } = require("hardhat");

async function main() {
  const SANJI = "0x1c7e95fcFeFb32d1dB20d20084CCA2E4e8C53D66";
  const USDC = "0x87Ff57E71f9BFb2c7e6c64bea3C1254356De86f8";
  const USDT = "0x11A8F44832CC06122B4Ba24Cb8b934444BAB6Cd5";
  const PAYOUT = "0x71d4587E55bC3C25f7821b7dDFaE7Cf93457E77E";

  const BaseDeck = await ethers.getContractFactory("BaseDeckNFT");
  const baseDeck = await BaseDeck.deploy(SANJI, USDC, USDT, PAYOUT);
  await baseDeck.waitForDeployment();

  console.log("✅ BaseDeckNFT deployed at:", baseDeck.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
