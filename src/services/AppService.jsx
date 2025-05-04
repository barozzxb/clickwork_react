import axios from 'axios';

const API_BASE = 'http://localhost:9000/api/auth';

export async function sendOtp(email) {
    const { data } = await axios.post(
        `${API_BASE}/sendotp`,
        { email },
        { headers: { 'Content-Type': 'application/json' } }
    );
    return data; // { status, message }
}

export async function verifyOtp(email, otp) {
    const { data } = await axios.post(
        `${API_BASE}/verifyotp`,
        { email, inputOtp: otp },
        { headers: { 'Content-Type': 'application/json' } }
    );
    return data; // { status, message }
}