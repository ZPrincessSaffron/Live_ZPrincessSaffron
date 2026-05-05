describe('Authentication E2E Tests', () => {
    const uniqueEmail = `test_${Date.now()}@example.com`;
    const password = 'password123';
    const name = 'Cypress User';

    beforeEach(() => {
        cy.visit('/auth');
    });

    describe('Registration Flow', () => {
        it('should successfully register a new user', () => {
            // Switch to Register mode
            cy.get('[data-testid="auth-toggle-button"]').click();
            cy.contains('Customer Register').should('be.visible');

            // Fill form
            cy.get('[data-testid="name-input"]').type(name);
            cy.get('[data-testid="email-input"]').type(uniqueEmail);
            cy.get('[data-testid="password-input"]').type(password);

            // Submit
            cy.get('[data-testid="auth-submit-button"]').click();

            // Verify success toast/redirect
            cy.contains('Account created!').should('be.visible');
            cy.url().should('eq', Cypress.config().baseUrl + '/');
        });

        it('should show error for existing email', () => {
            cy.get('[data-testid="auth-toggle-button"]').click();
            
            // Using an email that likely exists or was just created
            cy.get('[data-testid="name-input"]').type(name);
            cy.get('[data-testid="email-input"]').type(uniqueEmail);
            cy.get('[data-testid="password-input"]').type(password);

            cy.get('[data-testid="auth-submit-button"]').click();

            cy.contains('User already exists').should('be.visible');
        });
    });

    describe('Login Flow', () => {
        it('should successfully login with valid credentials', () => {
            cy.contains('Customer Login').should('be.visible');

            cy.get('[data-testid="email-input"]').type(uniqueEmail);
            cy.get('[data-testid="password-input"]').type(password);

            cy.get('[data-testid="auth-submit-button"]').click();

            cy.contains('Welcome back!').should('be.visible');
            cy.url().should('eq', Cypress.config().baseUrl + '/');
        });

        it('should show error for invalid credentials', () => {
            cy.get('[data-testid="email-input"]').type(uniqueEmail);
            cy.get('[data-testid="password-input"]').type('wrongpassword');

            cy.get('[data-testid="auth-submit-button"]').click();

            cy.contains('Invalid email or password').should('be.visible');
        });

        it('should validate short password on frontend', () => {
            cy.get('[data-testid="password-input"]').type('123');
            cy.get('[data-testid="auth-submit-button"]').click();
            
            // Zod error message
            cy.contains('at least 6 characters').should('be.visible');
        });
    });

    describe('Protected Route Access', () => {
        it('should redirect to home if already logged in (using API command)', () => {
            // Use custom command to login via API
            cy.loginByApi(uniqueEmail, password);
            
            // Visit auth page while logged in
            cy.visit('/auth');
            
            // Should redirect to home
            cy.url().should('eq', Cypress.config().baseUrl + '/');
        });
    });
});
