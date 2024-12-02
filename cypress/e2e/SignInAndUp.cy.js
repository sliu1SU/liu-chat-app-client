describe('Test SignInAndUp.jsx', () => {
  let createdUserId = null;
  // create a mock user first
  let mockAcc = null;
  const loginTestEmail = "cypress@gmail.com";
  const loginTestPassword = "12345678";

  before(() => {
    cy.task('createTestUser', {email: loginTestEmail, password: loginTestPassword}).then((uid) => {
      cy.log('Test user created successfully');
      mockAcc = uid;
    });

    // cy.task('getUid', signinEmail).then((uid) => {
    //   mockAcc = uid;
    //   console.log('mockAcc:', mockAcc); // This will correctly log the UID
    // });
  });

  it('navigate to sign-in and sign-up page', () => {
    cy.visit('http://localhost:5173/');
  });

  it('page should display log-in and sign-up button ', () => {
    cy.visit('http://localhost:5173/');
    cy.get('#submit-login-bt').should('be.visible').and('have.text', 'Log In');
    cy.get('#submit-signup-bt').should('be.visible').and('have.text', 'Sign Up');
  });

  it('page should display email textbox and password textbox', () => {
    cy.visit('http://localhost:5173/');
    cy.get('#email-input').should('exist').and('have.attr', 'placeholder', 'Enter email here...');
    cy.get('#password-input').should('exist').and('have.attr', 'placeholder', 'Enter password here...');
  });

  it('user should log in with the right email/password combo', () => {
    if (mockAcc) {
      cy.visit('http://localhost:5173/');
      cy.get('#email-input').type(loginTestEmail);
      cy.get('#password-input').type(loginTestPassword);
      cy.get('#submit-login-bt').click();
      cy.url().should('eq', 'http://localhost:5173/rooms');
      cy.contains(loginTestEmail);
    }
  });

  it('user should sign up a new account', () => {
    let email = 'tobedeleted@gmail.com';
    let pass = '12345678';
    cy.visit('http://localhost:5173/');
    // do some logic to sign up a new account, but can only do it once
    cy.get('#email-input').type(email);
    cy.get('#password-input').type(pass);
    cy.get('#submit-signup-bt').click();
    // we should be in a new page at this point, find the uid and log off
    // Save the user ID (simulate obtaining it)
    cy.url().should('include', '/rooms');
    cy.task('getUid', email).then((uid) => {
      createdUserId = uid;
      console.log('createdUserId:', createdUserId); // This will correctly log the UID
    });
    cy.get('#submit-logoff-bt').click();
  });

  after(() => {
    // Use Firebase Admin SDK to delete the user
    if (createdUserId) {
      cy.task('deleteFirebaseUser', createdUserId).then(() => {
        cy.log('Test user deleted successfully');
      });
    }

    if (mockAcc) {
      cy.task('deleteFirebaseUser', mockAcc).then(() => {
        cy.log('Test user deleted successfully');
      });
    }
  });
});