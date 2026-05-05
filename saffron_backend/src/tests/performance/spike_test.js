import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '10s', target: 50 },  // Normal baseline
        { duration: '30s', target: 500 }, // Sudden spike to 500 users
        { duration: '1m', target: 500 },  // Stay at spike for 1 minute
        { duration: '20s', target: 50 },  // Sudden drop back
        { duration: '10s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<1000'],
    },
};

const BASE_URL = 'http://localhost:5000/api';

export default function () {
    // Spike tests usually focus on the most critical public endpoint (Product Listing)
    // as that's what happens during a flash sale announcement.
    const res = http.get(`${BASE_URL}/products`);
    
    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
    });

    sleep(0.5); // Faster requests during spike
}
