pragma solidity ^0.5.0;

contract TodoList{
    //this is a state variable, everytime task count will change state of block chain will change
    //as soon as we use keyword "public" solidity automatically creates a function which helps us access the variable from blockchain
    uint public taskCount = 0;

}