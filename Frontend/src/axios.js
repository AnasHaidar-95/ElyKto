import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000", // عدّلها حسب بورت وسيرفرك
});

export default instance;