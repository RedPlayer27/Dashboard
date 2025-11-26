import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "dashboard_todos";

export default function TodoWidget() {
  const [task, setTask] = useState("");
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse todos from localStorage", e);
      return [];
    }
  });

  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save todos to localStorage", e);
    }
  }, [items]);

  function handleAddTask(e) {
    e.preventDefault();
    const trimmed = task.trim();
    if (!trimmed) return;

    const newItem = {
      id: Date.now(),
      text: trimmed,
      completed: false,
    };

    setItems((prev) => [...prev, newItem]);
    setTask("");
  }

  function handleToggleComplete(id) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }

  function handleDelete(id) {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingText("");
    }
  }

  function startEditing(item) {
    setEditingId(item.id);
    setEditingText(item.text);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingText("");
  }

  function saveEditing(id) {
    const trimmed = editingText.trim();
    if (!trimmed) {
      handleDelete(id);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, text: trimmed } : item
      )
    );
    setEditingId(null);
    setEditingText("");
  }

  return (
    <div className="widget-card h-100">
  <h5 className="widget-title">To Do List</h5>

      <form onSubmit={handleAddTask} className="d-flex gap-2 mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Type a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button className="btn btn-primary">Add</button>
      </form>

      {items.length === 0 && (
        <p className="text-muted mb-0">No tasks yet.</p>
      )}

      <ul className="list-group mt-2">
        <AnimatePresence>
          {items.map((item) => (
            <motion.li
              key={item.id}
              className="list-group-item d-flex align-items-center justify-content-between"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              layout
            >
              <div className="d-flex align-items-center flex-grow-1 me-2">
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  checked={item.completed}
                  onChange={() => handleToggleComplete(item.id)}
                />

                {editingId === item.id ? (
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEditing(item.id);
                      if (e.key === "Escape") cancelEditing();
                    }}
                    autoFocus
                  />
                ) : (
                  <span
                    style={{
                      textDecoration: item.completed ? "line-through" : "none",
                      color: item.completed ? "#6c757d" : "inherit",
                    }}
                  >
                    {item.text}
                  </span>
                )}
              </div>

              <div className="btn-group btn-group-sm">
                {editingId === item.id ? (
                  <>
                    <button
                      className="btn btn-success"
                      onClick={() => saveEditing(item.id)}
                      type="button"
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={cancelEditing}
                      type="button"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => startEditing(item)}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleDelete(item.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
