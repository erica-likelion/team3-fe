import axios from "axios";

const API_BASE_URL = "http://3.34.244.253";

export interface RestaurantData {
  addr: string;
  category: string;
  marketingArea: string;
  budget: { min: number; max: number };
  managementMethod: string;
  averagePrice: { min: number; max: number };
  size: { min: number; max: number };
  height: number;
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
