import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const Gallery = ({ monsters }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (monsters.length !== 0) {
            if (monsters[0].metaData !== undefined) {
                setLoading(loading);
            } else {
                setLoading(false);
            }
        }
        console.log(monsters)
    }, [monsters, loading]);


    return (
        <div className='container'>
            <div className='row d-flex justify-content-center'>
                <h1 className="display-2">NFT Gallery</h1>
            </div>
        
            <hr />
            <div className="row mb-5">
                {monsters.map(monster => (
                    <div className="card col-md-4 mt-2 " style={{ width: '300px' }} key={monster.tokenId}>
                        {monster.metaData ? <img className="card-img-top" alt='monster' src={monster.metaData.monsterImage} width={300} height={400} /> : null}
                        <div className="card-body">
                            {/* <h5 className="card-title text-center">{monster.tokenName}</h5> */}
                            <p className="card-text"><b>ID#{monster.tokenId}</b></p>
                            <div className="">
                                <h6>1st Parent: {monster.parent1}</h6>
                                <h6>2nd Parent: {monster.parent2}</h6>
                            </div>
                            {/* <p><b>Price</b>: {Web3.utils.fromWei(monster.price, 'ether')} Ether</p> */}
                            <p><b>DNA</b>: {monster.genes}</p>
                            <p><b>Minted By</b>: {monster.mintedBy}</p>
                            <Link to={`/monsterdetails/${monster.tokenId}`}>
                                <button className="btn btn-secondary">View Details</button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Gallery
