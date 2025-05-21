const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x0D23e63Db1D2e7346d0c09122c59b393557b98A2";
  const tokenId = 1;

  const contract = await ethers.getContractAt("BaseDeckNFT", contractAddress);
  const uri = await contract.tokenURI(tokenId);
  console.log(`Token URI for token ID ${tokenId}:`, uri);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
