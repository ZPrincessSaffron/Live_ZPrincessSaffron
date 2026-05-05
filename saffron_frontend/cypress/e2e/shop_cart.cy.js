describe('Shop and Cart E2E Tests', () => {
    const testUser = {
        email: 'shop_test@example.com',
        password: 'password123'
    };

    before(() => {
        cy.request({
            method: 'POST',
            url: `${Cypress.env('apiUrl')}/auth/register`,
            body: { fullName: 'Shop User', email: testUser.email, password: testUser.password },
            failOnStatusCode: false
        });
    });

    beforeEach(() => {
        cy.loginByApi(testUser.email, testUser.password);
        window.localStorage.removeItem('cart-storage');
    });

    it('should browse products and add to cart', () => {
        cy.visit('/products');
        
        // Check products are loaded
        cy.get('[data-testid^="product-card-"]').should('have.length.at.least', 1);
        cy.get('[data-testid="product-name"]').first().invoke('text').as('productName');

        // Add first product to cart
        cy.get('[data-testid="add-to-cart-button"]').first().click();
        cy.contains('Added to cart').should('be.visible');

        // Go to cart
        cy.visit('/cart');
        cy.get('@productName').then((name) => {
            cy.contains(name.trim()).should('be.visible');
        });
    });

    it('should update quantities and remove items in cart', () => {
        // Inject 2 items of product 1
        const cartData = {
            state: {
                cartItems: [{
                    product_id: 1,
                    quantity: 2,
                    product: { id: 1, name: "Premium Saffron", price: 500, image: "saffron.jpg" }
                }]
            },
            version: 0
        };
        window.localStorage.setItem('cart-storage', JSON.stringify(cartData));

        cy.visit('/cart');
        cy.get('[data-testid="cart-item-1"]').should('be.visible');
        cy.contains('2').should('be.visible');

        // Increase quantity
        cy.get('[data-testid="quantity-plus"]').click();
        cy.contains('3').should('be.visible');
        cy.contains('₹1,500').should('be.visible');

        // Decrease quantity
        cy.get('[data-testid="quantity-minus"]').click();
        cy.contains('2').should('be.visible');

        // Remove item
        cy.get('[data-testid="remove-item"]').click();
        cy.contains('Your Cart is Empty').should('be.visible');
    });

    it('should apply and remove coupon codes', () => {
        const cartData = {
            state: {
                cartItems: [{
                    product_id: 1,
                    quantity: 1,
                    product: { id: 1, name: "Premium Saffron", price: 1000, image: "saffron.jpg" }
                }]
            },
            version: 0
        };
        window.localStorage.setItem('cart-storage', JSON.stringify(cartData));

        cy.visit('/cart');

        // Apply invalid coupon
        cy.get('[data-testid="coupon-input"]').type('INVALID');
        cy.get('[data-testid="apply-coupon-button"]').click();
        cy.contains('Invalid coupon').should('be.visible');

        // Apply valid coupon (WELCOME15 - 15%)
        cy.get('[data-testid="coupon-input"]').clear().type('WELCOME15');
        cy.get('[data-testid="apply-coupon-button"]').click();
        cy.contains('Coupon applied!').should('be.visible');
        
        // Verify discount (15% of 1000 = 150)
        cy.contains('Discount').should('be.visible');
        cy.contains('-₹150').should('be.visible');

        // Remove coupon
        cy.contains('Remove').click();
        cy.contains('Coupon removed').should('be.visible');
        cy.contains('-₹150').should('not.exist');
    });
});
