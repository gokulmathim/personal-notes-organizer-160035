import React, { useEffect, useState } from "react";

export default function NoteEditorModal({ open, initialNote, onCancel, onSave }) {
  const [title, setTitle] = useState(initialNote?.title || "");
  const [content, setContent] = useState(initialNote?.content || "");
  const [tags, setTags] = useState((initialNote?.tags || []).join(", "));
  const [category, setCategory] = useState(initialNote?.category || "");

  useEffect(() => {
    setTitle(initialNote?.title || "");
    setContent(initialNote?.content || "");
    setTags((initialNote?.tags || []).join(", "));
    setCategory(initialNote?.category || "");
  }, [initialNote, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onSave?.({
      ...(initialNote || {}),
      title,
      content,
      tags: cleanedTags,
      category: category.trim(),
    });
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-head">
          <h3>{initialNote?.id ? "Edit Note" : "New Note"}</h3>
          <button className="icon-btn" onClick={onCancel} aria-label="Close">✖</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <label>
            <span>Title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
          </label>

          <label>
            <span>Content</span>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} placeholder="Write your note..." />
          </label>

          <label>
            <span>Category</span>
            <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Personal" />
          </label>

          <label>
            <span>Tags</span>
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="comma, separated, tags" />
          </label>

          <div className="modal-actions">
            <button type="button" className="btn subtle" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn primary">{initialNote?.id ? "Save Changes" : "Create Note"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
