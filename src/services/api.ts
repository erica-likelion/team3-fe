import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface RestaurantData {
  addr: string;
  category: string;
  marketingArea: string;
  budget: { min: number; max: number };
  deposit: { min: number; max: number };
  managementMethod: string;
  representativeMenuName: string;
  representativeMenuPrice: number;
  size: { min: number; max: number };
  height: string;
}

export const submitRestaurantData = async (data: RestaurantData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/analysis`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("API 호출 오류:", error);
    throw error;
  }
};
