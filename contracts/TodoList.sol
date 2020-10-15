pragma solidity ^0.5.0;

contract TodoList{
    //this is a state variable, everytime task count will change state of block chain will change
    //as soon as we use keyword "public" solidity automatically creates a function which helps us access the variable from blockchain
    uint public taskCount = 0;
    struct Task {
        uint id;
        string content;
        bool completed;
    }
    constructor() public{
    createTask("This is the first Sample Task");
    }
    //public keyword gives a free reader function 
    mapping (uint => Task) public tasks;
    event TaskCreated(
        uint id,
        string content,
        bool completed
    );

    function createTask(string memory _content) public{
        taskCount ++;
        tasks[taskCount] = Task(taskCount,_content,false);
        //create an event 
        emit TaskCreated(taskCount,_content,false);
    }

}