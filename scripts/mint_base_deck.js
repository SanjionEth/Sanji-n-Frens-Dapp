const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x0D23e63Db1D2e7346d0c09122c59b393557b98A2";

  const [deployer] = await ethers.getSigners();
  const contract = await ethers.getContractAt("BaseDeckNFT", contractAddress);

  const tx = await contract.mintBaseDeck(deployer.address);
  await tx.wait();

  console.log(`✅ Base Deck minted to ${deployer.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
