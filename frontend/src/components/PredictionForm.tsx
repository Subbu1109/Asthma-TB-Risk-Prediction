import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowRight, Save, RotateCcw } from 'lucide-react';
import { FormData, ValidationErrors, PredictionResult } from '../types';
import { validateForm, getFormCompletion } from '../utils/validation';
import { useLocalStorage } from '../hooks/useLocalStorage';
import FormSection from './FormSection';
import ToggleSwitch from './ToggleSwitch';
import FileUpload from './FileUpload';

interface PredictionFormProps {
  onSubmit: (result: PredictionResult) => void;
}

const initialFormData: FormData = {
  candidateId: '',
  age: 30,
  gender: false,
  tbContactHistory: false,
  wheezingHistory: false,
  phlegmCough: false,
  familyAsthmaHistory: false,
  feverHistory: false,
  coldPresent: false,
  packYears: 0,
  coughFile: null,
};

const PREDICT_URL = import.meta.env.VITE_PREDICT_URL;

const medicalHistoryFields = [
  { key: 'tbContactHistory', label: 'TB Contact History' },
  { key: 'wheezingHistory', label: 'History of Wheezing' },
  { key: 'phlegmCough', label: 'Phlegm with Cough' },
  { key: 'familyAsthmaHistory', label: 'Family History of Asthma' },
  { key: 'feverHistory', label: 'Recent Fever/Weight Loss/Decreased Appetite' },
  { key: 'coldPresent', label: 'Cold Present at Recording' },
];

const PredictionForm: React.FC<PredictionFormProps> = ({ onSubmit }) => {
  const [formData, setFormData, clearFormData] = useLocalStorage('respiratoryFormData', initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setErrors(validateForm(formData));
  }, [formData]);

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToSend = new window.FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'coughFile' && value) dataToSend.append(key, value);
        else if (key === 'gender') dataToSend.append(key, value ? 'Male' : 'Female');
        else dataToSend.append(key, String(value));
      });

      const response = await axios.post(PREDICT_URL, dataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { asthmaProb, tbProb, severity } = response.data;

      console.log('BACKEND RESPONSE:', response.data);
      console.log('asthmaProb:', asthmaProb, 'TYPE:', typeof asthmaProb);
      console.log('tbProb:', tbProb, 'TYPE:', typeof tbProb);


      onSubmit({
        asthmaProb: asthmaProb,
        tbProb: tbProb,
        severity: severity,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error analyzing respiratory health. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  


  const handleReset = () => {
    clearFormData();
    setErrors({});
  };

  const completion = getFormCompletion(formData);
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="bg-white/25 backdrop-blur-md rounded-3xl p-10 shadow-2xl border border-white/40">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold text-gray-800">Form Completion</span>
            <span className="text-lg font-bold text-emerald-600">{completion}%</span>
          </div>
          <div className="w-full bg-white/40 rounded-full h-3 shadow-inner">
            <div
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-3 rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            <FormSection title="Patient Information">
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-800 mb-3">Candidate ID</label>
                <input
                  type="text"
                  value={formData.candidateId}
                  onChange={(e) => updateField('candidateId', e.target.value)}
                  placeholder="136bac9a3e081"
                  className={`w-full px-5 py-4 border-2 rounded-xl text-lg font-medium ${errors.candidateId ? 'border-red-400 bg-red-50' : 'border-white/50 bg-white/70'}`}
                />
                {errors.candidateId && <p className="text-sm text-red-600 mt-2 font-medium">{errors.candidateId}</p>}
              </div>
            </FormSection>

            <FormSection title="Demographics">
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">Age</label>
                  <input
                    type="number"
                    min={18}
                    max={80}
                    value={formData.age}
                    onChange={(e) => updateField('age', Number(e.target.value))}
                    className={`w-full px-5 py-4 border-2 rounded-xl text-lg font-medium ${errors.age ? 'border-red-400 bg-red-50' : 'border-white/50 bg-white/70'}`}
                  />
                  {errors.age && <p className="text-sm text-red-600 mt-2 font-medium">{errors.age}</p>}
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-4">Gender</label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => updateField('gender', false)}
                      className={`px-8 py-3 rounded-xl font-bold text-lg ${formData.gender === false ? 'bg-pink-500 text-white' : 'bg-white/70 text-gray-700'}`}
                    >
                      Female
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('gender', true)}
                      className={`px-8 py-3 rounded-xl font-bold text-lg ${formData.gender === true ? 'bg-blue-500 text-white' : 'bg-white/70 text-gray-700'}`}
                    >
                      Male
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">Pack Years</label>
                  <input
                    type="number"
                    min={0}
                    max={800}
                    value={formData.packYears}
                    onChange={(e) => updateField('packYears', Number(e.target.value))}
                    className={`w-full px-5 py-4 border-2 rounded-xl text-lg font-medium ${errors.packYears ? 'border-red-400 bg-red-50' : 'border-white/50 bg-white/70'}`}
                  />
                  {errors.packYears && <p className="text-sm text-red-600 mt-2 font-medium">{errors.packYears}</p>}
                </div>
              </div>
            </FormSection>
          </div>

          <div className="space-y-8">
            <FormSection title="Medical History & Symptoms">
              <div className="grid grid-cols-1 gap-4">
                {medicalHistoryFields.map(({ key, label }) => (
                  <ToggleSwitch
                    key={key}
                    label={label}
                    checked={formData[key as keyof FormData] as boolean}
                    onChange={(checked) => updateField(key as keyof FormData, checked)}
                  />
                ))}
              </div>
            </FormSection>

            <FormSection title="Audio Analysis">
              <FileUpload
                onFileSelect={(file) => updateField('coughFile', file)}
                error={errors.coughFile}
              />
            </FormSection>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 pt-8">
          <button
            type="submit"
            disabled={hasErrors || isSubmitting}
            className={`flex items-center gap-4 px-10 py-4 rounded-2xl font-bold text-xl text-white ${hasErrors || isSubmitting ? 'bg-gray-400' : 'bg-emerald-600 hover:bg-emerald-700'}`}
          >
            {isSubmitting ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Save className="w-6 h-6" />
                Analyze
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-3 px-10 py-4 bg-red-500 text-white rounded-2xl font-bold text-xl hover:bg-red-600"
          >
            <RotateCcw className="w-6 h-6" />
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default PredictionForm;
