
const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0xa6a5A264867CEf5d0aC41a632F415f9Da983A277"; // BaseDeckNFT contract
  const BaseDeckNFT = await ethers.getContractFactory("BaseDeckNFT");
  const signer = await ethers.provider.getSigner();
  const contract = await BaseDeckNFT.attach(contractAddress).connect(signer);

  const SANJI = "0x1c7e95fcFeFb32d1dB20d20084CCA2E4e8C53D66";
  const USDC = "0x87Ff57E71f9BFb2c7e6c64bea3C1254356De86f8";
  const MINT_PRICE = ethers.parseUnits("25", 6); // 25 USDC

  const sanji = await ethers.getContractAt("IERC20", SANJI);
  const usdc = await ethers.getContractAt("IERC20", USDC);
  const balance = await sanji.balanceOf(await signer.getAddress());

  console.log("SANJI balance:", ethers.formatUnits(balance, 18));

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
