import axios from 'axios';
import {API_ROOT} from './../config.js';

export async function sendOtp(email) {
    const { data } = await axios.post(
        `${API_ROOT}/auth/sendotp`,
        { email },
        { headers: { 'Content-Type': 'application/json' } }
    );
    return data; // { status, message }
}

export async function verifyOtp(email, otp) {
    const { data } = await axios.post(
        `${API_ROOT}/auth/verifyotp`,
        { email, inputOtp: otp },
        { headers: { 'Content-Type': 'application/json' } }
    );
    return data; // { status, message }
}
