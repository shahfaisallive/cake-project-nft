import React from 'react'
import { NavLink } from 'react-bootstrap'
import './Navbar.css'


const Navbar = ({ metamaskConnected, connectToMetamask, accountBalance, accountAddress, isOwner }) => {
  
    return (
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
            <div className='container-fluid ml-5 mr-5'>
                <NavLink className="navbar-brand" id="brand-title" to="/"><img alt="logo" src="https://nftimes.org/wp-content/uploads/2022/02/New-Project-64.png" ></img></NavLink>
                <button className="navbar-toggler toggle-btn" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon "></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav">

                        {!metamaskConnected ?
                            <li className="nav-item">
                                <button className='connect-btn' onClick={connectToMetamask}>Connect</button>
                            </li> :
                                <li className="nav-item">
                                    <p className='address-tab'>{`${accountAddress.slice(0, 5)}... (Bal:${accountBalance.slice(0,5)})`}</p>
                                </li>
                        }
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
