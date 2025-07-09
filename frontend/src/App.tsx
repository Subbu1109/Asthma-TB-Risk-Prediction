import React, { useState } from 'react';
import { PredictionResult } from './types';
import Header from './components/Header';
import PredictionForm from './components/PredictionForm';
import ResultsPage from './components/ResultsPage';

function App() {
  const [currentView, setCurrentView] = useState<'form' | 'results'>('form');
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);

  const handleFormSubmit = (result: PredictionResult) => {
    setPredictionResult(result);
    setCurrentView('results');
  };

  const handleBackToForm = () => {
    setPredictionResult(null);
    setCurrentView('form');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-500">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header />

        {currentView === 'form' && (
          <PredictionForm onSubmit={handleFormSubmit} />
        )}

        {currentView === 'results' && predictionResult && (
          <ResultsPage
            result={predictionResult}
            onBack={handleBackToForm}
          />
        )}
      </div>
    </div>
  );
}

export default App;
