import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '2m', target: 200 }, // Ramp up to 200
        { duration: '2m', target: 400 }, // Ramp up to 400
        { duration: '5m', target: 600 }, // Push to 600 users for 5 mins
        { duration: '2m', target: 0 },   // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(99)<2000'], // 99% of requests must be under 2s
        http_req_failed: ['rate<0.05'],    // Allow up to 5% failure under stress
    },
};

const BASE_URL = 'http://localhost:5000/api';

export default function () {
    const uniqueId = Date.now() + Math.random();
    const email = `stress_test_${uniqueId}@test.com`;
    const password = 'password123';

    // Randomly choose between public and protected flows to simulate varied traffic
    const flow = Math.random();

    if (flow < 0.4) {
        // 40% only browse products (Public)
        http.get(`${BASE_URL}/products`);
    } else {
        // 60% Register/Login and check profile
        const regPayload = JSON.stringify({
            fullName: 'Stress User',
            email: email,
            password: password,
        });
        const params = { headers: { 'Content-Type': 'application/json' } };
        const regRes = http.post(`${BASE_URL}/auth/register`, regPayload, params);

        if (regRes.status === 201) {
            const token = regRes.json().token;
            http.get(`${BASE_URL}/users/profile`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
        }
    }

    sleep(1);
}
