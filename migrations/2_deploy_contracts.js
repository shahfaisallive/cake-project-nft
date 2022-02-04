const Cake = artifacts.require("Cake");

module.exports = async function(deployer) {
  await deployer.deploy(Cake);
};


  // await deployer.deploy('https://ipfs.io/ipfs/', 'https://ipfs.infura.io/ipfs/QmZQfMGcvP6hvVBkYVcthMhMKWndHd2rcmSabP1CVM8sND');
