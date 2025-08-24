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

export interface Restaurant {
  name: string;
  address: string;
  lat: number;
  lon: number;
  coord: string;
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

export const getRestaurants = async (): Promise<Restaurant[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/restaurants`);
    return response.data;
  } catch (error) {
    console.error("레스토랑 데이터 로드 오류:", error);
    throw error;
  }
};

export const submitPartnershipData = async (data: { storeName: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/partnership`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Partnership API 호출 오류:", error);
    throw error;
  }
};
