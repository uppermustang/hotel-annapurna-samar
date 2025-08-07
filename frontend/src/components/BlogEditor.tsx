import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import axios from "axios";

const BlogEditor = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const handleSave = async () => {
    await axios.post("http://localhost:5000/api/blog", { title, content });
    setContent("");
    setTitle("");
  };

  return (
    <div className="p-6">
      <h2>Blog Editor</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="border p-2 mb-2 w-full"
      />
      <ReactQuill value={content} onChange={setContent} />
      <button onClick={handleSave} className="btn-book-room mt-2">
        Save
      </button>
    </div>
  );
};

export default BlogEditor;
