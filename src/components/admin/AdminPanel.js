import React from 'react';

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient.create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
});

const AdminPanel = ({connectToMetamask, metamaskConnected, getTokenURI, accountAddress, setFakeURI, cakeContracts, mintMyNFT, cakes, updateMetaData }) => {

    const mintByAdminHandler = async (e) => {
        e.preventDefault();
        let previousTokenId = await cakeContracts.methods
            .cakeCounter()
            .call();
        previousTokenId = parseInt(previousTokenId);
        const tokenId = previousTokenId + 1;
        console.log(tokenId);

        const tokenObject = await {
            tokenName: "Cake NFT",
            tokenSymbol: "ART",
            tokenId: `${tokenId}`,
            name: 'Hello',
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZHzVVBVClmIqkvb48PlbmN6Dd6s3nyYHEP6dsu9QuVzecwrRfUsTwZY0v6mYHR8tpvrk&usqp=CAU",
            description: "The real stuff is here"
        }

        console.log(tokenObject)

        const cid1 = await ipfs.add(JSON.stringify(tokenObject));
        let tokenURI = `https://ipfs.infura.io/ipfs/${cid1.path}`;
        console.log(tokenURI);
        await mintMyNFT(tokenURI, 0)
    }

  return <div className='container pt-5 pb-5'>
      <h2 className='text-center mb-5'>Admin Panel</h2>

      <h5>Click here to Mint without gas fees</h5>
      <button className='btn btn-primary' onClick={mintByAdminHandler}>
          Mint by Admin
      </button>
  </div>;
};

export default AdminPanel;
