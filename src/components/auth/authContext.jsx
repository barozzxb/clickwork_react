
import axios from 'axios';

const API_URL = 'http://localhost:9000/api/auth'; // Đổi URL nếu backend khác

export const login = async (username, password) => {
  return await axios.post(`${API_URL}/login`, { username, password });
};
