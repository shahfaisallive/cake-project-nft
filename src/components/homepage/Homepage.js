import React, { useEffect, useState } from 'react'

// IPFS Configuration
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient.create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
});

const Homepage = ({ connectToMetamask, metamaskConnected, accountAddress, artsContracts, mintMyNFT, arts }) => {
    const [artName, setArtName] = useState("SampleName");
    const [artPrice, setArtPrice] = useState('10');


    const mintNFTHandler = async (e) => {
        e.preventDefault();
        let previousTokenId = await artsContracts.methods
            .artCounter()
            .call();
        previousTokenId = parseInt(previousTokenId);
        const tokenId = previousTokenId + 1;

        const tokenObject = await {
            tokenName: "Artwork NFT",
            tokenSymbol: "ART",
            tokenId: `${tokenId}`,
            name: artName,
            price: artPrice,
            image: "https://www.artbyalysia.com/uploads/6/1/6/5/61653353/1561787_orig.jpg",
            description: "sample prc data bla bla"
        }

        console.log(tokenObject)
        const mid = await ipfs.add(JSON.stringify(tokenObject));
        let tokenURI = `https://ipfs.infura.io/ipfs/${mid.path}`;

        await mintMyNFT(tokenURI, artName, artPrice)

    }


    useEffect(() => {
        console.log(arts)
    }, [arts])

    return (
        <div className='container'>
            <div className='row d-flex justify-content-center'>
                <h1 className="display-2">NFT Website</h1>
            </div>
            <hr />
            <div className="row d-flex justify-content-center">
                {!metamaskConnected ? <button className="btn btn-outline-success bg-light" type="button"
                    onClick={connectToMetamask}>
                    Connect to Metamask
                </button> : <div>
                    <h3 className="text-success text-center">Account Connected</h3>
                    <p>{accountAddress}</p>

                    <div className="text-center">
                        <button className="btn btn-secondary mt-5" onClick={mintNFTHandler}>Mint here</button>
                    </div>
                </div>}

            </div>
        </div>
    )
}

export default Homepage
