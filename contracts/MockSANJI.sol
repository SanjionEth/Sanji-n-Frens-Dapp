// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockSANJI is ERC20, Ownable {
    constructor() ERC20("Sanji Token", "SANJI") Ownable(msg.sender) {
        _mint(msg.sender, 0); // start with zero balance
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
