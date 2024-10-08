require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");

require("solidity-coverage");

// https://eth-mainnet.alchemyapi.io/v2/NGeHrpvz4BP0WZGaiaaBInJA-yKjMKf9

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  //solidity: "pragma",
  solidity: {
    compilers: [
    {
        version: "0.7.6",
        settings: {
            optimizer: {
              enabled: true,
              runs: 200,
            },
          },
        },
      {
        version: "0.8.0",
        settings: {
            optimizer: {
              enabled: true,
              runs: 200,
            },
          },
      },
      {
        version: "0.8.13",
        settings: {
            optimizer: {
              enabled: true,
              runs: 200,
            },
          },
      },
    ],
  },
  networks: {
    hardhat: {
        allowUnlimitedContractSize: true
      },
    // hardhat: {
    //   // forking: {
    //   //   url: "https://mainnet.infura.io/v3/" + process.env.INFURA_KEY,
    //   // },
    //   // accounts: {
    //   //   mnemonic: process.env.MNEMONIC
    //   // }
    //   allowUnlimitedContractSize: true,
    // },
    local: {
      url: "127.0.0.1:8545",
    },
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/RYejb4WXXjHmxxscJB4qNpIZkXMOXskn",
      accounts: ["0a0ddf30ecb569d0133c6108d6223a8d793a57e954443864ea8cce6ac25af30a"],
    },
    goerli: {
      url: "http://127.0.0.1:8545",
      chainId: 5,
      gasMultiplier: 2,
      accounts: {
        mnemonic: process.env.MNEMONIC
      }
    },
    evmos: {
      url: "https://eth.bd.evmos.dev:8545",
      accounts: {
          mnemonic: process.env.MNEMONIC
        },
      gas: 2100000,
      gasPrice: 8000000000
    },
    canto: {
      url: "https://eth.plexnode.wtf",
      chainId: 740,
      accounts: {
          mnemonic: process.env.MNEMONIC
        },
      gas: 2100000,
      gasPrice: 8000000000
    },
    // mainnet: {
    //   url: process.env.RPC_URL,
    //   chainId: 1,
    //   gasMultiplier: 2,
    //   accounts: {
    //     mnemonic: process.env.MNEMONIC
    //   }
    // }
  },
  // gasReporter: {
  //   enabled: process.env.REPORT_GAS !== undefined,
  //   currency: "USD",
  // },
//   etherscan: {
//     apiKey: process.env.ETHERSCAN_API_KEY,
//   },
  mocha: {
    timeout: 1000000 //1000 secs
  },
};