import React, { useState, useEffect } from "react";
import { db } from "./lib/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  orderBy,
  query
} from "firebase/firestore";
import { seedData } from "./lib/seedData";
import AppointmentsTab from "./components/AppointmentsTab";
import MedicationsTab from "./components/MedicationsTab";
import ResultsTab from "./components/ResultsTab";
import OrdersTab from "./components/OrdersTab";
import "./App.css";

export default function App() {
  const [tab, setTab] = useState("turnos");
  const [appointments, setAppointments] = useState([]);
  const [medications, setMedications] = useState([]);
  const [results, setResults] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    const unsubs = [];

    const qApt = query(collection(db, "appointments"), orderBy("date", "asc"));
    unsubs.push(onSnapshot(qApt, snap => {
      setAppointments(snap.docs.map(d => ({ ...d.data(), id: d.id })));
      setLoading(false);
    }));

    unsubs.push(onSnapshot(collection(db, "medications"), snap => {
      setMedications(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    }));

    unsubs.push(onSnapshot(collection(db, "results"), snap => {
      setResults(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    }));

    unsubs.push(onSnapshot(collection(db, "orders"), snap => {
      setOrders(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    }));

    return () => unsubs.forEach(u => u());
  }, []);

  const handleSeed = async () => {
    if (!window.confirm("¿Cargar los datos iniciales de Fernando? Solo hacer esto una vez.")) return;
    setSeeding(true);
    await seedData();
    setSeeding(false);
  };

  const today = new Date().toISOString().split("T")[0];
  const upcomingToday = appointments.filter(a => a.date === today && a.status !== "done");
  const nextUpcoming = appointments
    .filter(a => a.date > today && a.status === "upcoming")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  const tabs = [
    { id: "turnos", label: "📅 Turnos", count: appointments.filter(a => a.status === "upcoming").length },
    { id: "medicacion", label: "💊 Medicación", count: medications.length },
    { id: "resultados", label: "🔬 Resultados", count: results.filter(r => r.status === "available").length },
    { id: "ordenes", label: "📋 Órdenes", count: orders.filter(o => o.status === "pending").length },
  ];

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div>
            <div className="header-label">Seguimiento médico</div>
            <h1>Fernando Malito</h1>
            <div className="header-sub">Afil. PAMI 140059134205/00</div>
          </div>
          {appointments.length === 0 && !loading && (
            <button className="btn-seed" onClick={handleSeed} disabled={seeding}>
              {seeding ? "Cargando..." : "⚡ Cargar datos iniciales"}
            </button>
          )}
        </div>

        {upcomingToday.length > 0 && (
          <div className="today-alert">
            {upcomingToday.map(apt => (
              <div key={apt.id} className="today-item">
                <span className="today-dot" />
                <strong>HOY {apt.time}</strong> — {apt.title} · {apt.location}
              </div>
            ))}
          </div>
        )}

        {nextUpcoming.length > 0 && (
          <div className="next-strip">
            {nextUpcoming.map(apt => (
              <div key={apt.id} className="next-chip">
                <span>{apt.date.split("-").reverse().join("/")}</span>
                <span>{apt.title}</span>
              </div>
            ))}
          </div>
        )}
      </header>

      <nav className="tab-nav">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`tab-btn ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {t.count > 0 && <span className="tab-count">{t.count}</span>}
          </button>
        ))}
      </nav>

      <main className="main-content">
        {loading ? (
          <div className="loading">Cargando datos...</div>
        ) : (
          <>
            {tab === "turnos" && (
              <AppointmentsTab appointments={appointments} db={db} today={today} />
            )}
            {tab === "medicacion" && (
              <MedicationsTab medications={medications} db={db} />
            )}
            {tab === "resultados" && (
              <ResultsTab results={results} db={db} />
            )}
            {tab === "ordenes" && (
              <OrdersTab orders={orders} db={db} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
