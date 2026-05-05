describe('Profile and Admin E2E Tests', () => {
    const regularUser = {
        email: `user_${Date.now()}@test.com`,
        password: 'password123',
        fullName: 'Regular User'
    };

    const adminUser = {
        email: `admin_${Date.now()}@test.com`,
        password: 'password123',
        fullName: 'Admin User'
    };

    before(() => {
        // Create regular user
        cy.request('POST', `${Cypress.env('apiUrl')}/auth/register`, {
            fullName: regularUser.fullName,
            email: regularUser.email,
            password: regularUser.password
        });

        // Note: Creating an actual admin user usually requires direct DB access or a special internal route.
        // For this test, we verify the "Access Denied" logic for non-admins.
    });

    describe('User Profile', () => {
        beforeEach(() => {
            cy.loginByApi(regularUser.email, regularUser.password);
        });

        it('should display correct user information on profile page', () => {
            cy.visit('/profile');
            cy.get('[data-testid="profile-name"]').should('contain', regularUser.fullName);
            cy.get('[data-testid="profile-email"]').should('contain', regularUser.email);
        });

        it('should navigate to edit profile page', () => {
            cy.visit('/profile');
            cy.get('[data-testid="edit-profile-button"]').click();
            cy.url().should('include', '/profile/edit');
        });
    });

    describe('Admin Security', () => {
        it('should show access denied for guest users', () => {
            // No login
            cy.visit('/admin');
            cy.get('[data-testid="access-denied-message"]').should('be.visible');
            cy.contains('Access Denied').should('be.visible');
        });

        it('should show access denied for regular logged-in users', () => {
            cy.loginByApi(regularUser.email, regularUser.password);
            cy.visit('/admin');
            cy.get('[data-testid="access-denied-message"]').should('be.visible');
        });

        // If we had a way to promote a user to admin in the test environment:
        /*
        it('should allow access for admin users', () => {
            cy.loginByApi(adminUser.email, adminUser.password);
            cy.visit('/admin');
            cy.get('[data-testid="admin-dashboard-main"]').should('be.visible');
        });
        */
    });
});
