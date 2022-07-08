import React, { useState } from 'react'
import './Minting.css'

const Minting = ({ metamaskConnected, connectToMetamask, accountAddress, mintNFT, contractDetected, mintLoader }) => {
    const [amount, setAmount] = useState(0)
    const [maxAmount, setMaxAmount] = useState(3)

    const mintHandler = () => {
        if (contractDetected && amount !== 0) {
            mintNFT(amount)
        } else {
            console.log("contract not found, please wait or reload or maybe enter a valid number amount")
        }
    }

    return (
        <div className='mint-wrapper container-fluid'>
            <div className='container'>
                <div className="row">
                    <div className='col-md-6 pt-5'>
                        <div className='mint-box'>
                            {/* {metamaskConnected ? <div>
                                <p className='mint-title text-center'>MINT YOUR MONKEY</p>
                                <p className='mint-text1 text-center'><b>You Address </b>{accountAddress}</p>
                                <p className='mint-text2 text-center mt-1'> 0.0 Eth + Gas</p>
                                <div className='row d-flex justify-content-between mt-4'>
                                    <button className='counter-btn' onClick={() => { amount > 0 ? setAmount(amount - 1) : console.log("No negative value") }}>-</button>
                                    <button className='mint-btn' onClick={mintHandler}>Mint</button>
                                    <button className='counter-btn' onClick={() => { amount < maxAmount && amount >= 0 ? setAmount(amount + 1) : console.log('Dont be greedy man, limit reached') }}>+</button>
                                </div>
                                <p className='text-light text-center mt-2'><b>Total Mints: {amount}</b></p>
                                <p className='mint-text3 text-center mt-3'><b>Note:</b> Max 3 Mints per wallet</p>
                            </div> : <div>
                                <p className='mint-text4 text-center mt-5'>You are not connected to Metamask</p>
                                <div className='row'>
                                    <button className='mint-connect-btn mt-4 mb-5' onClick={connectToMetamask}>
                                        Connect to Metamask
                                    </button>
                                </div>
                            </div>} */}
                            <p className='mint-title-sold text-center'>SOLD OUT</p>
                            {/* <p className='mint-text-sold text-center'>Thanks for your contribution to the community</p> */}
                            <a className='opensea-link' href="https://opensea.io/collection/cakex" target={'_blank'}><p className='text-center mt-2'>Get yours on Opensea</p></a>
                        </div>
                    </div>

                    <div className='col-md-6 mt-3'>
                        <div className='mint-right-box'>
                            <img src='/images/cake-mint.png' className='mint-img' alt='mint-gif' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Minting