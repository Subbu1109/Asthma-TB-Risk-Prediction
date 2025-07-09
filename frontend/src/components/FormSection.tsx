import React from 'react';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`mb-10 ${className}`}>
      <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-gradient-to-r from-emerald-400 to-cyan-400 pb-3">
        {title}
      </h3>
      {children}
    </div>
  );
};

export default FormSection;