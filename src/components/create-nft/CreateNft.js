import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

// IPFS Configuration
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient.create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
});


const CreateNft = ({ mintMyNFT, monstersContract, accountAddress }) => {
    const dispatch = useDispatch()
    const history = useHistory()

    // Declaring State for NFT minting form
    const [DNA, setDNA] = useState(null)


    const randomMonster = useSelector(state => state.randomMonster);

    useEffect(() => {
      
    }, [dispatch])


    // Function to call minting Function from Props
    const mintNFTHandler = async (e) => {
        const adminAddress = "0x8449BDcEC1C2444Eed7CDC07c415009265d822c2"
        // if (accountAddress === adminAddress) {

        e.preventDefault();
        await setDNA(randomMonster.monster.dna)
        console.log(randomMonster)
        let previousTokenId = await monstersContract.methods
            .monsterCounter()
            .call();
        previousTokenId = parseInt(previousTokenId);
        const tokenId = previousTokenId + 1;

        const baseMintValue = 0.08;
        const mintPriceLevel = Math.floor(previousTokenId / 2);
        let mintValue = baseMintValue + (mintPriceLevel * 0.01);
        if(accountAddress === adminAddress){
            mintValue = 0
        }else if (mintValue < 0.1) {
            mintValue = mintValue
        } else {
            mintValue = 0.1
        }

        const tokenObject = await {
            tokenName: "HMON Monsters",
            tokenSymbol: "HMON",
            tokenId: `${tokenId}`,
            parent1: 0,
            parent2: 0,
            // name: monsterName,
            ilvl: randomMonster.monster.ilvl,
        }

        // console.log(tokenObject)
        const cid = await ipfs.add(JSON.stringify(tokenObject));
        let tokenURI = `https://ipfs.infura.io/ipfs/${cid.path}`;

        if (randomMonster.monster.dna) {
            // mintMyNFT(monsterName, tokenURI, DNA, monsterPrice, mintValue)   
            console.log(tokenURI)
            await mintMyNFT(tokenURI, randomMonster.monster.dna, mintValue)
            // history.push(`/monsterdetails/${tokenId}`)
            history.push('/gallery')

        } else {
            window.alert(
                "Something is missing...."
            );
        }

        // } else {
        //     window.alert(
        //         "Only admins are allowed to Mint new NFTs"
        //     );
        // }
    }


    return (
        <div className='container'>
            <div className='row d-flex justify-content-center'>
                <h1 className="display-4">Mint new NFTs</h1>
            </div>
            {/* Form for minting NFTs */}
            <div className="row d-flex justify-content-center mt-5">
                <div className="col-md-6">
                    <form>
                        {/* <div className="form-group">
                            <label htmlFor="monsterName">Monster Name</label>
                            <input required type="text" value={monsterName} className="form-control"
                                onChange={(e) => setMonsterName(e.target.value)} placeholder="Monster Name..." />
                        </div>

                        <div className="form-group">
                            <label htmlFor="monsterPrice">Monster Price</label>
                            <input required type="text" value={monsterPrice} className="form-control"
                                onChange={(e) => setMonsterPrice(e.target.value)} placeholder="Monster Price..." />
                        </div> */}
                    </form>

                    {/* <div className="form-group">
                        <label htmlFor="monsterElement" className="mr-4 font-weight-bold" >Element Type</label>
                        <select defaultValue="element" className=" form-select w-50" onChange={e => setMonsterElement(e.target.value)}>
                            <option>Element</option>
                            <option value="Water">Water</option>
                            <option value="Fire">Fire</option>
                            <option value="Nature">Nature</option>
                            <option value="Dark">Dark</option>
                            <option value="Light">Light</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="monsterFamily" className="mr-4 font-weight-bold" >Family Type</label>
                        <select defaultValue="family" className=" form-select w-50" onChange={e => setMonsterFamily(e.target.value)}>
                            <option>Family</option>
                            <option value="Demons">Demons</option>
                            <option value="Sharks">Sharks</option>
                            <option value="Dragons">Dragons</option>
                            <option value="Warriors">Warriors</option>
                            <option value="Mages">Mages</option>
                            <option value="Angels">Angels</option>
                            <option value="All Families">All families</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="monsterSkin" className="mr-4 font-weight-bold" >Monster Look</label>
                        <select defaultValue="skin type" className=" form-select w-50" onChange={e => setMonsterSkin(e.target.value)}>
                            <option>Skin Type</option>
                            <option value="Normal">Normal</option>
                            <option value="Shiny">Shiny</option>
                        </select>
                    </div> */}

                    {/* {!uploaded ? <button type="btn" onClick={uploadMonsterHandler} className="btn btn-primary">
                        Select this monster
                    </button> : <button type="submit" onClick={mintNFTHandler} className="btn btn-secondary">
                        Mint this Monster
                    </button>} */}

                    <div className="text-center">
                        <button className="btn btn-secondary mt-5" onClick={mintNFTHandler}>Mint a Monster</button>
                        <p className="mt-2 text-danger" style={{ font: 10 }}><b>NOTE: </b>Click on this button to own a randomly generated Monster. You will be able to view your monster after transaction is confirmed</p>
                    </div>

                </div>

                {/* MONSTER PROPERTIES SECTION */}
                {/* <div className="col-md-6">
                    {!randomMonster.loading && randomMonster.monster ? <img src={`${mediaPath}/${randomMonster.monster.monsterInfo.filename}`} width={300} /> :
                        <img src={`https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc=`} width={300} />}

                    <div className="row mt-3">
                        <h6>DNA: {!randomMonster.loading && randomMonster.monster ? randomMonster.monster.dna : '0000000000000000'} </h6>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default CreateNft
