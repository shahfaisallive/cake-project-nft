// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Cake is ERC721Enumerable, Ownable {
    using Strings for uint256;
    using SafeMath for uint256;

    string public baseURI;

    // Sale dates ===============================
    
    uint256 public publicSaleStartTimestamp = 1656169200; // June 25th 2022, 10:00 am Central Daylight Time (CDT)

    // Count values =============================
    uint256 public MAX_ITEMS = 5000;
    uint256 public RESERVED = 555;
    uint256 public _mintedItems = 0;
    uint256 public maxMintAmount = 3; // Max items per tx

    bool public paused = false;
    string public notRevealedUri;
    bool public revealed = false;

    // Lists ====================================
    mapping(address => uint256) public buyerWallet;

    // Events ===================================
    event PublicSaleMint(address indexed _from, uint256 indexed _tokenId);

    constructor() ERC721("Cake Project Experiment", "CPE") {
        setNotRevealedURI(
            "https://gateway.pinata.cloud/ipfs/QmWuYUPfxr2pi788S3vbtYKYti9YE5AgzYHBgndb5W4FMx"
        );
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }


    // Public sale Minting =================================
    function publicSaleMint(uint256 _mintAmount) public payable {
        require(!paused, "Contract is paused");
        require(
            block.timestamp >= publicSaleStartTimestamp,
            "Public sale time is not active yet"
        );
        require(
            _mintedItems.add(_mintAmount) <= MAX_ITEMS,
            "Purchase would exceed max supply"
        );
        require(
            _mintAmount <= maxMintAmount,
            "Maximum only 3 mints allow per transaction"
        );
        require(buyerWallet[msg.sender] <= 3, "Max 3 items per wallet");

        if (msg.sender != owner()) {
            for (uint256 i = 0; i < _mintAmount; i++) {
                uint256 mintIndex = _mintedItems + 1;
                require(_mintedItems < MAX_ITEMS, "All items sold!");
                _safeMint(msg.sender, mintIndex);
                emit PublicSaleMint(msg.sender, mintIndex);
                _mintedItems++;
            }
            updateBuyerWallet(msg.sender, buyerWallet[msg.sender] + _mintAmount);
        }
    }

    // Admin Minting (Mint by owner) =========================
    function ownerMint(uint256 _mintAmount) public payable onlyOwner {
        require(!paused, "Contract is paused");
        require(
            _mintedItems.add(_mintAmount) <= MAX_ITEMS+RESERVED,
            "Purchase would exceed max supply"
        );

        for (uint256 i = 0; i < _mintAmount; i++) {
            uint256 mintIndex = _mintedItems + 1;
            require(_mintedItems < MAX_ITEMS+RESERVED, "All items sold!");
            _safeMint(msg.sender, mintIndex);
            _mintedItems++;
        }
    }

    // Get MetaData TokenURI =======================
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

        if (revealed == false) {
            return notRevealedUri;
        }

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        ".json"
                    )
                )
                : "";
    }

    // Reveal Metadata of Tokens =======================
    function reveal(bool _state) public onlyOwner {
        revealed = _state;
    }

    // Set Placeholder metadata URI =======================
    function setNotRevealedURI(string memory _notRevealedURI) public {
        notRevealedUri = _notRevealedURI;
    }

    // Set public timestamp (input: timestamp in UTC) =======================
    function setPublicSaleStartTimestamp(uint256 _startTimestamp)
        external
        onlyOwner
    {
        publicSaleStartTimestamp = _startTimestamp;
    }

    // Set base URI of metadata (an IPFS URL) =======================
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    // Pause the contract which will stop minting process =======================
    function pause(bool _state) public onlyOwner {
        paused = _state;
    }

    // Add a presale user =======================
    function updateBuyerWallet(address _user, uint256 _amount) internal {
        buyerWallet[_user] = _amount;
    }

    // Get number of tokens minted by a particular address =======================
    function getMintedCountOfUserWallet(address _user)
        public
        view
        virtual
        returns (uint256)
    {
        return buyerWallet[_user];
    }

    // Withdraw the balance from samrt contract =======================
    function withdraw() external onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Failed to withdraw");
    }
}
