import React from 'react';
import { Check } from 'lucide-react';

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  label, 
  checked, 
  onChange, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-between p-4 rounded-xl bg-white/60 hover:bg-white/80 transition-all duration-200 border border-white/40 ${className}`}>
      <label className="text-lg font-semibold text-gray-800 cursor-pointer flex-1">
        {label}
      </label>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`
          relative w-16 h-8 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-emerald-300 transform hover:scale-105
          ${checked ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-lg' : 'bg-gray-300'}
        `}
      >
        <div
          className={`
            absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transform transition-all duration-300 ease-in-out flex items-center justify-center
            ${checked ? 'translate-x-8' : 'translate-x-0'}
          `}
        >
          <Check 
            className={`w-4 h-4 text-emerald-600 transition-opacity duration-200 ${
              checked ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      </button>
    </div>
  );
};

export default ToggleSwitch;