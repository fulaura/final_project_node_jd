pragma solidity ^0.8.0;

contract Auth {
    mapping(address => bool) public registeredUsers;

    function register() public {
        registeredUsers[msg.sender] = true;
    }

    function isRegistered(address user) public view returns (bool) {
        return registeredUsers[user];
    }
}