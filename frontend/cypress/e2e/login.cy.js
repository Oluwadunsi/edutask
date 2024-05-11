
describe('Logging into the system', () => {
  // define variables that we need on multiple occasions
  let uid // user id
  let name // name of the user (firstName + ' ' + lastName)
  let email // email of the user


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
      })

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
    cy.get('.container-element').then(($num) => {
      if ($num.length < 0) { // create a new task for testing purpose if one doesn't exsist.
          cy.get('#title')
          .type('Hello world!')

          cy.get('#url')
          .type('U_gANjtv28g')

          cy.get('form')
          .submit()

        }
    })

    cy.get('.container-element > a') //get the a tag in div with classname container-element
    .first() //get the first task
    .click()

    cy.get('form')
    .find('input[type=text]')
    .should('have.prop', 'value')
    .should('be.empty')

    cy.get('form')
    .find('input[type=submit]')
    .should('be.disabled')

  })

  it('todo description not empty', () => {
    cy.get('.container-element').then(($num) => {
      if ($num.length < 0) { // create a new task for testing purpose if one doesn't exsist.
        cy.get('#title')
        .type('Hello world!')

        cy.get('#url')
        .type('U_gANjtv28g')

        cy.get('form')
        .submit()

      }
    })
    
    //get the classname for the div and trigger an onclick
    cy.get('.container-element > a') //get the a tag in div with classname container-element
      .first() //get the first task
      .click()

     cy.get('input[placeholder*="Add a new todo item"]') //gets the elemenet with the mentioned placeholder
       .type("Watch a video")  // adds a todo item 

    cy.get('input[placeholder*="Add a new todo item"]')
      .should('have.prop', 'value') // checks if value of the above placeholder
      .should('not.be.empty')

    cy.get('form')
      .find('input[type=submit]')
      .should('be.enabled')

  })

  it('todo-item done', () => {
    //get the classname for the div and trigger an onclick
    cy.get('.container-element > a') //get the a tag in div with classname container-element
    .first() //get the first task
    .click()

    cy.get('input[placeholder*="Add a new todo item"]') //gets the elemenet with the mentioned placeholder
    .type("Watch the video")  // adds a todo item 
    
    cy.get('form.inline-form') //get the form on the page with ".inline-form" classname
    .submit()

    cy.get('.todo-item .checker')
    .first()
    .should('have.class', 'unchecked') // todo-item should be unchecked before it can be set to done

    cy.get('.todo-item .checker')
    .first()
    .click() //click on the todo-item and set it to done

    cy.get('.todo-item .checker')
    .first()
    .should('have.class', 'checked')  //todo-item should now be set to done
    
    cy.get('.editable')
    .first()
    .invoke('css', 'text-decoration')
    .should('include', 'line-through')  // text should be stricken if checked as done
  })  

  it('todo-item not done', () => {
    //get the classname for the div and trigger an onclick
    cy.get('.container-element > a') //get the a tag in div with classname container-element
    .first() //get the first task
    .click()

    cy.get('.todo-item .checker')
    .first()
    .should('have.class', 'checked')  //todo-item should be set to checked(active)

    cy.get('.todo-item .checker')
    .first()
    .click() //click on the todo-item again and set it to active

    cy.get('.todo-item .checker')
    .first()
    .should('have.class', 'unchecked')  //todo-item should now be set to unchecked(active) after its clicked

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
    }) 

  })
})



