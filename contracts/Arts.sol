// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// import ERC721 interface
import "./ERC721.sol";

// Arts smart contract inherits ERC721 Interface
contract Arts is ERC721 {
    // string public collectionName;
    // string public collectionSymbol;
    uint256 public artCounter;

    // Defining Art struct
    struct Art {
        uint256 tokenId;
        string tokenName;
        string tokenURI;
        address payable mintedBy;
        address payable currentOwner;
        address payable previousOwner;
        uint256 price;
        bool forSale;
    }

    // map arts's token id to artwork
    mapping(uint256 => Art) public allArts;
    // check if token name exists
    mapping(string => bool) public tokenNameExists;
    // check if token URI exists
    mapping(string => bool) public tokenURIExists;

    // initialize contract while deployment with contract's collection name and token
    constructor() ERC721("Art Work NFT", "ART") {
        // collectionName = name();
        // collectionSymbol = symbol();
    }

    // Minting a new art function
    function mintArt(
        string memory _name,
        string memory _tokenURI,
        uint256 _price
    ) public payable {
        require(msg.sender != address(0));

        artCounter++;

        // Checking for requirements
        require(!_exists(artCounter));
        require(!tokenURIExists[_tokenURI]);
        require(!tokenNameExists[_name]);
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
            _name,
            _tokenURI,
            payable(msg.sender),
            payable(msg.sender),
            payable(address(0)),
            _price,
            true
        );
        allArts[artCounter] = newArt;
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

    // check if the token already exists
    function getTokenExists(uint256 _tokenId) public view returns (bool) {
        bool tokenExists = _exists(_tokenId);
        return tokenExists;
    }

    // Buy Art
    function buyArt(uint256 _tokenId) external payable {
        require(
            msg.value >= 50000000000000000,
            "Not enough ETH sent; check price!"
        );
        transferFrom(ownerOf(_tokenId), msg.sender, _tokenId);
    }
}
