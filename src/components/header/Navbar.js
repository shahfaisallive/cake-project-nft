import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = ({ connectToMetamask, metamaskConnected, accountAddress }) => {
    // const adminAddress = "0x8eE11A47cFf313f1F1A64B77b395020Cea30BDe7"

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <Link to="/" className="navbar-brand" href="#">Brand Logo</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <Link className="nav-item nav-link" to="/">Home</Link>
                        {/* <Link className="nav-item nav-link" to="/gallery">Gallery</Link> */}
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar