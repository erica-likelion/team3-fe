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

export interface PostData {
  title: string;
  content: string;
  category: "GENERAL" | "PARTNERSHIP";
  myStoreCategory?: string;
  partnerStoreCategory?: string;
}

// 서버에서 받아오는 게시물 데이터 인터페이스
export interface ServerPost {
  id: number;
  title: string;
  content: string;
  category: "GENERAL" | "PARTNERSHIP";
  myStoreCategory?: string;
  partnerStoreCategory?: string;
  createdAt: string;
  imageUrl?: string | null; // Changed from imageUrls
  comments?: ServerComment[] | null; // 댓글 목록 추가
}

// 업종 매핑 함수
export const mapCategoryToEnglish = (koreanCategory: string): string => {
  const categoryMap: { [key: string]: string } = {
    "카페/디저트": "CAFE_DESSERT",
    "피자/치킨": "PIZZA_CHICKEN",
    "주점/술집": "BAR_ALCOHOL",
    패스트푸드: "FAST_FOOD",
    한식: "KOREAN",
    아시안: "ASIAN",
    양식: "WESTERN",
    중식: "CHINESE",
    일식: "JAPANESE",
  };

  return categoryMap[koreanCategory] || koreanCategory;
};

export const submitPost = async (data: PostData, images?: File[]) => {
  try {
    // FormData로 전송
    const formData = new FormData();

    // JSON 데이터를 Blob으로 변환하여 dto 필드로 전송
    const jsonBlob = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });
    formData.append("dto", jsonBlob);

    // 이미지 파일들이 있는 경우에만 추가
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }

    // FormData 내용 디버깅
    console.log("FormData 내용 확인:");
    for (const [key, value] of formData.entries()) {
      if (key === "dto") {
        console.log(`${key}:`, "JSON Blob");
      } else {
        console.log(`${key}:`, value);
      }
    }

    // 실제 요청 URL 확인
    console.log("요청 URL:", `${API_BASE_URL}/api/post`);

    // FormData 사용 시 multipart/form-data 헤더 설정 (boundary는 Axios가 자동 설정)
    const response = await axios.post(`${API_BASE_URL}/api/post`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: unknown) {
    console.error("게시글 작성 API 호출 오류:", error);
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response: { data: unknown; status: number };
        config?: { headers?: unknown; data?: unknown };
      };
      console.error("서버 응답:", axiosError.response.data);
      console.error("상태 코드:", axiosError.response.status);
      console.error("요청 헤더:", axiosError.config?.headers);
      console.error("요청 데이터:", axiosError.config?.data);
    }
    throw error;
  }
};

// 게시물 목록을 가져오는 함수
export const getPosts = async (): Promise<ServerPost[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/post`);
    console.log("서버에서 받은 게시물 데이터:", response.data);
    return response.data;
  } catch (error) {
    console.error("게시물 목록 로드 오류:", error);
    throw error;
  }
};

// 특정 게시물을 가져오는 함수
export const getPostById = async (id: number): Promise<ServerPost | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/post/${id}`);
    console.log("서버에서 받은 게시물 상세 데이터:", response.data);
    return response.data;
  } catch (error) {
    console.error("게시물 상세 로드 오류:", error);
    return null;
  }
};

// 댓글 작성 함수
export interface CommentData {
  content: string;
}

export interface ServerComment {
  id: number;
  postId: number;
  content: string;
  createdAt: string;
}

export const submitComment = async (
  postId: number,
  data: CommentData
): Promise<ServerComment> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/post/${postId}/comment`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("서버에서 받은 댓글 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("댓글 작성 API 호출 오류:", error);
    throw error;
  }
};
