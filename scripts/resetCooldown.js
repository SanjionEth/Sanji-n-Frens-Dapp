
const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x51E6C7538734d46EBCfA3142cc9745b213f9723d"; // BaseDeckNFT
  const BaseDeckNFT = await ethers.getContractFactory("BaseDeckNFT");
  const signer = await ethers.provider.getSigner();
  const contract = await BaseDeckNFT.attach(contractAddress).connect(signer);

  const address = await signer.getAddress();

  // This assumes the signer is the owner (admin) of the contract
  const tx1 = await contract.setHasMintedBase(address, false);
  const tx2 = await contract.setLastMintBase(address, 0);

  await tx1.wait();
  await tx2.wait();

  console.log("✅ Cooldown and mint status reset for:", address);
}

main().catch(console.error);
