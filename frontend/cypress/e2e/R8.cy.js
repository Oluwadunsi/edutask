describe('Logging into the system', () => {
    // define variables that we need on multiple occasions
    let uid // user id
    let name // name of the user (firstName + ' ' + lastName)
    let email // email of the user
    let title = 'Last last added video'
    let url = 'Sxxw3qtb3_g'
  
    let task_id
    let todo_id  // todo id 
  
  
  
    before(function () {
      // create a fabricated user from a fixture
      cy.fixture('user.json')
        .then((user) => {
          cy.request({
            method: 'POST',
            url: 'http://localhost:5000/users/create',
            form: true,
            body: user
          }).then((response) => {
            uid = response.body._id.$oid
            name = user.firstName + ' ' + user.lastName
            email = user.email
          })
        });
  
  
    })
  
  
    beforeEach(function () {
      // enter the main main page
      cy.visit('http://localhost:3000')
  
      cy.get('.inputwrapper #email')
      .type(email)
  
      cy.get('form')
        .submit()
  
      
        
    })
  
    it('starting out on the landing screen', () => {
      // make sure the landing page contains a header with "login"
      cy.get('h1')
        .should('contain.text', 'Login')
    })
  
    it('login to the system with an existing account', () => {
  
      // detect a div which contains "Email Address", find the input and type (in a declarative way)
      cy.contains('div', 'Email Address')
        .find('input[type=text]')
        .type(email)
      // alternative, imperative way of detecting that input field
      //cy.get('.inputwrapper #email')
      //    .type(email)
  
      // submit the form on this page
      cy.get('form')
        .submit()
  
      // assert that the user is now logged in
      cy.get('h1')
        .should('contain.text', 'Your tasks, ' + name)
    })
  
    it('todo description empty', () => {
  
      cy.intercept('http://localhost:5000/tasks/create', res => res.json).as('tasks')
  
      // create a task with details in json file
      // a task should have been created from the former test so I might delete this one
      cy.fixture('task.json').then((task) => {
  
        cy.get('#title')
        .type(task.title, { delay: 100 }).should('have.value', task.title)
    
        cy.get('#url')
        .type(task.url)
  
        cy.get('form')
        .find('input[type=submit]')
        .click() 
        }) 
  
      cy.get('.container-element > a') //get the a tag in div with classname container-element
      .first() //get the first task
      .click()
  
  
      cy.get('input[placeholder="Add a new todo item"')
      .clear()  //clear input field to ascertain todo description emptiness
  
      cy.get('form')
      .find('input[type=submit]')
      .should('be.disabled')  //button is expected to be disabled cause description input field is empty
    })
  
    it('todo description not empty', () => {
  
      cy.get('.container-element > a') //get the a tag in div with classname container-element
      .first() //get the first task
      .click()
  
  
      cy.get('input[placeholder="Add a new todo item"')
      .clear()  //ensure that todo description emptiness before moving on with the test
  
  
     cy.get('input[placeholder*="Add a new todo item"]') //gets the elemenet with the mentioned placeholder
       .type("Watch a video")  // name of a todo item
  
    cy.get('input[placeholder*="Add a new todo item"]')
      .should('have.prop', 'value') // checks if value of the above placeholder
      .should('not.be.empty')
  
    cy.get('form')
      .find('input[type=submit]')
      .should('be.enabled')
  })
  
  it('todo-item done', () => {
  
        cy.intercept('http://localhost:5000/tasks/create', res => res.json).as('tasks')
  
        // create a task with details in json file
        cy.fixture('task.json').then((task) => {
    
          cy.get('#title')
          .type(task.title, { delay: 100 }).should('have.value', task.title)
      
          cy.get('#url')
          .type(task.url)
    
          cy.get('form')
          .find('input[type=submit]')
          .click() 
          }) 
    
        cy.get('.container-element > a') //get the a tag in div with classname container-element
        .first() //get the first task
        .click()
  
    
        cy.get('@tasks')
        .its('response')
        .then((response) => {
          todo_id = response.body[0].todos[0]._id.$oid;
          task_id = response.body[0]._id.$oid;
          
          response.body[0].todos[0].done = true   // this makes sure the todo item is set to done
          expect(response.body[0].todos[0].done).to.equal(true) // this ascertains that the todo item is actually done. It compares the value returned to the expected value to be returned
          })
    })  
  
    it('todo-item not done', () => {
      cy.intercept('http://localhost:5000/tasks/create', res => res.json).as('tasks')
  
      // create a task with details in json file
      cy.fixture('task.json').then((task) => {
  
        cy.get('#title')
        .type(task.title, { delay: 100 }).should('have.value', task.title)
    
        cy.get('#url')
        .type(task.url)
  
        cy.get('form')
        .find('input[type=submit]')
        .click() 
        }) 
  
      cy.get('.container-element > a') //get the a tag in div with classname container-element
      .first() //get the first task
      .click()
  
  
      cy.get('@tasks')
      .its('response')
      .then((response) => {
        todo_id = response.body[0].todos[0]._id.$oid;
        task_id = response.body[0]._id.$oid;
        
        response.body[0].todos[0].done = false   // this makes sure the todo item is set to not done
        expect(response.body[0].todos[0].done).to.equal(false) // this ascertains that the todo item is actually set to not done. It compares the value returned to the expected value to be returned
  
        })
    }) 
    
  
    it('delete todo-item', () => {
      //get the classname for the div and trigger an onclick
      cy.get('.container-element > a') //get the a tag in div with classname container-element
      .first() //get the first task
      .click()
  
  
      cy.get('.todo-item .remover') // get the element on page with the classname and click on it
      .first()
      .click()
    })
  
   
    after(function () {
  
      // clean up by deleting the user from the database
      cy.request({
        method: 'DELETE',
        url: `http://localhost:5000/users/${uid}`
      }).then((response) => {
        cy.log(response.body)
      });
  
      cy.request({
        method: 'DELETE',
        url: `http://localhost:5000/tasks/byid/${task_id}`
      }).then((response) => {
        cy.log(response.body)
      }); 
  
      cy.request({
        method: 'DELETE',
        url: `http://localhost:5000/todos/byid/${todo_id}`
      }).then((response) => {
        cy.log(response.body)
      }); 
  
    })
    
  })