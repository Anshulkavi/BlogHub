// src/components/common/CloudinaryUpload.js

import React, { useState } from "react";

const CloudinaryUpload = ({ onUpload, buttonText = "Upload" }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(""); // Clear previous errors
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first!");
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    // IMPORTANT: Make sure 'unsigned_preset' is your actual unsigned upload preset name in Cloudinary
    formData.append("upload_preset", "unsigned_preset"); 

    try {
      const response = await fetch(
        // IMPORTANT: Replace 'dmruk1niu' with your actual Cloudinary cloud name
        "https://api.cloudinary.com/v1_1/dmruk1niu/image/upload",
        { method: "POST", body: formData }
      );
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }
      
      // ✅ THE FIX: Send the secure_url from the response to the parent component
      if (onUpload) {
        onUpload(data.secure_url);
      }

    } catch (err) {
      console.error("Upload failed:", err);
      setError(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  // I've updated the JSX for better UI/UX
  return (
    <div className="flex flex-col gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex items-center gap-3">
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "Uploading..." : buttonText}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default CloudinaryUpload;