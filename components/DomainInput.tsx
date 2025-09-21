import React, { useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface DomainInputProps {
  domains: string;
  setDomains: (domains: string) => void;
}

export const DomainInput: React.FC<DomainInputProps> = ({ domains, setDomains }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      // Parse domains from the file, handling various separators (commas, spaces, newlines, semicolons)
      const parsedDomains = text.trim().split(/[\s,;\n]+/).filter(Boolean).join(', ');
      setDomains(parsedDomains);
    };
    reader.onerror = () => {
        console.error("Error reading file.");
    };
    reader.readAsText(file);

    // Reset file input value to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label htmlFor="domains" className="block text-sm font-medium text-slate-600">
          Domain List
        </label>
        <button
          type="button"
          onClick={triggerFileInput}
          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
          aria-label="Upload a domain file"
        >
          <UploadIcon />
          Upload File
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv,.txt,text/plain,text/csv"
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>
      <textarea
        id="domains"
        rows={8}
        value={domains}
        onChange={(e) => setDomains(e.target.value)}
        placeholder="example.com, anotherexample.com... or upload a file."
        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-slate-900 placeholder:text-slate-400"
        aria-label="Domain List"
      />
      <p className="mt-1 text-xs text-slate-500">
        Enter domains separated by commas, spaces, or new lines. Or upload a CSV/TXT file.
      </p>
    </div>
  );
};