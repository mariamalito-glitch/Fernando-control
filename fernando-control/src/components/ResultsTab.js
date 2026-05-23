import React, { useState } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const STATUS_LABELS = {
  available: { label: "Disponible", badge: "badge-available", icon: "✅" },
  pending:   { label: "Pendiente resultado", badge: "badge-warning", icon: "⏳" },
  not_done:  { label: "No realizado aún", badge: "badge-not_done", icon: "⭕" }
};

const EMPTY_FORM = {
  study: "",
  date: "",
  status: "not_done",
  summary: "",
  fileUrl: ""
};

export default function ResultsTab({ results }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const sorted = [...results].sort((a, b) => {
    const order = { available: 0, pending: 1, not_done: 2 };
    return (order[a.status] ?? 3) - (order[b.status] ?? 3) || a.date.localeCompare(b.date);
  });

  const openNew = () => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit = (r) => { setEditing(r.id); setForm({ ...r }); setShowForm(true); };

  const handleSave = async () => {
    if (!form.study) return;
    try {
      if (editing) {
        await updateDoc(doc(db, "results", editing), form);
      } else {
        await addDoc(collection(db, "results"), form);
      }
      setShowForm(false);
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar?")) return;
    await deleteDoc(doc(db, "results", id));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
    return `${d} ${months[parseInt(m)-1]} ${y}`;
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-title">Resultados de estudios</div>
        <button className="btn btn-add" onClick={openNew}>+ Agregar</button>
      </div>

      {sorted.length === 0 && (
        <div className="empty-state"><div className="big">🔬</div>Sin resultados cargados</div>
      )}

      {sorted.map(r => {
        const s = STATUS_LABELS[r.status] || STATUS_LABELS.not_done;
        return (
          <div key={r.id} className="card">
            <div className="card-row">
              <div className="card-icon">{s.icon}</div>
              <div className="card-body">
                <div className="card-title">{r.study}</div>
                <div className="card-meta">
                  {r.date && <><strong>{formatDate(r.date)}</strong> · </>}
                  <span className={`badge ${s.badge}`}>{s.label}</span>
                </div>
                {r.summary && <div className="card-notes">{r.summary}</div>}
                {r.fileUrl && (
                  <div className="card-notes">
                    📎 <a href={r.fileUrl} target="_blank" rel="noopener noreferrer">Ver archivo</a>
                  </div>
                )}
                <div className="card-actions">
                  <button className="btn btn-outline" onClick={() => openEdit(r)}>Editar</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(r.id)}>Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal">
            <div className="modal-title">{editing ? "Editar resultado" : "Nuevo resultado"}</div>

            <div className="form-group">
              <label>Estudio / Análisis *</label>
              <input value={form.study} onChange={e => setForm(f => ({ ...f, study: e.target.value }))} placeholder="Ej: Ecodoppler Renal" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Fecha</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="available">✅ Disponible</option>
                  <option value="pending">⏳ Pendiente resultado</option>
                  <option value="not_done">⭕ No realizado aún</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Resumen / Interpretación</label>
              <textarea
                value={form.summary}
                onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
                placeholder="Ej: Sin hallazgos graves. Pendiente revisión médica."
              />
            </div>

            <div className="form-group">
              <label>Link al archivo (opcional)</label>
              <input value={form.fileUrl} onChange={e => setForm(f => ({ ...f, fileUrl: e.target.value }))} placeholder="https://..." />
            </div>

            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave}>{editing ? "Guardar" : "Agregar"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
