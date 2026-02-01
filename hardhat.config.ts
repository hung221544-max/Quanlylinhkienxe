require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    cronos: {
      url: process.env.CRONOS_RPC,
      chainId: 338,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
