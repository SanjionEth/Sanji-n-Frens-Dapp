// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BaseDeckNFT is ERC721, Ownable {
    mapping(uint256 => string) public cardTypes;
    mapping(address => mapping(string => bool)) public hasMintedType;
    mapping(address => mapping(string => uint256)) public lastMintTime;

    address public sanjiToken;
    address public usdcToken;
    address public usdtToken;
    address public payoutWallet;

    uint256 public totalSupplyLimit = 10000;
    uint256 public currentTokenId;

    string private baseURI = "ipfs://bafybeier6d477wnmm5cuxv3byhy7x65oefptj5jf4qttfms6vntkbfibby/";

    constructor(
        address _sanji,
        address _usdc,
        address _usdt,
        address _payout
    ) ERC721("Sanji 'n Frens Base Deck", "SANJIDECK") Ownable(msg.sender) {
        sanjiToken = _sanji;
        usdcToken = _usdc;
        usdtToken = _usdt;
        payoutWallet = _payout;
    }

    function _isMinted(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_isMinted(tokenId), "Token does not exist");
        return string(abi.encodePacked(baseURI, "0_base_deck.json"));
    }

    function mintBaseDeck(address recipient) external onlyOwner {
        require(currentTokenId < totalSupplyLimit, "Max supply reached");
        currentTokenId += 1;
        _safeMint(recipient, currentTokenId);
        cardTypes[currentTokenId] = "Base Deck";
        hasMintedType[recipient]["Base Deck"] = true;
        lastMintTime[recipient]["Base Deck"] = block.timestamp;
    }
}
