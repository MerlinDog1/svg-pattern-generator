import React, { useState, useRef, useCallback } from 'react';

interface SVGUploadProps {
  onSVGUpload: (svgFiles: File[]) => void;
  isUploading?: boolean;
}

interface UploadState {
  isDragOver: boolean;
  progress: number;
  error: string | null;
  fileName: string | null;
}

export function SVGUpload({ onSVGUpload, isUploading = false }: SVGUploadProps) {
  const [state, setState] = useState<UploadState>({
    isDragOver: false,
    progress: 0,
    error: null,
    fileName: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const validateSVGFile = (file: File): string | null => {
    // Check file type
    if (!file.type.includes('svg') && !file.name.toLowerCase().endsWith('.svg')) {
      return 'Please select a valid SVG file';
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 2MB';
    }

    return null;
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('Failed to read file as text'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const validateSVGContent = (content: string): boolean => {
    // Basic SVG validation
    const trimmed = content.trim().toLowerCase();
    return trimmed.startsWith('<svg') && trimmed.includes('</svg>');
  };

  const extractSVGName = (content: string, fileName: string): string => {
    // Try to extract name from title or use filename
    const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      return titleMatch[1].trim();
    }
    return fileName.replace('.svg', '').replace(/[-_]/g, ' ');
  };

  const handleFileProcessing = useCallback(async (file: File) => {
    try {
      setState(prev => ({
        ...prev,
        error: null,
        progress: 0,
        fileName: file.name,
      }));

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setState(prev => {
          if (prev.progress < 90) {
            return { ...prev, progress: prev.progress + 10 };
          }
          return prev;
        });
      }, 100);

      const validationError = validateSVGFile(file);
      if (validationError) {
        clearInterval(progressInterval);
        setState(prev => ({
          ...prev,
          progress: 0,
          error: validationError,
          fileName: null,
        }));
        return;
      }

      const svgContent = await readFileAsText(file);
      
      // Validate SVG content
      if (!validateSVGContent(svgContent)) {
        clearInterval(progressInterval);
        setState(prev => ({
          ...prev,
          progress: 0,
          error: 'Invalid SVG format. Please ensure the file contains valid SVG content.',
          fileName: null,
        }));
        return;
      }
      
      clearInterval(progressInterval);
      setState(prev => ({ ...prev, progress: 100 }));

      // Call the upload handler with the file
      onSVGUpload([file]);

      // Reset after a delay
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          progress: 0,
          fileName: null,
        }));
      }, 1500);

    } catch (error) {
      setState(prev => ({
        ...prev,
        progress: 0,
        error: error instanceof Error ? error.message : 'Failed to process file',
        fileName: null,
      }));
    }
  }, [onSVGUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, isDragOver: true }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    // Only set isDragOver to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setState(prev => ({ ...prev, isDragOver: false }));
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, isDragOver: false }));

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileProcessing(files[0]);
    }
  }, [handleFileProcessing]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileProcessing(files[0]);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [handleFileProcessing]);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-3">
      <h2 className="text-heading-md font-semibold text-neutral-900">Upload SVG Pattern</h2>
      
      {/* Upload Zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-all duration-fast cursor-pointer
          ${state.isDragOver 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300 hover:bg-neutral-100'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".svg,image/svg+xml"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="text-center space-y-3">
          {/* Upload Icon */}
          <div className="mx-auto w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-6 h-6 text-primary-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
              />
            </svg>
          </div>

          {/* Upload Text */}
          <div className="space-y-1">
            <p className="text-body font-medium text-neutral-900">
              {state.isDragOver ? 'Drop your SVG file here' : 'Drag and drop your SVG file'}
            </p>
            <p className="text-small text-neutral-500">
              or click to browse files
            </p>
          </div>

          {/* File Requirements */}
          <div className="text-caption text-neutral-400">
            Supports SVG files up to 2MB
          </div>
        </div>

        {/* Progress Bar */}
        {state.progress > 0 && (
          <div className="absolute inset-0 bg-white bg-opacity-90 rounded-lg flex items-center justify-center">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-small text-neutral-700">
                <span>Processing...</span>
                <span>{state.progress}%</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all duration-fast"
                  style={{ width: `${state.progress}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error State */}
      {state.error && (
        <div className="p-3 bg-error bg-opacity-10 border border-error border-opacity-20 rounded-md">
          <div className="flex items-start space-x-2">
            <svg 
              className="w-5 h-5 text-error flex-shrink-0 mt-0.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <div>
              <p className="text-small font-medium text-error">Upload Failed</p>
              <p className="text-caption text-error mt-1">{state.error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success State */}
      {state.fileName && state.progress === 100 && !state.error && (
        <div className="p-3 bg-success bg-opacity-10 border border-success border-opacity-20 rounded-md">
          <div className="flex items-start space-x-2">
            <svg 
              className="w-5 h-5 text-success flex-shrink-0 mt-0.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
            <div>
              <p className="text-small font-medium text-success">Upload Successful</p>
              <p className="text-caption text-success mt-1">{state.fileName}</p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Button */}
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={isUploading}
        className="w-full h-12 px-4 bg-primary-500 hover:bg-primary-600 
                 disabled:bg-neutral-300 disabled:cursor-not-allowed
                 text-white font-medium text-body rounded-md
                 transition-colors duration-fast
                 flex items-center justify-center space-x-2"
      >
        {isUploading ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
              />
            </svg>
            <span>Choose SVG File</span>
          </>
        )}
      </button>
    </div>
  );
}