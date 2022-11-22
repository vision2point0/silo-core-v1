// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  // deploy silo governance token
  const SiloGovernanceToken = await hre.ethers.getContractFactory("SiloGovernanceToken");
  const siloGovernanceToken = await SiloGovernanceToken.deploy();

  await siloGovernanceToken.deployed();

  console.log(
    `siloGovernanceToken  ${siloGovernanceToken.address}`
  );

  // deploy silo governor   
  const timelockAddress = ""; //openzeppling timelock contract address
  const SiloGovernor = await hre.ethers.getContractFactory("SiloGovernor");
  const siloGovernor = await SiloGovernor.deploy(siloGovernanceToken.address, timelockAddress);

  await siloGovernor.deployed();

  console.log(
    `siloGovernor  ${siloGovernor.address}`
  );

// deploy token factory
  const TokensFactory = await hre.ethers.getContractFactory("TokensFactory");
  const tokenFactory = await TokensFactory.deploy();

  await tokenFactory.deployed();

  console.log(
    `tokenFactory  ${tokenFactory.address}`
  );

  // deploy silo factory
  const SiloFactory = await hre.ethers.getContractFactory("SiloFactory");
  const siloFactory = await SiloFactory.deploy();

  await siloFactory.deployed();

  console.log(
    `siloFactory  ${siloFactory.address}`
  );

  // deploy silo repository
//   const defaultMaxLTV = hre.ethers.utils.parseEther("80");
//   const defaultLiquidationThreshold = hre.ethers.utils.parseEther("90");
  const defaultMaxLTV = "80";
  const defaultLiquidationThreshold = "90";
  const initialBridgeAssets = ["0xa1c3C3A82415dEf118D145DCd2f3b7bE1eF678e0"] //weth address
  const SiloRepository = await hre.ethers.getContractFactory("SiloRepository");
  const siloRepository = await SiloRepository.deploy(siloFactory.address, tokenFactory.address, defaultMaxLTV, defaultLiquidationThreshold, initialBridgeAssets);

  await siloRepository.deployed();

  console.log(
    `siloRepository  ${siloRepository.address}`
  );


// deploy price provider repository
const wrapperNativeToken = "0xa1c3C3A82415dEf118D145DCd2f3b7bE1eF678e0" //weth address
const PriceProvidersRepository = await hre.ethers.getContractFactory("PriceProvidersRepository");
const priceProvidersRepository = await PriceProvidersRepository.deploy(wrapperNativeToken, siloRepository.address);

await priceProvidersRepository.deployed();

console.log(
  `priceProvidersRepository  ${priceProvidersRepository.address}`
);

// deploy silo lens
const SiloLens = await hre.ethers.getContractFactory("SiloLens");
const siloLens = await SiloLens.deploy(siloRepository.address);

await siloLens.deployed();

console.log(
  `siloLens  ${siloLens.address}`
);

// deploy interest rate data resolver
const InterestRateDataResolver = await hre.ethers.getContractFactory("InterestRateDataResolver");
const interestRateDataResolver = await InterestRateDataResolver.deploy(siloRepository.address, siloLens.address);

await interestRateDataResolver.deployed();

console.log(
  `interestRateDataResolver  ${interestRateDataResolver.address}`
);

// deploy interest rate model
const config = {
    uopt: 1,
    ucrit: 1,
    ulow: 1,
    ki: 1,
    kcrit: 1,
    klow: 1,
    klin: 1,
    beta: 1,
    ri: 1,
    Tcrit:1
  }
const InterestRateModel = await hre.ethers.getContractFactory("InterestRateModel");
const interestRateModel = await InterestRateModel.deploy(config);

await interestRateModel.deployed();

console.log(
  `interestRateModel  ${interestRateModel.address}`
);

// deploy silo liquidation lens
const SiloLiquidationLens = await hre.ethers.getContractFactory("SiloLiquidationLens");
const siloLiquidationLens = await SiloLiquidationLens.deploy(siloRepository.address);

await siloLiquidationLens.deployed();

console.log(
  `siloLiquidationLens  ${siloLiquidationLens.address}`
);

// deploy silo router
const SiloRouter = await hre.ethers.getContractFactory("SiloRouter");
const siloRouter = await SiloRouter.deploy(wrapperNativeToken, siloRepository.address);

await siloRouter.deployed();

console.log(
  `siloRouter  ${siloRouter.address}`
);

// deploy PRBMathCommon
const PRBMathCommon = await hre.ethers.getContractFactory("PRBMathCommon");
const pRBMathCommon = await PRBMathCommon.deploy();

await pRBMathCommon.deployed();

console.log(
  `pRBMathCommon  ${pRBMathCommon.address}`
);

// deploy PRBMathSD59x18
const PRBMathSD59x18 = await hre.ethers.getContractFactory("PRBMathSD59x18");
const pRBMathSD59x18 = await PRBMathSD59x18.deploy();

await pRBMathSD59x18.deployed();

console.log(
  `pRBMathSD59x18  ${pRBMathSD59x18.address}`
);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});