const Arts = artifacts.require("Arts");

module.exports = async function(deployer) {
  await deployer.deploy(Arts);
};
