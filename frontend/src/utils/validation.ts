import { FormData, ValidationErrors } from '../types';

export const validateCandidateId = (id: string): boolean => {
  const hexPattern = /^[a-f0-9]{12}$/;
  return hexPattern.test(id);
};

export const validateForm = (data: FormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.candidateId) {
    errors.candidateId = 'Candidate ID is required';
  } else if (!validateCandidateId(data.candidateId)) {
    errors.candidateId = 'Must be 12-character hex ID (e.g., 136bac9a3e081)';
  }

  if (data.age < 18 || data.age > 80) {
    errors.age = 'Age must be between 18 and 80';
  }

  if (data.packYears < 0 || data.packYears > 800) {
    errors.packYears = 'Pack years must be between 0 and 800';
  }

  if (data.coughFile) {
    const allowedTypes = ['audio/wav', 'audio/mpeg', 'audio/mp3'];
    if (!allowedTypes.includes(data.coughFile.type)) {
      errors.coughFile = 'Only .wav and .mp3 files are allowed';
    }
  }

  return errors;
};

export const getFormCompletion = (data: FormData): number => {
  const totalFields = Object.keys(data).length;
  const completedFields = Object.values(data).filter(value => 
    value !== null && value !== undefined && value !== '' && value !== 0
  ).length;
  
  return Math.round((completedFields / totalFields) * 100);
};