
const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x51E6C7538734d46EBCfA3142cc9745b213f9723d";
  const BaseDeckNFT = await ethers.getContractFactory("BaseDeckNFT");
  const signer = await ethers.provider.getSigner();
  const contract = await BaseDeckNFT.attach(contractAddress).connect(signer);

  const SANJI = "0x56D0c7eff3fC1e0DdB86d8A39b2DE929438A5509";
  const USDC = "0x87Ff57E71f9BFb2c7e6c64bea3C1254356De86f8";
  const MINT_PRICE = ethers.parseUnits("25", 6); // 25 USDC

  const sanji = await ethers.getContractAt("IERC20", SANJI);
  const usdc = await ethers.getContractAt("IERC20", USDC);

  const balance = await sanji.balanceOf(await signer.getAddress());
  const allowance = await usdc.allowance(signer.address, contractAddress);
  const hasMinted = await contract.hasMintedBase(signer.address);
  const cooldown = await contract.lastMintBase(signer.address);
  const currentBlock = await ethers.provider.getBlock("latest");

  console.log("🔎 Debug Info:");
  console.log("- SANJI balance:", ethers.formatUnits(balance, 18));
  console.log("- USDC allowance:", ethers.formatUnits(allowance, 6));
  console.log("- Has already minted Base Deck:", hasMinted);
  console.log("- Last mint timestamp:", cooldown.toString());
  console.log("- Current block timestamp:", currentBlock.timestamp.toString());

  if (hasMinted) {
    console.warn("⚠️ You have already minted a Base Deck NFT.");
    return;
  }

  let tx;
  if (balance >= ethers.parseUnits("1000000", 18)) {
    console.log("✅ Eligible for free SANJI mint");
    tx = await contract.mintBaseDeck(ethers.ZeroAddress);
  } else {
    console.log("⚠️ SANJI too low — approving and minting with USDC...");
    const approveTx = await usdc.approve(contractAddress, MINT_PRICE);
    await approveTx.wait();
    tx = await contract.mintBaseDeck(USDC);
  }

  const receipt = await tx.wait();
  console.log("✅ Minted! Tx hash:", receipt.hash);
}

main().catch(console.error);
