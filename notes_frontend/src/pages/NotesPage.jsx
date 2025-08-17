import React, { useCallback, useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import NoteCard from "../components/NoteCard";
import NoteEditorModal from "../components/NoteEditorModal";
import { createNote, deleteNote, getCategories, getNotes, getTags, updateNote } from "../services/api";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [n, t, c] = await Promise.all([
        getNotes({ search, tags: selectedTags, category: selectedCategory }),
        getTags(),
        getCategories(),
      ]);
      setNotes(Array.isArray(n) ? n : n?.items || []);
      setTags(Array.isArray(t) ? t : t?.items || []);
      setCategories(Array.isArray(c) ? c : c?.items || []);
    } catch (err) {
      setError(err?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [search, selectedTags, selectedCategory]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Debounce search input lightly for UX
  useEffect(() => {
    const id = setTimeout(() => {
      fetchAll();
    }, 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const onTagToggle = (tag) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };
  const onCategorySelect = (cat) => setSelectedCategory(cat);
  const onClearFilters = () => {
    setSelectedTags([]);
    setSelectedCategory("");
    setSearch("");
  };

  const openNewNote = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEditNote = (note) => {
    setEditing(note);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const handleSaveNote = async (noteData) => {
    try {
      if (noteData.id) {
        const saved = await updateNote(noteData.id, noteData);
        setNotes((prev) => prev.map((n) => (n.id === noteData.id ? saved : n)));
      } else {
        const created = await createNote(noteData);
        setNotes((prev) => [created, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      alert(err?.message || "Failed to save note");
    }
  };

  const handleDeleteNote = async (note) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await deleteNote(note.id);
      setNotes((prev) => prev.filter((n) => n.id !== note.id));
    } catch (err) {
      alert(err?.message || "Failed to delete note");
    }
  };

  const emptyState = useMemo(() => {
    if (loading) return "Loading notes...";
    if (error) return error;
    return "No notes found. Create your first note!";
  }, [loading, error]);

  return (
    <div className="app-shell">
      <Header onSearch={setSearch} onNewNote={openNewNote} />
      <div className="app-body">
        <Sidebar
          tags={tags}
          categories={categories}
          selectedTags={selectedTags}
          selectedCategory={selectedCategory}
          onTagToggle={onTagToggle}
          onCategorySelect={onCategorySelect}
          onClearFilters={onClearFilters}
        />

        <main className="content">
          {loading ? (
            <div className="empty muted">{emptyState}</div>
          ) : notes.length === 0 ? (
            <div className="empty muted">{emptyState}</div>
          ) : (
            <section className="notes-grid">
              {notes.map((note) => (
                <NoteCard key={note.id} note={note} onEdit={openEditNote} onDelete={handleDeleteNote} />
              ))}
            </section>
          )}
        </main>
      </div>

      <NoteEditorModal open={modalOpen} initialNote={editing} onCancel={closeModal} onSave={handleSaveNote} />
    </div>
  );
}
