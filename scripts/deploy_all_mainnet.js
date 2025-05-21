const { ethers } = require("hardhat");

async function main() {
  const SANJI = "0x8E0B3E3Cb4468B6aa07a64E69DEb72aeA8eddC6F";
  const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  const PAYOUT = "0x71d4587E55bC3C25f7821b7dDFaE7Cf93457E77E";

  const baseDeckURI = "ipfs://bafybeier6d477wnmm5cuxv3byhy7x65oefptj5jf4qttfms6vntkbfibby/0_base_deck.json";
  const whistleURI = "ipfs://bafybeier6d477wnmm5cuxv3byhy7x65oefptj5jf4qttfms6vntkbfibby/1_tactical_whistle.json";
  const codeURI = "ipfs://bafybeier6d477wnmm5cuxv3byhy7x65oefptj5jf4qttfms6vntkbfibby/2_first_code.json";

  const BaseDeck = await ethers.getContractFactory("BaseDeckNFT");
  const baseDeck = await BaseDeck.deploy(SANJI, USDC, USDT, PAYOUT);
  await baseDeck.waitForDeployment();
  console.log("✅ BaseDeckNFT deployed at:", baseDeck.target);

  const SpecialCard = await ethers.getContractFactory("SpecialCardNFT");

  const whistle = await SpecialCard.deploy(
    SANJI,
    PAYOUT,
    whistleURI,
    ethers.parseUnits("5000000", 18),
    200,
    baseDeck.target
  );
  await whistle.waitForDeployment();
  console.log("✅ Tactical Whistle NFT deployed at:", whistle.target);

  const code = await SpecialCard.deploy(
    SANJI,
    PAYOUT,
    codeURI,
    ethers.parseUnits("10000000", 18),
    100,
    baseDeck.target
  );
  await code.waitForDeployment();
  console.log("✅ Altman's First Code NFT deployed at:", code.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
