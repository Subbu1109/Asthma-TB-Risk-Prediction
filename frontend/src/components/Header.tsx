import React from 'react';
import { Stethoscope } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="text-center py-12 mb-12">
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="p-4 bg-white/30 backdrop-blur-sm rounded-full shadow-lg">
          <Stethoscope className="w-12 h-12 text-white drop-shadow-lg" />
        </div>
        <h1 className="text-6xl font-bold text-white tracking-wide drop-shadow-lg">
          RespiratoryAI
        </h1>
      </div>
      <p className="text-2xl text-white/95 font-medium drop-shadow-md">
        Asthma & Tuberculosis Prediction System
      </p>
      <div className="mt-4 w-32 h-1 bg-gradient-to-r from-emerald-300 to-cyan-300 mx-auto rounded-full"></div>
    </header>
  );
};

export default Header;