import React, { useRef, useState } from 'react';
import { Upload, File, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import { LightCurveData } from './DemoSection';

interface FileUploadProps {
  onDataLoad: (data: LightCurveData[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoad }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');

  const parseCSV = (text: string) => {
    setError('');
    
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data: LightCurveData[] = results.data.map((row: any) => {
            const time = parseFloat(row.time || row.Time || row.TIME || Object.values(row)[0]);
            const flux = parseFloat(row.flux || row.Flux || row.FLUX || Object.values(row)[1]);
            
            if (isNaN(time) || isNaN(flux)) {
              throw new Error('Invalid data format');
            }
            
            return { time, flux };
          });
          
          if (data.length === 0) {
            throw new Error('No valid data found');
          }
          
          onDataLoad(data);
        } catch (err) {
          setError('Error parsing CSV: Please ensure your file has "time" and "flux" columns');
        }
      },
      error: () => {
        setError('Error reading file. Please try again.');
      }
    });
  };

  const handleFileSelect = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please select a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drag and Drop Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
          isDragging
            ? 'border-blue-400 bg-blue-400/10'
            : 'border-gray-600 hover:border-blue-500 hover:bg-blue-500/5'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-white font-medium mb-2">
          Drop your CSV file here or click to browse
        </p>
        <p className="text-gray-400 text-sm">
          Expected format: columns named "time" and "flux"
        </p>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-lg p-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Example Format */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <File className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300 font-medium text-sm">Expected CSV format:</span>
        </div>
        <pre className="text-gray-400 text-xs font-mono">
{`time,flux
0.0,1.0002
0.1,0.9998
0.2,0.9995
...`}
        </pre>
      </div>
    </div>
  );
};