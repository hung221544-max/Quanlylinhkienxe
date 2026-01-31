const hre = require("hardhat");

async function main() {
  const VehicleHistory = await hre.ethers.getContractFactory("VehicleHistory");
  const contract = await VehicleHistory.deploy();

  await contract.deployed();

  console.log("✅ Deployed at:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
