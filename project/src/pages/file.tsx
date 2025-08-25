import React, { useState } from "react";

const FileUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      console.log(formData);

      const data = await response.json();

      if (response.status === 200) {
        setUploadStatus("✅ File uploaded successfully!");
        setUploadedFileUrl(`http://localhost:3000${data.fileUrl}`);
      } else {
        setUploadStatus("❌ Upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("⚠️ Error uploading file.");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h2>Upload a File</h2>
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        style={{ marginTop: "1rem" }}
        disabled={!selectedFile}
      >
        Upload
      </button>
      {uploadStatus && <p>{uploadStatus}</p>}
      {uploadedFileUrl && (
        <div style={{ marginTop: "1rem" }}>
          <p>Preview:</p>
          {/* If it's an image, show preview */}
          {selectedFile?.type.startsWith("image/") ? (
            <img
              src={uploadedFileUrl}
              alt="Uploaded"
              style={{ maxWidth: "100%", marginTop: "1rem" }}
            />
          ) : (
            <a href={uploadedFileUrl} target="_blank" rel="noreferrer">
              View Uploaded File
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
