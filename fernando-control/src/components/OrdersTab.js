import React, { useState } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const STATUS_LABELS = {
  pending: { label: "Vigente", badge: "badge-available", icon: "📋" },
  used:    { label: "Utilizada", badge: "badge-not_done", icon: "✅" },
  expired: { label: "Vencida", badge: "badge-warning", icon: "⚠️" }
};

const EMPTY_FORM = {
  study: "",
  orderNumber: "",
  issuedDate: "",
  expiryDate: "",
  status: "pending",
  notes: ""
};

export default function OrdersTab({ orders }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const sorted = [...orders].sort((a, b) => {
    const order = { pending: 0, used: 1, expired: 2 };
    return (order[a.status] ?? 3) - (order[b.status] ?? 3);
  });

  const openNew = () => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit = (o) => { setEditing(o.id); setForm({ ...o }); setShowForm(true); };

  const handleSave = async () => {
    if (!form.study) return;
    try {
      if (editing) {
        await updateDoc(doc(db, "orders", editing), form);
      } else {
        await addDoc(collection(db, "orders"), form);
      }
      setShowForm(false);
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta orden?")) return;
    await deleteDoc(doc(db, "orders", id));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
    const [y, m, d] = parts.split("-");
    const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
    return `${d} ${months[parseInt(m)-1]} ${y}`;
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-title">Órdenes PAMI</div>
        <button className="btn btn-add" onClick={openNew}>+ Agregar</button>
      </div>

      {sorted.length === 0 && (
        <div className="empty-state"><div className="big">📋</div>Sin órdenes cargadas</div>
      )}

      {sorted.map(o => {
        const s = STATUS_LABELS[o.status] || STATUS_LABELS.pending;
        return (
          <div key={o.id} className="card">
            <div className="card-row">
              <div className="card-icon">{s.icon}</div>
              <div className="card-body">
                <div className="card-title">{o.study}</div>
                <div className="card-meta">
                  <span className={`badge ${s.badge}`}>{s.label}</span>
                  {o.orderNumber && <> · <strong>N° {o.orderNumber}</strong></>}
                </div>
                <div className="card-meta" style={{ marginTop: "0.2rem" }}>
                  {o.issuedDate && <>Emitida: {formatDate(o.issuedDate)}</>}
                  {o.expiryDate && <> · Vence: {formatDate(o.expiryDate)}</>}
                </div>
                {o.notes && <div className="card-notes">{o.notes}</div>}
                <div className="card-actions">
                  {o.status === "pending" && (
                    <button className="btn btn-success" onClick={async () => {
                      await updateDoc(doc(db, "orders", o.id), { status: "used" });
                    }}>✓ Marcar como usada</button>
                  )}
                  <button className="btn btn-outline" onClick={() => openEdit(o)}>Editar</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(o.id)}>Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal">
            <div className="modal-title">{editing ? "Editar orden" : "Nueva orden"}</div>

            <div className="form-group">
              <label>Estudio / Especialidad *</label>
              <input value={form.study} onChange={e => setForm(f => ({ ...f, study: e.target.value }))} placeholder="Ej: Consulta con Especialista en Cardiología" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>N° Orden PAMI</label>
                <input value={form.orderNumber} onChange={e => setForm(f => ({ ...f, orderNumber: e.target.value }))} placeholder="Ej: 3326220963084" />
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="pending">Vigente</option>
                  <option value="used">Utilizada</option>
                  <option value="expired">Vencida</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Fecha emisión</label>
                <input type="date" value={form.issuedDate} onChange={e => setForm(f => ({ ...f, issuedDate: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Fecha vencimiento</label>
                <input type="date" value={form.expiryDate} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))} />
              </div>
            </div>

            <div className="form-group">
              <label>Notas</label>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Ej: Turno asignado para el 10/06..." />
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
