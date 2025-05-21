// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockSANJI is ERC20, Ownable {
    constructor() ERC20("Sanji Token", "SANJI") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000_000 * 10**18);
    }
}

contract MockUSDC is ERC20, Ownable {
    constructor() ERC20("Mock USDC", "USDC") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 * 10**6);
    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
}

contract MockUSDT is ERC20, Ownable {
    constructor() ERC20("Mock USDT", "USDT") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 * 10**6);
    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
}
