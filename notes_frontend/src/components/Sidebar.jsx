import React from "react";

export default function Sidebar({
  tags = [],
  categories = [],
  selectedTags = [],
  selectedCategory = "",
  onTagToggle,
  onCategorySelect,
  onClearFilters,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="section-head">
          <h4>Filters</h4>
          <button className="btn subtle" onClick={onClearFilters}>Clear</button>
        </div>
      </div>

      <div className="sidebar-section">
        <h5>Categories</h5>
        <ul className="list">
          <li
            className={!selectedCategory ? "active" : ""}
            onClick={() => onCategorySelect("")}
          >
            All
          </li>
          {categories.map((cat) => (
            <li
              key={cat}
              className={selectedCategory === cat ? "active" : ""}
              onClick={() => onCategorySelect(cat)}
            >
              {cat}
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-section">
        <h5>Tags</h5>
        <div className="tags">
          {tags.map((t) => {
            const active = selectedTags.includes(t);
            return (
              <button
                key={t}
                className={`tag ${active ? "active" : ""}`}
                onClick={() => onTagToggle(t)}
              >
                #{t}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
