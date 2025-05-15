'use client'

import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const FileUploader = () => {
  const [excelData, setExcelData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid Excel file (.xls or .xlsx).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      setExcelData(data);
      setFileName(file.name);
      setFileUploaded(true);
    };
    reader.readAsBinaryString(file);
  };

  const handleProcess = () => {
    alert('Processing the BOM data...');
    console.log('Excel data:', excelData);
    // Add processing logic here
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white/60 backdrop-blur-md shadow-xl border border-gray-200 rounded-3xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-1">Pre-BOM Cost Calculator</h1>
          <p className="text-gray-600 text-sm">
            Upload your Excel-based Bill of Materials to preview and calculate manufacturing costs.
          </p>
        </div>
        {fileUploaded && (
          <button
            onClick={handleProcess}
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-2 rounded-lg shadow hover:scale-105 hover:shadow-md transition transform duration-200"
          >
            🚀 Process Data
          </button>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700">Upload Excel File</label>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg file:bg-blue-100 file:text-blue-700 file:border-0 file:mr-4 file:px-4 file:py-2 hover:file:bg-blue-200 transition"
        />
      </div>

      {fileUploaded && (
        <div>
          <div className="flex justify-between items-center mt-8 mb-3">
            <h2 className="text-lg font-semibold text-gray-800">📄 Preview of: {fileName}</h2>
          </div>

          <div className="overflow-auto max-h-[400px] rounded-lg border border-gray-200">
            <table className="min-w-full border-collapse text-sm text-left text-gray-700">
              <thead className="bg-blue-50 sticky top-0 z-10 text-gray-800 text-xs uppercase tracking-wide">
                {excelData[0] && (
                  <tr>
                    {excelData[0].map((header, i) => (
                      <th key={i} className="border px-4 py-3 font-semibold">
                        {header || `Column ${i + 1}`}
                      </th>
                    ))}
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-gray-100">
                {excelData.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-blue-50 transition">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-2 border">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
