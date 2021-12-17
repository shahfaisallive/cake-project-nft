import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap';
import { useParams } from 'react-router'

const NFTDetails = ({ monstersContract, monsters, accountAddress }) => {
    const { id } = useParams()
    const [monsterDetails, setMonsterDetails] = useState(null);
    const [DNA, setDNA] = useState(null);
    const [elementGene, setElementGene] = useState(null);
    const [familyGene, setFamilyGene] = useState(null);
    const [lookGene, setLookGene] = useState(null);


    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        const monster = await monsters.find(m => m.tokenId === id)
        setMonsterDetails(monster);
        if (monsterDetails) {
            setDNA(monsterDetails.genes)
        }
        // console.log(monster)
        // console.log(DNA)
        if (DNA) {
            setElementGene(parseInt((DNA.slice(0, 2))))
            setFamilyGene(parseInt((DNA.slice(2, 4))))
            setLookGene(parseInt((DNA.slice(4, 5))))
        }
        // console.log(monsterDetails)

    }, [id, monsterDetails, DNA, monsters])

    const renderElement = () => {
        return <>
            {elementGene >= 0 && elementGene <= 31 ? 'Water' :
                elementGene >= 32 && elementGene <= 63 ? 'Fire' :
                    elementGene >= 64 && elementGene <= 95 ? 'Nature' :
                        elementGene >= 96 && elementGene <= 97 ? 'Dark' : 'Light'}
        </>
    }

    const renderFamily = () => {
        return <>
            {familyGene >= 0 && familyGene <= 4 ? 'Demon' :
                familyGene >= 5 && familyGene <= 9 ? 'Sharks' :
                    familyGene >= 10 && familyGene <= 14 ? 'Dragons' :
                        familyGene >= 15 && familyGene <= 19 ? 'Warriors' :
                            familyGene >= 20 && familyGene <= 24 ? 'Mages' :
                                familyGene >= 25 && familyGene <= 29 ? 'Angels' : 'All families'}
        </>
    }

    const renderLook = () => {
        return <>
            {lookGene >= 0 && lookGene <= 8 ? 'Normal' : 'Shiny'}
        </>
    }

    const buyMonsterHandler = () => {
        monstersContract.methods
            .buyMonster(monsterDetails.tokenId)
            .send({ from: accountAddress, value: window.web3.utils.toWei('0.05', 'ether') })
            .on("confirmation", () => {
                localStorage.setItem(accountAddress, new Date().getTime());
                window.location.reload();
            })
    }

    return (
        <div className="container">
            {monsterDetails ? (
                <div className="row mt-5">
                    <div className="col-mg-6">
                        {monsterDetails.metaData ? <img src={monsterDetails.metaData.monsterImage} width={300} height={400} alt='monster' /> : <Spinner animation="border" variant="primary" />}
                    </div>
                    <div className="col-mg-6 pl-5">
                        <h4>{monsterDetails.tokenName}</h4>
                        <p className="card-text mt-4"><b>Id: {monsterDetails.tokenId}</b></p>
                        {/* <p><b>Price</b>: {Web3.utils.fromWei(monsterDetails.price, 'ether')} Ether</p> */}
                        <p><b>Minted By</b>: {monsterDetails.mintedBy}</p>

                        {monsterDetails ? <h5>ILVL: {monsterDetails.metaData.ilvl}</h5> :<h5>ILVL: 0</h5>}
                        
                        <h5 className="mt-4">Properties</h5>
                        <p><b>DNA: </b>{monsterDetails.genes}</p>
                        <hr />
                        <div className="mt-2">
                            <p><b>Element: </b>{renderElement()}</p>
                            <p><b>Family type: </b>{renderFamily()}</p>
                            <p><b>Look: </b>{renderLook()}</p>
                        </div>
                        <button type="button" onClick={buyMonsterHandler} className="btn btn-danger">Buy</button>
                    </div>
                </div>
            ) : <h5 className="text-center">Loading...</h5>}
        </div>
    )
}

export default NFTDetails
