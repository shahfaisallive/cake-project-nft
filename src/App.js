import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import Cake from './abis/Cake.json'


// Importing components
import Navbar from './components/Navbar';
import Minting from './components/Minting';

function App() {
  // STATES FOR WEB3 AND CONTRACT INTEGRATION
  const [metamaskConnected, setMetamaskConnected] = useState(false)
  const [accountAddress, setAccountAddresss] = useState('')
  const [cakeContract, setCakeContract] = useState(null)
  const [contractDetected, setContractDetected] = useState(false)
  const [accountBalance, setAccountBalance] = useState('')
  const [isOwner, setIsOwner] = useState(false)
  const [paused, setPaused] = useState(null)
  const [mintLoader, setMintLoader] = useState(false)


  // LOAD WEB3 FUNCTION
  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  // LOADING BLOCKCHAIN DATA
  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();

    if (accounts.length === 0) {
      setMetamaskConnected(false)
    } else {
      setMetamaskConnected(true);
      setAccountAddresss(accounts[0])

      let accountBalance = await web3.eth.getBalance(accounts[0]);
      accountBalance = web3.utils.fromWei(accountBalance, "Ether");
      setAccountBalance(accountBalance);

      const contract = new web3.eth.Contract(
        Cake.abi,
        Cake.contractAddress
      );

      setCakeContract(contract)
        // console.log(contract)
      setContractDetected(true)

      const name = await contract.methods.name().call()
      console.log("Name of this contract is: ", name)

      const owner = await contract.methods
        .owner()
        .call();
      if (accounts[0] === owner) {
        setIsOwner(true)
      }
    }
  };


  // FUNCTION FOR METAMASK INTEGRATION
  const connectToMetamask = async () => {
    await window.ethereum.enable();
    setMetamaskConnected(true)
    window.location.reload();
  };


  // MINT FUNCTION
  const mintNFT = async (amount) => {
    setMintLoader(true)
    await cakeContract.methods.publicSaleMint(amount)
      .send({ from: accountAddress })
    setMintLoader(false)

  }

  // USEEFFECT FUNCTION----->>>
  useEffect(() => {
    async function fetchData() {
      await loadWeb3();
      await loadBlockchainData();
    }
    fetchData();
  }, [metamaskConnected, contractDetected])




  return (
    <div className="App">
      <Navbar connectToMetamask={connectToMetamask} metamaskConnected={metamaskConnected} accountAddress={accountAddress} accountBalance={accountBalance} />
      <Minting accountAddress={accountAddress} metamaskConnected={metamaskConnected} connectToMetamask={connectToMetamask} mintNFT={mintNFT} contractDetected={contractDetected} mintLoader={mintLoader} />
    </div>
  );
}

export default App;
