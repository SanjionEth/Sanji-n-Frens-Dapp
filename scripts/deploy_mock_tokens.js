const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const MockSANJI = await ethers.getContractFactory("contracts/MockSANJI.sol:MockSANJI");
  const sanji = await MockSANJI.deploy();
  await sanji.waitForDeployment();
  console.log("✅ Mock SANJI deployed:", sanji.target);

  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const usdc = await MockUSDC.deploy();
  await usdc.waitForDeployment();
  console.log("✅ Mock USDC deployed:", usdc.target);

  const MockUSDT = await ethers.getContractFactory("MockUSDT");
  const usdt = await MockUSDT.deploy();
  await usdt.waitForDeployment();
  console.log("✅ Mock USDT deployed:", usdt.target);

  const sanjiBal = await sanji.balanceOf(deployer.address);
  const usdcBal = await usdc.balanceOf(deployer.address);
  const usdtBal = await usdt.balanceOf(deployer.address);

  console.log("Balances:");
  console.log("SANJI:", ethers.formatUnits(sanjiBal, 18));
  console.log("USDC:", ethers.formatUnits(usdcBal, 6));
  console.log("USDT:", ethers.formatUnits(usdtBal, 6));
}

main().catch(console.error);
