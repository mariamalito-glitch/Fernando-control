import React, { useState } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const TYPE_ICONS = {
  consulta: "🏥",
  estudio: "🔬",
  laboratorio: "🩸",
  otro: "📌"
};

const TYPE_LABELS = {
  consulta: "Consulta",
  estudio: "Estudio",
  laboratorio: "Laboratorio",
  otro: "Otro"
};

const STATUS_BADGE = {
  done: "badge-done",
  upcoming: "badge-upcoming",
  today: "badge-today"
};

const EMPTY_FORM = {
  type: "consulta",
  title: "",
  date: "",
  time: "",
  location: "",
  address: "",
  status: "upcoming",
  notes: "",
  quien: "",
  orderNumber: ""
};

export default function AppointmentsTab({ appointments, today }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const done = appointments.filter(a => a.status === "done").sort((a, b) => b.date.localeCompare(a.date));
  const upcoming = appointments.filter(a => a.status === "upcoming" || a.status === "today").sort((a, b) => a.date.localeCompare(b.date));

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (apt) => {
    setEditing(apt.id);
    setForm({ ...apt });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.date) return;
    const data = { ...form };
    if (data.date === today && data.status === "upcoming") data.status = "upcoming";
    try {
      if (editing) {
        await updateDoc(doc(db, "appointments", editing), data);
      } else {
        await addDoc(collection(db, "appointments"), data);
      }
      setShowForm(false);
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este turno?")) return;
    await deleteDoc(doc(db, "appointments", id));
  };

  const handleMarkDone = async (id) => {
    await updateDoc(doc(db, "appointments", id), { status: "done" });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
    return `${d} ${months[parseInt(m)-1]} ${y}`;
  };

  const isToday = (dateStr) => dateStr === today;
  const isPast = (dateStr) => dateStr < today;

  return (
    <div>
      <div className="section-header">
        <div className="section-title">Próximos turnos</div>
        <button className="btn btn-add" onClick={openNew}>+ Agregar</button>
      </div>

      {upcoming.length === 0 && (
        <div className="empty-state"><div className="big">📅</div>No hay turnos próximos</div>
      )}

      {upcoming.map(apt => (
        <div key={apt.id} className="card" style={isToday(apt.date) ? { borderLeft: "3px solid #8b3030" } : {}}>
          <div className="card-row">
            <div className="card-icon">{TYPE_ICONS[apt.type] || "📌"}</div>
            <div className="card-body">
              <div className="card-title">{apt.title}</div>
              <div className="card-meta">
                <strong>{formatDate(apt.date)}{apt.time ? ` — ${apt.time} hs` : ""}</strong>
                {apt.location && <> · {apt.location}</>}
                {apt.quien && <> · <em>Acompaña: {apt.quien}</em></>}
              </div>
              {apt.notes && <div className="card-notes">{apt.notes}</div>}
              <div className="card-actions">
                {isToday(apt.date) && <span className="badge badge-today">HOY</span>}
                <span className="badge badge-upcoming">{TYPE_LABELS[apt.type]}</span>
                <button className="btn btn-success" onClick={() => handleMarkDone(apt.id)}>✓ Realizado</button>
                <button className="btn btn-outline" onClick={() => openEdit(apt)}>Editar</button>
                <button className="btn btn-danger" onClick={() => handleDelete(apt.id)}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {done.length > 0 && (
        <>
          <div className="divider-label">Realizados</div>
          {done.map(apt => (
            <div key={apt.id} className="card" style={{ opacity: 0.75 }}>
              <div className="card-row">
                <div className="card-icon">{TYPE_ICONS[apt.type] || "📌"}</div>
                <div className="card-body">
                  <div className="card-title">{apt.title}</div>
                  <div className="card-meta">
                    <strong>{formatDate(apt.date)}{apt.time ? ` — ${apt.time} hs` : ""}</strong>
                    {apt.location && <> · {apt.location}</>}
                    {apt.quien && <> · <em>Acompañó: {apt.quien}</em></>}
                  </div>
                  {apt.notes && <div className="card-notes">{apt.notes}</div>}
                  <div className="card-actions">
                    <span className="badge badge-done">✓ Realizado</span>
                    <button className="btn btn-outline" onClick={() => openEdit(apt)}>Editar</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(apt.id)}>Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal">
            <div className="modal-title">{editing ? "Editar turno" : "Nuevo turno"}</div>

            <div className="form-row">
              <div className="form-group">
                <label>Tipo</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  <option value="consulta">🏥 Consulta</option>
                  <option value="estudio">🔬 Estudio</option>
                  <option value="laboratorio">🩸 Laboratorio</option>
                  <option value="otro">📌 Otro</option>
                </select>
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="upcoming">Próximo</option>
                  <option value="done">Realizado</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Título / Especialidad *</label>
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Ej: Cardiólogo, Ecodoppler renal..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Fecha *</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Hora</label>
                <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
              </div>
            </div>

            <div className="form-group">
              <label>Lugar / Centro médico</label>
              <input
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                placeholder="Ej: Centro Médico Dra. Raya — Talcahuano 750"
              />
            </div>

            <div className="form-group">
              <label>Dirección completa</label>
              <input
                value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                placeholder="Ej: Talcahuano 750, piso 11 B, CABA"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Acompaña</label>
                <input
                  value={form.quien}
                  onChange={e => setForm(f => ({ ...f, quien: e.target.value }))}
                  placeholder="Ej: Maru, Bruno..."
                />
              </div>
              <div className="form-group">
                <label>N° Orden PAMI</label>
                <input
                  value={form.orderNumber}
                  onChange={e => setForm(f => ({ ...f, orderNumber: e.target.value }))}
                  placeholder="Ej: 3326220963084"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notas / Instrucciones</label>
              <textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Ej: Ayuno 8 hs, llevar DNI y credencial..."
              />
            </div>

            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editing ? "Guardar cambios" : "Agregar turno"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
