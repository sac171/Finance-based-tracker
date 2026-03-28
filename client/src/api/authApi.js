import axios from "axios";

const BASE_URL = "http://localhost:5000/api/auth";

export const loginUser = async (credentials) => {
  const res = await axios.post(`${BASE_URL}/login`, credentials);
  return res.data;
};

export const signupUser = async (credentials) => {
  const res = await axios.post(`${BASE_URL}/signup`, credentials);
  return res.data;
};