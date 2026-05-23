import React, { useState } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const EMPTY_FORM = {
  name: "",
  dose: "",
  frequency: "",
  recipeNumber: "",
  notes: ""
};

export default function MedicationsTab({ medications }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const openNew = () => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit = (med) => { setEditing(med.id); setForm({ ...med }); setShowForm(true); };

  const handleSave = async () => {
    if (!form.name) return;
    try {
      if (editing) {
        await updateDoc(doc(db, "medications", editing), form);
      } else {
        await addDoc(collection(db, "medications"), form);
      }
      setShowForm(false);
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este medicamento?")) return;
    await deleteDoc(doc(db, "medications", id));
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-title">Medicación actual</div>
        <button className="btn btn-add" onClick={openNew}>+ Agregar</button>
      </div>

      {medications.length === 0 && (
        <div className="empty-state"><div className="big">💊</div>Sin medicación cargada</div>
      )}

      {medications.map(med => (
        <div key={med.id} className="card">
          <div className="card-row">
            <div className="card-icon">💊</div>
            <div className="card-body">
              <div className="card-title">{med.name} {med.dose && <span style={{ fontWeight: 400, fontSize: "0.88em" }}>— {med.dose}</span>}</div>
              <div className="card-meta">{med.frequency}</div>
              {med.notes && <div className="card-notes">📝 {med.notes}</div>}
              {med.recipeNumber && (
                <div className="card-notes" style={{ marginTop: "0.3rem" }}>
                  🧾 Receta N°: {med.recipeNumber}
                </div>
              )}
              <div className="card-actions">
                <button className="btn btn-outline" onClick={() => openEdit(med)}>Editar</button>
                <button className="btn btn-danger" onClick={() => handleDelete(med.id)}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal">
            <div className="modal-title">{editing ? "Editar medicamento" : "Nuevo medicamento"}</div>

            <div className="form-row">
              <div className="form-group">
                <label>Nombre *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ej: Lozacord" />
              </div>
              <div className="form-group">
                <label>Dosis</label>
                <input value={form.dose} onChange={e => setForm(f => ({ ...f, dose: e.target.value }))} placeholder="Ej: 50 mg" />
              </div>
            </div>

            <div className="form-group">
              <label>Frecuencia / Cómo tomarlo</label>
              <textarea
                value={form.frequency}
                onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}
                placeholder="Ej: 1 a la mañana + 1 a la noche. Si presión alta, agregar 1 al mediodía."
              />
            </div>

            <div className="form-group">
              <label>N° Receta PAMI</label>
              <input value={form.recipeNumber} onChange={e => setForm(f => ({ ...f, recipeNumber: e.target.value }))} placeholder="Ej: 8263150800926" />
            </div>

            <div className="form-group">
              <label>Notas</label>
              <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Ej: Cardiológico, tomar en ayunas..." />
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
