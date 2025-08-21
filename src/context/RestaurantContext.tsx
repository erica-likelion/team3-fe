import React, { createContext, useContext, useState, ReactNode } from "react";

export interface RestaurantFormData {
  addr: string;
  category: string;
  marketingArea: string;
  budget: { min: number; max: number };
  managementMethod: string;
  averagePrice: { min: number; max: number };
  size: { min: number; max: number };
  height: number;
}

// API 응답 데이터 타입 정의
export interface AnalysisResult {
  scores: Array<{
    name: string;
    score: number;
    reason: string;
  }>;
  reviewAnalysis: {
    averageRating: number;
    feedback: string;
    reviewSamples: Array<{
      storeName: string;
      reviewScore: number;
      highlights: string[];
    }>;
  };
  detailAnalysis: {
    sections: Array<{
      name: string;
      content: string;
    }>;
  };
}

interface RestaurantContextType {
  formData: Partial<RestaurantFormData>;
  analysisResult: AnalysisResult | null;
  updateFormData: (data: Partial<RestaurantFormData>) => void;
  setAnalysisResult: (result: AnalysisResult) => void;
  clearFormData: () => void;
  clearAnalysisResult: () => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(
  undefined
);

export const useRestaurantContext = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error(
      "useRestaurantContext must be used within a RestaurantProvider"
    );
  }
  return context;
};

interface RestaurantProviderProps {
  children: ReactNode;
}

export const RestaurantProvider: React.FC<RestaurantProviderProps> = ({
  children,
}) => {
  // localStorage에서 저장된 데이터 불러오기 (뒤로 가기인 경우에만)
  const getStoredFormData = (): Partial<RestaurantFormData> => {
    const isBackNavigation =
      sessionStorage.getItem("isBackNavigation") === "true";
    if (!isBackNavigation) {
      return {};
    }

    try {
      const stored = localStorage.getItem("restaurantFormData");
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("Failed to parse stored form data:", error);
      return {};
    }
  };

  const [formData, setFormData] =
    useState<Partial<RestaurantFormData>>(getStoredFormData);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );

  const updateFormData = (data: Partial<RestaurantFormData>) => {
    setFormData((prev) => {
      const newData = { ...prev, ...data };
      // localStorage에 저장
      try {
        localStorage.setItem("restaurantFormData", JSON.stringify(newData));
      } catch (error) {
        console.error("Failed to save form data to localStorage:", error);
      }
      return newData;
    });
  };

  const clearFormData = () => {
    setFormData({});
    // localStorage에서도 삭제
    try {
      localStorage.removeItem("restaurantFormData");
    } catch (error) {
      console.error("Failed to remove form data from localStorage:", error);
    }
  };

  const clearAnalysisResult = () => {
    setAnalysisResult(null);
  };

  return (
    <RestaurantContext.Provider
      value={{
        formData,
        analysisResult,
        updateFormData,
        setAnalysisResult,
        clearFormData,
        clearAnalysisResult,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};
