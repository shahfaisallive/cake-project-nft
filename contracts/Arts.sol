// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

// import ERC721 interface
// import "./ERC721.sol";
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


// Arts smart contract inherits ERC721 Interface
contract Arts is Ownable, ERC721Enumerable {
    using SafeMath for uint256;
    using Strings for uint256;


    // string public collectionName;
    // string public collectionSymbol;
    uint256 public artCounter;
    string private _baseURIextended = "";
    // string public baseURI;
    // string public baseExtension = ".json";
    string public notRevealedUri;
    bool public revealed = false;

    // Defining Art struct
    struct Art {
        uint256 tokenId;
        // string tokenName;
        string tokenURI;
        string unrevealedTokenURI;
        address mintedBy;
        address currentOwner;
        address previousOwner;
        // uint256 price;
        // bool forSale;
    }

    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    // map arts's token id to artwork
    mapping(uint256 => Art) public allArts;
    // check if token name exists
    mapping(string => bool) public tokenNameExists;
    // check if token URI exists
    mapping(string => bool) public tokenURIExists;

    // initialize contract while deployment with contract's collection name and token
    constructor() ERC721("Beautiful Art", "ART") {
        // collectionName = name();
        // collectionSymbol = symbol();
        setNotRevealedURI("https://ipfs.infura.io/ipfs/QmNwN2Us6uFGoPYXnXjhwmmbPRwWyPqg1QV7tdSoGwHpi5");        
    }

    // internal

    function setBaseURI(string memory baseURI_) external {
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
        } else {
            return _tokenURI;
        }

        // If there is no base URI, return the token URI.
        // if (bytes(base).length == 0) {
        //     return _tokenURI;
        // }
        
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        // if (bytes(_tokenURI).length > 0) {
        //     return string(abi.encodePacked(base, _tokenURI));
        // }
        // If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
        // return string(abi.encodePacked(base, tokenId.toString()));
    }


    //ONLY OWNER FUNCTIONS BELOW
    // reveal function
    function reveal(bool _state) public {
        revealed = _state;
        // for(uint i=1; i<artCounter+1; i++){
        //     // delete allArts[i].tokenURI;
        //     allArts[i].tokenURI = allArts[i].unrevealedTokenURI;
        //     _setTokenURI(i, allArts[i].unrevealedTokenURI);
        // }
    }

    // Set  not revealed URI
    function setNotRevealedURI(string memory _notRevealedURI) public {
        notRevealedUri = _notRevealedURI;
    }


    // Minting a new art function
    function mintArt(
        // string memory _name,
        string memory _tokenURI
    ) public payable // uint256 _price
    {
        require(msg.sender != address(0));

        artCounter++;

        // Checking for requirements
        require(!_exists(artCounter));
        require(!tokenURIExists[_tokenURI]);
        // require(!tokenNameExists[_name]);
        require(!_exists(artCounter));

        // Mint the token here
        _safeMint(msg.sender, artCounter);

        // set token URI (bind token id with the passed in token URI)
        _setTokenURI(artCounter, _tokenURI);
        // make passed token URI as exists
        tokenURIExists[_tokenURI] = true;
        // make token name passed as exists
        // tokenNameExists[_name] = true;

        // Create a new art and pass new values
        Art memory newArt = Art(
            artCounter,
            // _name,
            _tokenURI,
            notRevealedUri,
            payable(msg.sender),
            payable(msg.sender),
            payable(address(0))
            // _price,
            // true
        );
        allArts[artCounter] = newArt;
    }


    // function setBaseURI(string memory _newBaseURI) public onlyOwner {
    //     baseURI = _newBaseURI;
    // }

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

    // check if the token already exists
    function getTokenExists(uint256 _tokenId) public view returns (bool) {
        bool tokenExists = _exists(_tokenId);
        return tokenExists;
    }

    // Buy Art
    // function buyArt(uint256 _tokenId) external payable {
    //     require(
    //         msg.value >= 50000000000000000,
    //         "Not enough ETH sent; check price!"
    //     );
    //     transferFrom(ownerOf(_tokenId), msg.sender, _tokenId);
    // }
}
