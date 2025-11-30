import React, { useState } from 'react';
import axios from 'axios';
import { Upload, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Admin = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, success, error
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus('idle');
    setMessage('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Ensure this matches your backend URL exactly
      await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus('success');
      setMessage('Database updated successfully! Dashboard is live.');
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Upload failed. Check server console.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Admin Portal</h2>
          <Link to="/" className="text-slate-400 hover:text-white flex items-center gap-2 text-sm">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>

        {/* Upload Box */}
        <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-blue-500 transition-colors bg-slate-900/50">
          <Upload className="mx-auto h-12 w-12 text-blue-500 mb-4" />
          <label className="block text-white font-medium mb-2 cursor-pointer">
            <span className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition">Select Excel File</span>
            <input 
              type="file" 
              className="hidden" 
              accept=".xlsx, .xls"
              onChange={handleFileChange} 
            />
          </label>
          <p className="text-slate-500 text-sm mt-2">
            {file ? file.name : "Supports .xlsx only"}
          </p>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file || status === 'uploading'}
          className={`w-full mt-6 py-3 rounded-lg font-bold transition-all ${
            !file 
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : status === 'uploading'
                ? 'bg-blue-800 text-blue-200 cursor-wait'
                : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20'
          }`}
        >
          {status === 'uploading' ? 'Processing Data...' : 'Upload & Sync Database'}
        </button>

        {/* Status Messages */}
        {status === 'success' && (
          <div className="mt-4 p-4 bg-green-900/30 border border-green-500/30 rounded-lg flex items-center gap-3 text-green-400">
            <CheckCircle size={20} />
            <p className="text-sm">{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-4 p-4 bg-red-900/30 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400">
            <AlertCircle size={20} />
            <p className="text-sm">{message}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;