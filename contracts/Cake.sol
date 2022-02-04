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
    string public baseExtension = ".json";
    string public notRevealedUri;
    bool public revealed = false;
    uint256 public maxSupply = 100;
    bool public paused = false;
    uint256 public cost = 0.02 ether;

    // whitelisted addresses
    mapping(address => bool) public whitelisted;

    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;
    // check if token name exists
    mapping(string => bool) public tokenNameExists;
    // check if token URI exists
    mapping(string => bool) public tokenURIExists;

    // initialize contract while deployment with contract's collection name and token
     constructor(
    // string memory _initBaseURI,
    // string memory _initNotRevealedUri
    ) ERC721('CAKE TOKEN', 'CKT') {
    // setBaseURI(_initBaseURI);
    // setNotRevealedURI(_initNotRevealedUri);
    whitelisted[0xba9D5f1D5390FA3E5fFC65F9C7332ffC40464D23] = true;
    whitelisted[0x4009247cD0D3d893FFc9546953ac77981022b0B0] = true;
    whitelisted[0x31cd872b26a7ae352e2F22C6180E03b34D81cf73] = true;
    whitelisted[0xb221C202cF15E088B5DF9C60e7C919A193830806] = true;
    whitelisted[0xb62bd6ad9774392A0714BA8Cb047d6E113eC5B9E] = true;
    whitelisted[0x5028693249155F45bDeD0232Abb9b7D59FB7F896] = true;
    whitelisted[0x448BB0d5E556Ee57dDDb627185Cb0DF045829c32] = true;
    whitelisted[0xD0548f1003009c1E081C24a1e7aa06c6d89c9C20] = true;
    whitelisted[0x4e8b414C61b366370a5ffB720d82A8bA8b08c65B] = true;

    }

    // Minting a new cake function
    function mintCake(
        string memory _tokenURI
    ) public payable
    {
        uint256 supply = totalSupply();
        require(!paused);
        require(msg.sender != address(0));

        // Checking for requirements
        require(!tokenURIExists[_tokenURI]);

        if(whitelisted[msg.sender] == true) {
          require(msg.value == 0);
        } else {
          require(msg.value >= cost);    
        }

        uint256 _tokenId = supply + 1; 
        // Mint the token here
        _safeMint(msg.sender, _tokenId);

        // set token URI (bind token id with the passed in token URI)
        _setTokenURI(_tokenId, _tokenURI);
        // make passed token URI as exists
        tokenURIExists[_tokenURI] = true;
    }


    function setBaseURI(string memory baseURI_) public onlyOwner {
        _baseURIextended = baseURI_;
    }

    //Set TokenURI 
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

    // Get TOKEN URI
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
    
    if(revealed == false) {
        return notRevealedUri;
    }

    string memory currentBaseURI = _baseURI();
    return bytes(currentBaseURI).length > 0
        ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
        : "";
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

    // Set price function function setCost(uint256 _newCost) public onlyOwner {
    function setCost(uint256 _newCost) public onlyOwner {
    cost = _newCost;
    }

    // Pause smart contract
    function pause(bool _state) public onlyOwner {
    paused = _state;
    }

    // Add and remove whitelist users
    function addWhitelistUser(address _user) public onlyOwner {
    whitelisted[_user] = true;
    }
 
    function removeWhitelistUser(address _user) public onlyOwner {
    whitelisted[_user] = false;
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