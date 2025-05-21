// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SpecialCardNFT is ERC721, Ownable {
    address public immutable sanjiToken;
    address public immutable payoutWallet;
    address public immutable baseDeckAddress;

    uint256 public immutable mintThreshold;
    uint256 public immutable maxSupply;

    uint256 public currentSupply;

    string private baseURI;

    mapping(address => bool) public hasMinted;
    mapping(address => uint256) public lastMintTime;

    constructor(
        address _sanjiToken,
        address _payoutWallet,
        string memory _baseURI,
        uint256 _mintThreshold,
        uint256 _maxSupply,
        address _baseDeckAddress
    ) ERC721("Sanji 'n Frens Special Card", "SANJISPECIAL") Ownable(msg.sender) {
        sanjiToken = _sanjiToken;
        payoutWallet = _payoutWallet;
        baseURI = _baseURI;
        mintThreshold = _mintThreshold;
        maxSupply = _maxSupply;
        baseDeckAddress = _baseDeckAddress;
    }

    /// @notice Owner-only mint after SANJI eligibility check
    function mintSpecialCard(address recipient) external onlyOwner {
        require(currentSupply < maxSupply, "Max supply reached");
        require(!hasMinted[recipient], "Already minted");

        // ✅ OPTIONAL: Enforce SANJI eligibility on-chain
        uint256 balance = IERC20(sanjiToken).balanceOf(recipient);
        require(balance >= mintThreshold, "Insufficient SANJI to mint");

        currentSupply += 1;
        _safeMint(recipient, currentSupply);

        hasMinted[recipient] = true;
        lastMintTime[recipient] = block.timestamp;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return baseURI;
    }
}
