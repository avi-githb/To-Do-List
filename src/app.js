App = {
    loading: false,
    contracts: {}, //this will store the contract
    load: async () => {
        
        //here we are adding the flow of how the page should render which components should load in which flow

        //calling the below implemented functions

        await App.loadWeb3() //we are loading the web3 library which connects to the blockchain

        await App.loadAccount() //this will load account detail which is used to connect to blockchain using metamask

        await App.loadContract()
        
         //calling render function
         await App.render()
        
    },
    //way to talk to blockchain using a way suggested by METAMASK
      // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
   
      //this below code is to connect to blockchain
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },
  //load account detail from web3
  loadAccount: async() => {
   App.account = web3.eth.accounts[0]
  },
 //loading smart contract
 loadContract: async()=>{
    //here we are loading the TodoList.JSON which were exposed to the lite server using bs-config.json file 
    const todoList = await $.getJSON('TodoList.json')
    
    //truffle contract which will be used to call functions from smart contract
    App.contracts.TodoList = TruffleContract(todoList) //we are passing the todoList variable that we pulled above which is then wrapped by truffle 

    App.contracts.TodoList.setProvider(App.web3Provider) // we are using the web3Provider to interact with the Smart Contract > web3Provider is defined above in loadweb3 function

  //Hydrate smart contract with values from blockchain
  App.todoList = await App.contracts.TodoList.deployed()
},
//render information on the webpage

  render: async()=>{
      //logic to prevent double rendering
        if(App.loading){
           return
        }
        App.setLoading(true)
      //Render Account
      $('#account').html(App.account)

      //**** Here we are calling the RENDER TASKS FUnction to list the taks....We are not calling Render task function at the top... */
      await App.renderTasks()
      //update loading state
      App.setLoading(false)
  },
  renderTasks: async()=>{
    //steps: 1. load total task from blockchain, 2. Render each task with a template and 3. Show task

    //load total task from blockchain
    const taskCount = await App.todoList.taskCount()
    const $taskTemplate = $('.taskTemplate')

    for(var i=1;i<=taskCount;i++){
      const task = await App.todoList.tasks(i)
      const taskId = task[0].toNumber()
      const taskContent = task[1]
      const taskCompleted = task[2]

      //create HTML for the task, pull taskTemplate from DOM and clone it
      const $newTaskTemplate = $taskTemplate.clone()

      //in the template we are passing taskContent 
      $newTaskTemplate.find('.content').html(taskContent)
      $newTaskTemplate.find('input').prop('name', taskId).prop('checked', taskCompleted)//.on('click',App.toggleCompleted)

      //put the task in the correct list completed or incompleted 
      if(taskCompleted){
        $('#completedTaskList'.append($newTaskTemplate))
      }
      else{
        $('#taskList').append($newTaskTemplate)
      }
      $newTaskTemplate.show()
    }

  },
  //creating a new task from frontend
  createTask: async()=>{

    //calling the set load function which will render loading 
    App.setLoading(true)
    //fetching the value passed at the frontend 
    const content = $('#newTask').val()

    //passing the value to the backend blockchain to create a task
    await App.todoList.createTask(content)

    //reload the page after the task is created 
    //this will reload the page to list all the task after adding tasks
    window.location.reload()
  },
  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }

}

$(() => {
    $(window).load(()=>{
        App.load()
    })
})