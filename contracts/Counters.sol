// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library Counters {
    struct Counter{
        uint _value;
    }

    function current(Counter storage counter) external view returns(uint){
        return counter._value;
    }

    function increment(Counter storage counter) external{
        unchecked{counter._value++;}
    }

    function decrement(Counter storage counter) external{
        unchecked{counter._value--;}
    }

}