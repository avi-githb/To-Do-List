const { assert } = require("chai")

//first step to get the contract 
const ToDoList = artifacts.require('./TodoList.sol')

//this call back function will expose all the accounts in blockchain
//all the 10 accounts which are listed in Ganache 
contract('TodoList',(accounts)=> {
//first we will get a copy of deployed smart contract before we run any functions 
before(async() =>{
    this.todoList = await ToDoList.deployed()
})
it('Deploys Successfully', async()=>{
    //making sure that the address is not 0,null.empty or undefined
    const address = await this.todoList.address
    assert.notEqual(address,0x0)
    assert.notEqual(address,'')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
})

it('Lists Taks',async()=>{
    const taskCount = 1
    const task = await this.todoList.tasks(taskCount)
    assert.equal(task.id.toNumber(),taskCount)
})
})