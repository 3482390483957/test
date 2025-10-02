import { useState } from "react";
import type { ChangeEvent } from "react";


export default function ImageUploader() {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch("https://test-n2mi.onrender.com/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        alert("Error converting image");
        setLoading(false);
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "bw_image.png";
      link.click();
    } catch (error) {
      console.error(error);
      alert("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Black & White Image Converter</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={inputStyle}
      />
      <button
        onClick={handleUpload}
        style={buttonStyle}
        disabled={loading || !image}
      >
        {loading ? "Converting..." : "Convert to B&W"}
      </button>
      {image && <p style={fileNameStyle}>Selected: {image.name}</p>}
    </div>
  );
}

// ----- Inline styles -----
const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  gap: "20px",
  fontFamily: "Arial, sans-serif",
  backgroundColor: "#f5f5f5",
  padding: "20px",
};

const titleStyle: React.CSSProperties = {
  color: "#333",
};

const inputStyle: React.CSSProperties = {
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  cursor: "pointer",
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 20px",
  borderRadius: "5px",
  border: "none",
  backgroundColor: "#4CAF50",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

const fileNameStyle: React.CSSProperties = {
  color: "#555",
  fontSize: "0.9rem",
};
