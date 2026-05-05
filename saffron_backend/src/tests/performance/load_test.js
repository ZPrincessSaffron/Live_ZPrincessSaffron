import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

// Custom metrics
const ErrorCounter = new Counter('errors');

export const options = {
    stages: [
        { duration: '1m', target: 50 },  // Ramp up to 50 users
        { duration: '3m', target: 100 }, // Stay at 100 users for 3 minutes
        { duration: '1m', target: 0 },   // Ramp down to 0 users
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
        http_req_failed: ['rate<0.01'],    // Error rate must be less than 1%
    },
};

const BASE_URL = 'http://localhost:5000/api';

export default function () {
    const uniqueId = Date.now() + Math.random();
    const email = `load_test_${uniqueId}@test.com`;
    const password = 'password123';

    // 1. PUBLIC: Get Products
    const productsRes = http.get(`${BASE_URL}/products`);
    check(productsRes, {
        'products status is 200': (r) => r.status === 200,
    }) || ErrorCounter.add(1);

    // 2. PUBLIC: Register
    const regPayload = JSON.stringify({
        fullName: 'Load Test User',
        email: email,
        password: password,
    });
    const regParams = { headers: { 'Content-Type': 'application/json' } };
    const regRes = http.post(`${BASE_URL}/auth/register`, regPayload, regParams);
    check(regRes, {
        'register status is 201': (r) => r.status === 201,
    }) || ErrorCounter.add(1);

    if (regRes.status === 201) {
        const token = regRes.json().token;
        const authParams = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };

        // 3. PROTECTED: Get Profile
        const profileRes = http.get(`${BASE_URL}/users/profile`, authParams);
        check(profileRes, {
            'profile status is 200': (r) => r.status === 200,
        }) || ErrorCounter.add(1);

        // 4. PROTECTED: Add to Cart
        const cartPayload = JSON.stringify({
            product_id: 1, // Assuming product with ID 1 exists
            quantity: 1,
        });
        const cartRes = http.post(`${BASE_URL}/cart`, cartPayload, authParams);
        check(cartRes, {
            'add to cart status is 201': (r) => r.status === 201 || r.status === 200,
        }) || ErrorCounter.add(1);
    }

    sleep(1);
}
