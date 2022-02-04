import React, { Component, useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Web3 from 'web3';
import Cake from '../abis/Cake.json';


// Importing components
import Navbar from './header/Navbar';
import Homepage from './homepage/Homepage';
import AdminPanel from './admin/AdminPanel';


const App = () => {

  const [accountAddress, setAccountAddresss] = useState('')
  const [accountBalance, setAccountBalance] = useState('')
  const [cakeContract, setCakeContract] = useState(null)
  const [cakeCount, setCakeCount] = useState(0)
  const [cakes, setCakes] = useState([])
  const [loading, setLoading] = useState(true)
  const [metamaskConnected, setMetamaskConnected] = useState(false)
  const [contractDetected, setContractDetected] = useState(false)
  // const [totalTokensMinted, setTotalTokensMinted] = useState(0)
  // const [totalTokensOwnedByAccount, setTotalTokensOwnedByAccount] = useState(0)
  const [tokenURI, setTokenURI] = useState('')


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

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();

    if (accounts.length === 0) {
      setMetamaskConnected(false)
    } else {
      setMetamaskConnected(true);
      setLoading(true);
      setAccountAddresss(accounts[0])

      let accountBalance = await web3.eth.getBalance(accounts[0]);
      accountBalance = web3.utils.fromWei(accountBalance, "Ether");
      setAccountBalance(accountBalance);
      setLoading(false);

      const networkId = await web3.eth.net.getId();
      const networkData = Cake.networks[networkId];
      // console.log(networkData)

      if (networkData) {
        setLoading(true)
        const cakeContracts = new web3.eth.Contract(
          Cake.abi,
          networkData.address
        );

        setCakeContract(cakeContracts)
        setContractDetected(true)
        const cakesCount = await cakeContracts.methods
          .cakeCounter()
          .call();
        setCakeCount(cakesCount)
        console.log(cakeCount)

        setLoading(false)
      } else {
        setContractDetected(false)
      }
    }
  };

  const connectToMetamask = async () => {
    await window.ethereum.enable();
    setMetamaskConnected(true)
    window.location.reload();
  };

  // Loading Metadata of cakes on Frontend
  const setMetaData = async () => {
    if (cakes.length !== 0) {
      cakes.map(async (cake) => {
        const result = await fetch(cake.tokenURI);
        const metaData = await result.json();

        setCakes(cakes.map((cake) =>
          parseInt(cake.tokenId) === Number(metaData.tokenId)
            ? {
              ...cake,
              metaData
            }
            : cake
        ))
      });
    }
  }

  // Function for minting new NFT
  const mintMyNFT = async (tokenURI, tokenPrice) => {
    setLoading(true)
    const price = window.web3.utils.toWei(tokenPrice.toString(), "Ether");

    cakeContract.methods
      .mintCake(tokenURI)
      .send({ from: accountAddress, value: price })
      .on('receipt', function (receipt) {
        console.log(receipt)
      })
    setLoading(false)
  }

  const updateMetaData = async () => {
    cakeContract.methods
      .reveal()
      .send({ from: accountAddress })
  }

  const setFakeURI = async () => {
    cakeContract.methods
      .setBaseURI('https://bafybeihdgjmeujxgbiwfh7dfmbgedlq6xff5i4ql4uykpola2g5yvgbdoa.ipfs.infura-ipfs.io')
      .send({ from: accountAddress })
  }


  const getTokenURI = async () => {
    const uri = cakeContract.methods
      .getTokenMetaData(1)
      .call()
      .on('receipt', function (receipt) {
        console.log(uri)
        setTokenURI(uri)
      })
  }

  useEffect(() => {
    async function fetchData() {
      await loadWeb3();
      await loadBlockchainData();
      await setMetaData();
    }
    fetchData();
  }, [metamaskConnected, contractDetected]);


  return (
    <div>
      {!metamaskConnected ? (
        <Homepage connectToMetamask={connectToMetamask} metamaskConnected={metamaskConnected} accountAddress={accountAddress} />
      ) : !contractDetected ? (
        <h2 className="display-4">Contract is deployed on different network!</h2>
      ) : loading ? (
        <h4 className="text-center mt-5">Loading...</h4>
      ) : (
        <BrowserRouter>
          <div>
            <Navbar connectToMetamask={connectToMetamask} metamaskConnected={metamaskConnected} accountAddress={accountAddress} />
            <Switch>
              <Route exact path="/" component={() => <Homepage mintMyNFT={mintMyNFT} connectToMetamask={connectToMetamask} metamaskConnected={metamaskConnected}
                accountAddress={accountAddress} cakeContracts={cakeContract}
                cakes={cakes} updateMetaData={updateMetaData} setFakeURI={setFakeURI} getTokenURI={getTokenURI} />} />
              
              {accountAddress === '0x0b7C7Efe2183fEf476b5f86cE53dA612c5dC89b6' ? 
              <Route exact path="/admin" component={() => <AdminPanel mintMyNFT={mintMyNFT} connectToMetamask={connectToMetamask} metamaskConnected={metamaskConnected}
              accountAddress={accountAddress} cakeContracts={cakeContract}
              cakes={cakes} updateMetaData={updateMetaData} setFakeURI={setFakeURI} getTokenURI={getTokenURI} />} /> : null
            }
              
            
          </Switch>
          </div>
        </BrowserRouter>
      )}
    </div>
  );
}


export default App;
