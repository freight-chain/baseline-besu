pragma solidity ^0.4.11;

import "./Base.sol";

contract Main {
    uint public storedData;
    address public derived_address;
    Base base;

    function Main(uint initVal, address _derivedAddress) public {
        storedData = initVal;
        base = Base(_derivedAddress);
    }

    function setDerivedData(uint newVal) public {
        base.setStoredData(newVal);
    }

    function getDerivedData() constant public returns (uint) {
        return base.getStoredData();
    }

}
