import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";

const PageEditor = () => {
  const [content, setContent] = useState("");

  const handleSave = () => {
    // Save to local state or API (implement backend route if needed)
    console.log("Page content saved:", content);
  };

  return (
    <div className="p-6">
      <h2>Page Editor</h2>
      <ReactQuill value={content} onChange={setContent} />
      <button onClick={handleSave} className="btn-book-room mt-2">
        Save Page
      </button>
    </div>
  );
};

export default PageEditor;
