// src/api/analysis.ts
import { api } from "./client"; // baseURL 설정된 axios 인스턴스

export type MinMax = { min: number; max: number };

export type ScoreItem = {
  name: string;
  score: number;
  reason?: string;
  expectedPrice?: { monthly: number; securityDeposit: number };
};

export type ReviewSample = {
  storeName: string;
  reviewScore: number;
  highlights: string[];
  menuAveragePrice: number;
};

export type ReviewAnalysis = {
  summary: string;
  positiveKeywords: string[];
  negativeKeywords: string[];
  reviewSamples: ReviewSample[];
  averageMenuPrice: { average: number; min: number; max: number };
};

export type Tip = {
  type: "success" | "warning" | "info" | string;
  message: string;
};

export type DetailAnalysis = {
  summary?: string;
  strengths?: string;
  weaknesses?: string;
};

export type AnalysisRequest = {
  addr: string;
  category: string;
  marketingArea: string;
  budget: MinMax;
  managementMethod: string;
  representativeMenuName: string;
  representativeMenuPrice?: number;
  averagePrice: MinMax;
  size: MinMax;
  height: string;
};

export type AnalysisResponse = {
  scores: ScoreItem[];
  reviewAnalysis?: ReviewAnalysis;
  tips?: Tip[];
  detailAnalysis?: DetailAnalysis;
};

export async function postAnalysis(body: AnalysisRequest) {
  const { data } = await api.post<AnalysisResponse>("/analysis", body);
  return data;
}
