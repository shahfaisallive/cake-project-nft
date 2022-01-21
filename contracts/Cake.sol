// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

// import ERC721 interface
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// Cake smart contract inherits ERC721 Interface
contract Cake is Ownable, ERC721Enumerable {
    using SafeMath for uint256;
    using Strings for uint256;

    uint256 public cakeCounter;
    string private _baseURIextended = "";
    // string public baseExtension = ".json";
    string public notRevealedUri;
    bool public revealed = false;


    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;
    // check if token name exists
    mapping(string => bool) public tokenNameExists;
    // check if token URI exists
    mapping(string => bool) public tokenURIExists;

    // initialize contract while deployment with contract's collection name and token
    constructor() ERC721("Cake Project", "CAKE") {
        setNotRevealedURI("https://ipfs.infura.io/ipfs/QmNwN2Us6uFGoPYXnXjhwmmbPRwWyPqg1QV7tdSoGwHpi5");        
    }

    function setBaseURI(string memory baseURI_) external onlyOwner {
        _baseURIextended = baseURI_;
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI)
        internal
        virtual
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI set of nonexistent token"
        );
        _tokenURIs[tokenId] = _tokenURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIextended;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        if (revealed == false) {
            return notRevealedUri;
        } 

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }
        // If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
        return string(abi.encodePacked(base, tokenId.toString()));
    }


    //ONLY OWNER FUNCTIONS BELOW
    // reveal function
    function reveal(bool _state) public onlyOwner {
        revealed = _state;
    }

    // Set  not revealed URI
    function setNotRevealedURI(string memory _notRevealedURI) public {
        notRevealedUri = _notRevealedURI;
    }


    // Minting a new cake function
    function mintCake(
        string memory _tokenURI
    ) public payable
    {
        require(msg.sender != address(0));

        cakeCounter++;

        // Checking for requirements
        require(!_exists(cakeCounter));
        require(!tokenURIExists[_tokenURI]);
        require(!_exists(cakeCounter));

        // Mint the token here
        _safeMint(msg.sender, cakeCounter);

        // set token URI (bind token id with the passed in token URI)
        _setTokenURI(cakeCounter, _tokenURI);
        // make passed token URI as exists
        tokenURIExists[_tokenURI] = true;
    }

    // Get owner of the token
    function getTokenOwner(uint256 _tokenId) public view returns (address) {
        address _tokenOwner = ownerOf(_tokenId);
        return _tokenOwner;
    }

    // Get Metadata of the token
    function getTokenMetaData(uint256 _tokenId)
        public
        view
        returns (string memory)
    {
        string memory tokenMetaData = tokenURI(_tokenId);
        return tokenMetaData;
    }

    // Get total number of tokens minted
    function getNumberOfTokensMinted() public view returns (uint256) {
        uint256 totalNumberOfTokensMinted = totalSupply();
        return totalNumberOfTokensMinted;
    }

    // get total number of tokens owned by an address
    function getTotalNumberOfTokensOwnedByAnAddress(address _owner)
        public
        view
        returns (uint256)
    {
        uint256 totalNumberOfTokensOwned = balanceOf(_owner);
        return totalNumberOfTokensOwned;
    }

}