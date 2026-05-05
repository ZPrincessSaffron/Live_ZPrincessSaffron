describe('Checkout Flow E2E Tests', () => {
    const testUser = {
        email: 'checkout_test@example.com',
        password: 'password123'
    };

    before(() => {
        // Ensure user exists
        cy.request({
            method: 'POST',
            url: `${Cypress.env('apiUrl')}/auth/register`,
            body: {
                fullName: 'Checkout User',
                email: testUser.email,
                password: testUser.password
            },
            failOnStatusCode: false // If user already exists, it's fine
        });
    });

    beforeEach(() => {
        // Clear cart to start fresh
        window.localStorage.removeItem('cart-storage');
        cy.visit('/');
    });

    it('should redirect guest user to auth page when visiting checkout', () => {
        cy.visit('/checkout');
        cy.url().should('include', '/auth');
        cy.contains('Please Sign In').should('be.visible');
    });

    it('should successfully complete checkout form after login', () => {
        // 1. Login
        cy.loginByApi(testUser.email, testUser.password);
        
        // 2. Add product to cart first (otherwise checkout redirects to products)
        // We can inject a product into localStorage directly for speed
        const cartData = {
            state: {
                cartItems: [{
                    product_id: 1,
                    quantity: 1,
                    product: { id: 1, name: "Premium Saffron", price: 500, image: "saffron.jpg" }
                }]
            },
            version: 0
        };
        window.localStorage.setItem('cart-storage', JSON.stringify(cartData));

        cy.visit('/checkout');
        
        // 3. Fill Shipping Details
        cy.get('[data-testid="checkout-name"]').clear().type('Cypress Customer');
        cy.get('[data-testid="checkout-phone"]').type('9876543210');
        cy.get('[data-testid="checkout-address"]').type('123 Test Lane, Cypress City');
        cy.get('[data-testid="checkout-city"]').type('Mumbai');
        cy.get('[data-testid="checkout-state"]').type('Maharashtra');
        cy.get('[data-testid="checkout-pincode"]').type('400001');

        // 4. Verify Summary
        cy.contains('Order Summary').should('be.visible');
        cy.contains('Premium Saffron').should('be.visible');
        cy.contains('₹500').should('be.visible');

        // 5. Submit Payment (Mocking Razorpay trigger)
        // Note: We can't easily test the Razorpay iframe in a standard E2E test without complex mocking,
        // but we can verify the "Pay Now" button is active.
        cy.get('[data-testid="pay-now-button"]').should('not.be.disabled');
    });

    it('should validate required fields on checkout', () => {
        cy.loginByApi(testUser.email, testUser.password);
        const cartData = {
            state: { cartItems: [{ product_id: 1, quantity: 1, product: { id: 1, name: "P", price: 100 } }] },
            version: 0
        };
        window.localStorage.setItem('cart-storage', JSON.stringify(cartData));

        cy.visit('/checkout');
        
        // Try to pay without filling details
        cy.get('[data-testid="pay-now-button"]').click();
        
        // Verify toast error
        cy.contains('Missing Information').should('be.visible');
        cy.contains('Please enter your name').should('be.visible');
    });
});
