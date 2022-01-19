import React, { useEffect, useState } from 'react'

// IPFS Configuration
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient.create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
});

const Homepage = ({ connectToMetamask, metamaskConnected, getTokenURI, accountAddress, setFakeURI, artsContracts, mintMyNFT, arts, updateMetaData }) => {
    const [artName, setArtName] = useState("Real Stuff");
    const [artPrice, setArtPrice] = useState('1');


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
            name: 'Hello Jeee',
            price: artPrice,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZHzVVBVClmIqkvb48PlbmN6Dd6s3nyYHEP6dsu9QuVzecwrRfUsTwZY0v6mYHR8tpvrk&usqp=CAU",
            description: "The real stuff is here"
        }

        const UnrevealedTokenObject = await {
            tokenName: "Artwork NFT",
            tokenSymbol: "ART",
            tokenId: `${tokenId}`,
            name: 'Hello Jeee',
            price: '101010',
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZHzVVBVClmIqkvb48PlbmN6Dd6s3nyYHEP6dsu9QuVzecwrRfUsTwZY0v6mYHR8tpvrk&usqp=CAU",
            description: "Real stuff is here"
        }

        console.log(tokenObject)
        // console.log(UnrevealedTokenObject)

        const cid1 = await ipfs.add(JSON.stringify(tokenObject));
        let tokenURI = `https://ipfs.infura.io/ipfs/${cid1.path}`;

        const cid2 = await ipfs.add(JSON.stringify(UnrevealedTokenObject));
        let unrevealedTokenURI = `https://ipfs.infura.io/ipfs/${cid2.path}`;

        await mintMyNFT(tokenURI, unrevealedTokenURI, artName, artPrice)

    }

    const updateURLHandler = async (id) => {
        await updateMetaData()
    }


    useEffect(() => {
        console.log(arts)
    }, [arts])

    return (
        <div className='container'>
            <div className='row d-flex justify-content-center'>
                <h1 className="display-2">Cake Project</h1>
            </div>
            <h4 className="text-center">(Demo Template)</h4>
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
            <hr />

            <div className='row d-flex justify-content-center mt-5'>
                {/* <h3>Gallery</h3> */}

                <div className='col-12 justify-content-center'>
                    {arts ? arts.map(art => (
                        <div className=''>
                            <h5>{art.tokenId}</h5>
                            <p>{art.tokenURI}</p>
                            <hr />
                        </div>
                    )) : null}
                </div>
            </div>
            <button className='btn btn-primary' onClick={updateMetaData}>Reveal</button>

            <button className='btn btn-danger ml-5' onClick={setFakeURI}>Set Fake URI</button>

            <button className='btn btn-success ml-5' onClick={getTokenURI}>Get Token URI</button>



        </div>
    )
}

export default Homepage
