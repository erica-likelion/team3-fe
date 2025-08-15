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

interface RestaurantContextType {
  formData: Partial<RestaurantFormData>;
  updateFormData: (data: Partial<RestaurantFormData>) => void;
  clearFormData: () => void;
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

  const updateFormData = (data: Partial<RestaurantFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const clearFormData = () => {
    setFormData({});
  };

  return (
    <RestaurantContext.Provider
      value={{ formData, updateFormData, clearFormData }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};
