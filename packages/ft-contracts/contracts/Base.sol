pragma solidity ^0.4.11;

contract Base {
    uint public storedData;

    function Base() public  {
        storedData = 7;
    }

    function getStoredData() constant public returns (uint) {
        return storedData;
    }

    function setStoredData(uint newVal) public {
        storedData = newVal;
    }
}