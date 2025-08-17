import React from "react";

export default function NoteCard({ note, onEdit, onDelete }) {
  const { id, title, content, tags = [], category = "", updatedAt } = note;

  const snippet = content?.length > 160 ? `${content.slice(0, 160)}…` : content;

  return (
    <article className="note-card" data-id={id}>
      <div className="note-card-head">
        <h3 title={title}>{title || "Untitled"}</h3>
        <div className="note-card-actions">
          <button className="icon-btn" onClick={() => onEdit?.(note)} aria-label="Edit note">✏️</button>
          <button className="icon-btn danger" onClick={() => onDelete?.(note)} aria-label="Delete note">🗑️</button>
        </div>
      </div>
      <div className="note-card-meta">
        {category ? <span className="badge">{category}</span> : null}
        <time className="muted" dateTime={updatedAt || ""}>
          {updatedAt ? new Date(updatedAt).toLocaleString() : ""}
        </time>
      </div>
      <p className="note-card-content">{snippet}</p>
      <div className="note-card-tags">
        {tags.map((t) => (
          <span className="tag small" key={t}>#{t}</span>
        ))}
      </div>
    </article>
  );
}
