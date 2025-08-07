import axios from "axios";

const MediaUpload = () => {
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("files", file));
      await axios.post("http://localhost:5000/api/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
  };

  return <input type="file" multiple onChange={handleUpload} />;
};

export default MediaUpload;
