import axios from "axios";

const API_PREFIX = "/api";

const baseURL = import.meta.env.DEV
  ? API_PREFIX // dev: 프록시 경유 -> /api/*
  : `${import.meta.env.VITE_API_BASE_URL}${API_PREFIX}`; // prod: http://3.34.244.253/api

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// 실제로 어디로 나가는지 확인용(원인 추적에 도움)
api.interceptors.request.use((cfg) => {
  console.log("[REQ]", (cfg.baseURL || "") + (cfg.url || ""));
  return cfg;
});
