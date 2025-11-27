import React, { useState, useRef } from 'react';
import { ScanType } from '../types';
import { Upload, Link as LinkIcon, FileCode, Search, AlertCircle, ScanLine } from 'lucide-react';

interface ScanInputProps {
  onScan: (type: ScanType, data: string | File) => void;
  isLoading: boolean;
}

export const ScanInput: React.FC<ScanInputProps> = ({ onScan, isLoading }) => {
  const [activeTab, setActiveTab] = useState<ScanType>(ScanType.URL);
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === ScanType.URL && urlInput) {
      onScan(ScanType.URL, urlInput);
    } else if (activeTab === ScanType.CODE && textInput) {
      onScan(ScanType.CODE, textInput);
    } else if (activeTab === ScanType.FILE && selectedFile) {
      onScan(ScanType.FILE, selectedFile);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-1">
        <div className="flex p-1 gap-1 mb-6 bg-slate-900/50 rounded-xl">
          <button
            onClick={() => setActiveTab(ScanType.URL)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === ScanType.URL ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <LinkIcon className="w-4 h-4" /> URL
          </button>
          <button
            onClick={() => setActiveTab(ScanType.FILE)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === ScanType.FILE ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Upload className="w-4 h-4" /> File
          </button>
          <button
            onClick={() => setActiveTab(ScanType.CODE)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === ScanType.CODE ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <FileCode className="w-4 h-4" /> Code / Text
          </button>
        </div>

        <div className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === ScanType.URL && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Enter URL to scan (e.g., http://example.com)"
                  className="block w-full pl-11 pr-4 py-4 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  required
                />
              </div>
            )}

            {activeTab === ScanType.FILE && (
              <div 
                className="border-2 border-dashed border-slate-700 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:border-emerald-500/50 hover:bg-slate-900/50 transition-all cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} 
                />
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-slate-700 transition-colors">
                  <Upload className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">
                  {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                </h3>
                <p className="text-slate-500 text-sm">Supported: Images (PNG, JPG), Text files, Code snippets</p>
              </div>
            )}

            {activeTab === ScanType.CODE && (
              <div className="relative">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste code snippet or suspicious text here..."
                  className="block w-full p-4 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono text-sm h-64 resize-none"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (activeTab === ScanType.FILE && !selectedFile)}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Analyzing Target...
                </>
              ) : (
                <>
                  <ScanLine className="w-5 h-5" />
                  Initiate Scan
                </>
              )}
            </button>
            
            <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Powered by Gemini 2.5 Flash & Search Grounding
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};