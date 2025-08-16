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
  score: number;
  budget: {
    score: number;
    analysis: string;
  };
  location: {
    score: number;
    analysis: string;
  };
  target: {
    score: number;
    analysis: string;
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
  const [formData, setFormData] = useState<Partial<RestaurantFormData>>({});
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );

  const updateFormData = (data: Partial<RestaurantFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const clearFormData = () => {
    setFormData({});
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
