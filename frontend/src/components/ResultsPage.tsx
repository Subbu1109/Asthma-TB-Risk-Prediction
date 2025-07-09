import React from 'react';
import { useEffect} from 'react';
import { ArrowLeft, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { PredictionResult } from '../types';

interface ResultsPageProps {
  result: PredictionResult;
  onBack: () => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ result, onBack }) => {
  useEffect(() => {
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }, []);

  const severity = (result.severity ?? '').toLowerCase();

  const getSeverityColor = () => {
    if (severity.includes('healthy') || severity.includes('low')) return 'text-emerald-600';
    if (severity.includes('medium') || severity.includes('asthma')) return 'text-amber-600';
    if (severity.includes('high') || severity.includes('tuberculosis')) return 'text-red-600';
    return 'text-gray-600';
  };


  const getSeverityIcon = () => {
    if (severity.includes('healthy') || severity.includes('low')) return <CheckCircle className="w-8 h-8" />;
    if (severity.includes('medium') || severity.includes('asthma') || severity.includes('high') || severity.includes('tuberculosis'))
      return <AlertTriangle className="w-8 h-8" />;
    return <Activity className="w-8 h-8" />;
  };

  const getSeverityBg = () => {
    if (severity.includes('healthy') || severity.includes('low')) return 'bg-emerald-50 border-emerald-300';
    if (severity.includes('medium') || severity.includes('asthma')) return 'bg-amber-50 border-amber-300';
    if (severity.includes('high') || severity.includes('tuberculosis')) return 'bg-red-50 border-red-300';
    return 'bg-gray-50 border-gray-300';
  };

  const safeProbability = (value: number) => {
    if (typeof value !== 'number' || isNaN(value)) return 0;
    return Math.min(Math.max(value, 0), 100);
  };

  const ProbabilityMeter: React.FC<{ title: string; probability: number; color: string }> = ({ title, probability, color }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const clampedProb = safeProbability(probability);

    return (
      <div className="bg-white/40 backdrop-blur-md rounded-2xl p-8 border-2 border-white/50 shadow-xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">{title}</h3>
        <div className="relative mb-6">
          <div className="w-40 h-40 mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={color}
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - clampedProb / 100)}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-800">
                {clampedProb.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/25 backdrop-blur-md rounded-3xl p-10 shadow-2xl border border-white/40">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-4 mb-6">
          <Activity className="w-12 h-12 text-white drop-shadow-lg" />
          <h2 className="text-5xl font-bold text-white drop-shadow-lg">Analysis Results</h2>
        </div>
        <p className="text-xl text-white/95 font-medium">Your respiratory health assessment is complete</p>
      </div>

      {/* Probability Meters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <ProbabilityMeter
          title="Asthma Risk"
          probability={result.asthmaProb}
          color="#10B981"
        />
        <ProbabilityMeter
          title="Tuberculosis Risk"
          probability={result.tbProb}
          color="#06B6D4"
        />
      </div>

      {/* Severity Box */}
      <div className={`rounded-2xl p-8 border-3 mb-10 ${getSeverityBg()}`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={getSeverityColor()}>
            {getSeverityIcon()}
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            Overall Risk Level:{' '}
            <span className={`capitalize ${getSeverityColor()}`}>
              {result.severity}
            </span>
          </h3>
        </div>
        <div className="text-lg text-gray-700 space-y-3 font-medium">
          {severity.includes('healthy') && (
            <p>Your results indicate you are healthy. Continue maintaining good habits and regular check-ups.</p>
          )}
          {severity.includes('asthma') && (
            <p>Your results indicate risk of asthma. Please consult a healthcare provider for evaluation.</p>
          )}
          {severity.includes('tuberculosis') && (
            <p>Your results indicate risk of tuberculosis. Seek medical attention promptly for evaluation and treatment.</p>
          )}
          {(severity.includes('low') || severity.includes('medium') || severity.includes('high')) && (
            <>
              {severity.includes('low') && (
                <p>Your respiratory health indicators suggest low risk. Maintain healthy habits and regular check-ups.</p>
              )}
              {severity.includes('medium') && (
                <p>Some indicators suggest moderate risk. We recommend consulting with a healthcare professional.</p>
              )}
              {severity.includes('high') && (
                <p>Several indicators suggest higher risk. Please consult with a healthcare professional promptly.</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
          <div className="text-lg text-amber-800">
            <p className="font-bold mb-2">Important Disclaimer</p>
            <p className="font-medium">
              This analysis is for informational purposes only and should not replace professional medical advice. Please consult with a qualified healthcare provider for proper diagnosis and treatment.
            </p>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="text-center">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-4 px-10 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-2xl font-bold text-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-gray-500/25"
        >
          <ArrowLeft className="w-6 h-6" />
          Back to Form
        </button>
      </div>
    </div>
  );
};

export default ResultsPage;
