import React, { useState } from "react";

const CloudinaryUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");

    // Preview on Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_preset");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dmruk1niu/image/upload",
        { method: "POST", body: formData }
      );
      const data = await response.json();

      setImageUrl(data.secure_url); // show preview
      if (onUpload) onUpload(file); // send the **File object** to parent for backend PATCH
      alert("Upload successful!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Check console for details.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h2>Upload Image to Cloudinary</h2>
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        style={{ display: "block", marginTop: "10px" }}
      >
        Upload
      </button>

      {imageUrl && (
        <div style={{ marginTop: "20px" }}>
          <p>Preview:</p>
          <img src={imageUrl} alt="Uploaded" style={{ width: "100%" }} />
        </div>
      )}
    </div>
  );
};

export default CloudinaryUpload;
