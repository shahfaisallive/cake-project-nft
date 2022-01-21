const Cake = artifacts.require("Cake");

module.exports = async function(deployer) {
  await deployer.deploy(Cake);
};
