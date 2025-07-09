export interface FormData {
  candidateId: string;
  age: number;
  gender: boolean; // true for Male, false for Female
  tbContactHistory: boolean;
  wheezingHistory: boolean;
  phlegmCough: boolean;
  familyAsthmaHistory: boolean;
  feverHistory: boolean;
  coldPresent: boolean;
  packYears: number;
  coughFile: File | null;
}

export interface PredictionResult {
  asthmaProb: number;
  tbProb: number;
  severity: 'low' | 'medium' | 'high';
}

export interface ValidationErrors {
  [key: string]: string;
}