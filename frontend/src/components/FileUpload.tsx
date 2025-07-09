import React, { useCallback, useState } from 'react';
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  error?: string;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  error,
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    const allowedTypes = ['audio/wav', 'audio/mpeg', 'audio/mp3'];
    if (!allowedTypes.includes(file.type)) {
      return;
    }
    
    setUploadedFile(file);
    onFileSelect(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const isValidFile = uploadedFile && !error;

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="text-lg font-semibold text-gray-800">
        Cough Audio Upload
      </label>
      
      <div
        className={`
          relative border-3 border-dashed rounded-2xl p-8 text-center transition-all duration-300 transform hover:scale-102
          ${dragActive ? 'border-emerald-500 bg-emerald-50 scale-102' : 'border-white/60 hover:border-emerald-400'}
          ${error ? 'border-red-400 bg-red-50' : ''}
          ${isValidFile ? 'border-emerald-500 bg-emerald-50' : 'bg-white/40'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".wav,.mp3"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          {isValidFile ? (
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
          ) : error ? (
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          ) : (
            <Upload className="w-16 h-16 text-gray-400 mx-auto" />
          )}
          
          {uploadedFile ? (
            <div>
              <div className="flex items-center justify-center gap-3 text-lg font-bold text-gray-800">
                <File className="w-5 h-5" />
                {uploadedFile.name}
              </div>
              <p className="text-sm text-gray-600 mt-2 font-medium">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-bold text-gray-800">
                Drop your audio file here or click to browse
              </p>
              <p className="text-sm text-gray-600 font-medium">
                Supports .wav and .mp3 files
              </p>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

export default FileUpload;