import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Web3 from 'web3';
import Arts from '../abis/Cake.json';


// Importing components
import Navbar from './header/Navbar';
import Homepage from './homepage/Homepage';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountAddress: "",
      accountBalance: "",
      artsContracts: null,
      artsCount: 0,
      arts: [],
      loading: true,
      metamaskConnected: false,
      contractDetected: false,
      totalTokensMinted: 0,
      totalTokensOwnedByAccount: 0,
      tokenURI: ""
    };
  }

  componentWillMount = async () => {
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.setMetaData();
    // await this.getTokenURI()
  };


  loadWeb3 = async () => {
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

  loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();

    if (accounts.length === 0) {
      this.setState({ metamaskConnected: false });
    } else {
      this.setState({ metamaskConnected: true });
      this.setState({ loading: true });
      this.setState({ accountAddress: accounts[0] });

      let accountBalance = await web3.eth.getBalance(accounts[0]);
      accountBalance = web3.utils.fromWei(accountBalance, "Ether");
      this.setState({ accountBalance });
      this.setState({ loading: false });

      const networkId = await web3.eth.net.getId();
      const networkData = Arts.networks[networkId];
      // console.log(networkData)

      if (networkData) {
        this.setState({ loading: true });
        const artsContracts = new web3.eth.Contract(
          Arts.abi,
          networkData.address
        );

        // console.log(artsContracts)

        this.setState({ artsContracts });
        this.setState({ contractDetected: true });
        const artsCount = await artsContracts.methods
          .cakeCounter()
          .call();
        this.setState({ artsCount });
        console.log(artsCount)

        for (var i = 1; i <= artsCount; i++) {
          const art = await artsContracts.methods
            .allArts(i)
            .call();
          this.setState({
            arts: [...this.state.arts, art],
          });
        }

        // let totalTokensMinted = await artsContracts.methods
        //   .getNumberOfTokensMinted()
        //   .call();
        // totalTokensMinted = parseInt(totalTokensMinted);
        // this.setState({ totalTokensMinted });

        // let totalTokensOwnedByAccount = await artsContracts.methods
        //   .getTotalNumberOfTokensOwnedByAnAddress(this.state.accountAddress)
        //   .call();
        // totalTokensOwnedByAccount = parseInt(totalTokensOwnedByAccount);
        // this.setState({ totalTokensOwnedByAccount });

        this.setState({ loading: false });
      } else {
        this.setState({ contractDetected: false });
      }
    }
  };

  connectToMetamask = async () => {
    await window.ethereum.enable();
    this.setState({ metamaskConnected: true });
    window.location.reload();
  };

  // Loading Metadata of Monsters on Frontend
  setMetaData = async () => {
    if (this.state.arts.length !== 0) {
      this.state.arts.map(async (monster) => {
        const result = await fetch(monster.tokenURI);
        const metaData = await result.json();
        this.setState({
          arts: this.state.arts.map((monster) =>
            parseInt(monster.tokenId) === Number(metaData.tokenId)
              ? {
                ...monster,
                metaData
              }
              : monster
          ),
        });
      });
    }
  }

  // Function for minting new NFT
  mintMyNFT = async (tokenURI, unrevealedTokenURI, name, tokenPrice) => {
    this.setState({ loading: true });
    const price = window.web3.utils.toWei(tokenPrice.toString(), "Ether");

    this.state.artsContracts.methods
      .mintCake(tokenURI)
      .send({ from: this.state.accountAddress })
      .on('receipt', function (receipt) {
        console.log(receipt)
      })
    this.setState({ loading: false });

  }

  updateMetaData = async () => {
    this.state.artsContracts.methods
      .reveal()
      .send({ from: this.state.accountAddress })
  }

  setFakeURI = async () => {
    this.state.artsContracts.methods
      .setBaseURI('https://bafybeihdgjmeujxgbiwfh7dfmbgedlq6xff5i4ql4uykpola2g5yvgbdoa.ipfs.infura-ipfs.io')
      .send({ from: this.state.accountAddress })
  }


  getTokenURI = async () => {
    const uri = this.state.artsContracts.methods
      .getTokenMetaData(1)
      .call()
      .on('receipt', function (receipt) {
        console.log(uri)
        this.setState({tokenURI: uri})
      })
  }

    // getTokenURI = async (id) => {
    //   this.state.artsContracts.methods
    //     .tokenURI(id)
    //     .send({ from: this.state.accountAddress })
    // }


  render() {
    return (
      <div>
        {!this.state.metamaskConnected ? (
          <Homepage connectToMetamask={this.connectToMetamask} metamaskConnected={this.state.metamaskConnected} accountAddress={this.state.accountAddress} />
        ) : !this.state.contractDetected ? (
          <h2 className="display-4">Contract is deployed on different network!</h2>
        ) : this.state.loading ? (
          <h4 className="text-center mt-5">Loading...</h4>
        ) : (
          <BrowserRouter>
            <div>
              <Navbar connectToMetamask={this.connectToMetamask} metamaskConnected={this.state.metamaskConnected} accountAddress={this.state.accountAddress} />
              <Switch>
                <Route exact path="/" component={() => <Homepage mintMyNFT={this.mintMyNFT} connectToMetamask={this.connectToMetamask} metamaskConnected={this.state.metamaskConnected}
                  accountAddress={this.state.accountAddress} artsContracts={this.state.artsContracts} 
                  arts={this.state.arts} updateMetaData={this.updateMetaData} setFakeURI={this.setFakeURI} getTokenURI={this.getTokenURI} />} />
                {/* <Route path="/gallery" component={() => <Gallery arts={this.state.arts} />} /> */}
                {/* <Route path="/mint" component={() => <CreateNft mintMyNFT={this.mintMyNFT} accountAddress={this.state.accountAddress} />} /> */}
              </Switch>
            </div>
          </BrowserRouter>
        )}
      </div>
    );
  }
}


export default App;
