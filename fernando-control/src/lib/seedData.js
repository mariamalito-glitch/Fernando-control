// Run this ONCE to seed Firebase with initial data
// You can call seedData() from the browser console or from App.js temporarily

import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

export const initialAppointments = [
  // ── REALIZADOS ──
  {
    id: "apt-001",
    type: "consulta",
    title: "Control Clínico (Médica de cabecera)",
    date: "2026-04-28",
    time: "18:30",
    location: "PAMI / Clínica general",
    address: "",
    status: "done",
    notes: "Reveló estudios críticos de epicrisis de guardia. Derivaciones a 4 especialidades. Presión 159/100.",
    quien: "",
    orderNumber: ""
  },
  {
    id: "apt-002",
    type: "estudio",
    title: "Electrocardiograma",
    date: "2026-04-30",
    time: "14:00",
    location: "Monroe 5163, 2° piso",
    address: "Av. Monroe 5163, CABA",
    status: "done",
    notes: "Resultado cargado en sistema Raya online. El cardiólogo lo evaluará en la próxima consulta.",
    quien: "",
    orderNumber: ""
  },
  {
    id: "apt-003",
    type: "consulta",
    title: "Endocrinólogo",
    date: "2026-04-29",
    time: "18:00",
    location: "Monroe 5163, 2° piso",
    address: "Av. Monroe 5163, CABA",
    status: "done",
    notes: "Acompañó Maru. Ajuste Levotiroxina 125. Inicio tratamiento tiroides. Indicó análisis a las 6 semanas.",
    quien: "Maru",
    orderNumber: "3326223329337"
  },
  {
    id: "apt-004",
    type: "consulta",
    title: "Cardiólogo (1° consulta)",
    date: "2026-05-06",
    time: "17:40",
    location: "Centro Médico Dra. Raya — Talcahuano 750, piso 11 B",
    address: "Talcahuano 750, piso 11 B, CABA",
    status: "done",
    notes: "Acompañó Maru. No evaluó ECG en profundidad (periodo corto). Indicó Holter. Próxima consulta luego del Ecodoppler.",
    quien: "Maru",
    orderNumber: ""
  },
  {
    id: "apt-005",
    type: "estudio",
    title: "Ecodoppler Renal Bilateral",
    date: "2026-05-13",
    time: "10:00",
    location: "Diagnóstico Moldes — Moldes 1785, PB",
    address: "Moldes 1785, Planta Baja, CABA",
    status: "done",
    notes: "8 hs de ayuno. Sin hallazgos graves. Confirmación pendiente con nefrólogo.",
    quien: "",
    orderNumber: ""
  },
  {
    id: "apt-006",
    type: "consulta",
    title: "Urólogo (1° consulta)",
    date: "2026-05-14",
    time: "17:40",
    location: "Centro Médico Dra. Raya — Talcahuano 750, piso 11 B",
    address: "Talcahuano 750, piso 11 B, CABA",
    status: "done",
    notes: "Acompañó Bruno. PSA 8 (zona gris). Indicó eco + lab prostático + flujometría. El resto OK.",
    quien: "Bruno",
    orderNumber: "3326249785278"
  },
  {
    id: "apt-007",
    type: "laboratorio",
    title: "Antígeno Prostático Específico Libre y Total",
    date: "2026-05-16",
    time: "08:10",
    location: "Bavasso — Boyacá 877",
    address: "Boyacá 877, CABA",
    status: "done",
    notes: "Lab prostático. Ya realizado.",
    quien: "",
    orderNumber: "3326249785292"
  },
  {
    id: "apt-008",
    type: "laboratorio",
    title: "Aldosterona + Renina-Angiotensina",
    date: "2026-05-18",
    time: "08:10",
    location: "Bavasso — Boyacá 877",
    address: "Boyacá 877, CABA",
    status: "done",
    notes: "Lab cardiológico / renal. Ya realizado.",
    quien: "",
    orderNumber: "3326223324875"
  },
  {
    id: "apt-009",
    type: "estudio",
    title: "Ecodoppler Cardíaco",
    date: "2026-05-23",
    time: "10:45",
    location: "Av. Directorio 1867",
    address: "Av. Directorio 1867, CABA",
    status: "done",
    notes: "Realizado hoy. Resultado esperado para consulta cardiólogo 10/06.",
    quien: "",
    orderNumber: "3326234449468"
  },
  // ── PRÓXIMOS ──
  {
    id: "apt-010",
    type: "consulta",
    title: "Nefrología",
    date: "2026-05-29",
    time: "08:00",
    location: "Av. Directorio 3269",
    address: "Av. Directorio 3269, CABA",
    status: "upcoming",
    notes: "Revisará resultados del Ecodoppler Renal y análisis de laboratorio.",
    quien: "",
    orderNumber: "3326220966290"
  },
  {
    id: "apt-011",
    type: "estudio",
    title: "Holter Cardíaco 3 canales 24 hs",
    date: "2026-06-01",
    time: "10:00",
    location: "Centro Médico Dra. Raya — Fray Cayetano Rodríguez 368",
    address: "Fray Cayetano Rodríguez 368, CABA",
    status: "upcoming",
    notes: "Llevar 2 pilas doble AA. Devolver dispositivo al día siguiente a las 9 hs.",
    quien: "",
    orderNumber: "3326234449482"
  },
  {
    id: "apt-012",
    type: "estudio",
    title: "Ecografía Prostática",
    date: "2026-06-04",
    time: "12:00",
    location: "Centro Médico Dra. Raya — Fray Cayetano Rodríguez 368",
    address: "Fray Cayetano Rodríguez 368, CABA",
    status: "upcoming",
    notes: "Ayuno 6-8 hs y retener 1 litro de agua.",
    quien: "",
    orderNumber: "3326249785261"
  },
  {
    id: "apt-013",
    type: "estudio",
    title: "Ecografía Renal Bilateral + Vesical",
    date: "2026-06-04",
    time: "12:00",
    location: "Centro Médico Dra. Raya — Av. Monroe 5163",
    address: "Av. Monroe 5163, CABA",
    status: "upcoming",
    notes: "Ayuno 6-8 hs y retener 1 litro de agua. Órdenes 3326249785247 (renal) y 3326249785254 (vesical).",
    quien: "",
    orderNumber: "3326249785247"
  },
  {
    id: "apt-014",
    type: "consulta",
    title: "Cardiólogo (2° consulta) + Lab Endocrinológico",
    date: "2026-06-10",
    time: "17:40",
    location: "Centro Médico Dra. Raya — Talcahuano 750, piso 11 B",
    address: "Talcahuano 750, piso 11 B, CABA",
    status: "upcoming",
    notes: "6 semanas desde inicio Levotiroxina. Lab endocrinológico ESE DÍA en Boyacá 877 (10 hs de ayuno, de 8 a 11 hs). Llevar resultados de Holter y Ecodoppler.",
    quien: "",
    orderNumber: ""
  },
  {
    id: "apt-015",
    type: "consulta",
    title: "Urólogo (2° consulta)",
    date: "2026-07-06",
    time: "16:30",
    location: "Centro Médico Dra. Raya — Av. Monroe 5163",
    address: "Av. Monroe 5163, CABA",
    status: "upcoming",
    notes: "Con resultados de eco + lab prostático.",
    quien: "",
    orderNumber: "3326249785278"
  },
  {
    id: "apt-016",
    type: "estudio",
    title: "Flujometría Urinaria Computarizada",
    date: "2026-07-06",
    time: "16:30",
    location: "Centro Médico Dra. Raya — Av. Monroe 5163",
    address: "Av. Monroe 5163, CABA",
    status: "upcoming",
    notes: "Tomar 1 litro de agua antes y retener.",
    quien: "",
    orderNumber: "3326249785285"
  }
];

export const initialMedications = [
  {
    id: "med-001",
    name: "Lozacord",
    dose: "50 mg",
    frequency: "1 a la mañana + 1 a la noche. Si presión alta, agregar 1 al mediodía.",
    recipeNumber: "",
    notes: "Antihipertensivo"
  },
  {
    id: "med-002",
    name: "Terloc",
    dose: "5 mg",
    frequency: "1 al mediodía o cuando tenga presión alta.",
    recipeNumber: "8263150800926 / 8263150801022 / 8263150801077",
    notes: "Cardiológico"
  },
  {
    id: "med-003",
    name: "Vasotenal EZ",
    dose: "10 mg",
    frequency: "1 después de cenar.",
    recipeNumber: "8262989770240",
    notes: "Antihipertensivo"
  },
  {
    id: "med-004",
    name: "Isobloc",
    dose: "",
    frequency: "Según indicación.",
    recipeNumber: "8262989770240",
    notes: "Cardiológico"
  },
  {
    id: "med-005",
    name: "Levotiroxina GSK",
    dose: "125 mcg",
    frequency: "1 diaria (en ayunas, mañana).",
    recipeNumber: "8263155565530 / 8263155565578 / 8263155565646",
    notes: "Tiroides. Control analítico 10/06 (6 semanas desde inicio)."
  }
];

export const initialOrders = [
  {
    id: "ord-001",
    study: "Ecodoppler Cardíaco / Ecocardiograma Doppler",
    orderNumber: "3326234449468",
    issuedDate: "2026-05-06",
    expiryDate: "2026-10-03",
    status: "used",
    notes: "Realizado 23/05"
  },
  {
    id: "ord-002",
    study: "Ecodoppler de Aorta Torácica",
    orderNumber: "3326234449475",
    issuedDate: "2026-05-06",
    expiryDate: "2026-10-03",
    status: "pending",
    notes: "Sin turno asignado aún. Vence 03/10/2026."
  },
  {
    id: "ord-003",
    study: "Consulta con Especialista en Endocrinología",
    orderNumber: "3326223329337",
    issuedDate: "2026-04-29",
    expiryDate: "2026-09-26",
    status: "used",
    notes: "Usado en consulta 29/04"
  },
  {
    id: "ord-004",
    study: "Tirotrofina Sérica (TSH) + Tiroxina Efectiva",
    orderNumber: "3326223324868",
    issuedDate: "2026-04-29",
    expiryDate: "2026-09-26",
    status: "pending",
    notes: "Lab endocrinológico. Hacer el 10/06 en Boyacá 877."
  },
  {
    id: "ord-005",
    study: "Consulta con Especialista en Nefrología",
    orderNumber: "3326220966290",
    issuedDate: "2026-04-28",
    expiryDate: "2026-09-25",
    status: "pending",
    notes: "Turno 29/05 a las 8 hs — Av. Directorio 3269."
  },
  {
    id: "ord-006",
    study: "Consulta con Especialista en Cardiología (incluye ECG)",
    orderNumber: "3326220963084",
    issuedDate: "2026-04-28",
    expiryDate: "2026-09-25",
    status: "used",
    notes: "Usado 06/05. Próxima consulta 10/06."
  },
  {
    id: "ord-007",
    study: "Consulta con Especialista en Urología",
    orderNumber: "3326220963077",
    issuedDate: "2026-04-28",
    expiryDate: "2026-09-25",
    status: "used",
    notes: "Usado 14/05. Próxima consulta 06/07."
  }
];

export const initialResults = [
  {
    id: "res-001",
    study: "Ecodoppler Renal",
    date: "2026-05-13",
    status: "available",
    summary: "Sin hallazgos graves. Pendiente revisión formal con nefrólogo el 29/05.",
    fileUrl: ""
  },
  {
    id: "res-002",
    study: "Electrocardiograma",
    date: "2026-04-30",
    status: "available",
    summary: "Disponible online en portal Raya. El cardiólogo lo evaluará en consulta 10/06.",
    fileUrl: ""
  },
  {
    id: "res-003",
    study: "Antígeno Prostático (PSA Libre y Total)",
    date: "2026-05-16",
    status: "available",
    summary: "Realizado. Pendiente interpretación médica con urólogo.",
    fileUrl: ""
  },
  {
    id: "res-004",
    study: "Aldosterona + Renina-Angiotensina",
    date: "2026-05-18",
    status: "available",
    summary: "Realizado. Pendiente interpretación médica.",
    fileUrl: ""
  },
  {
    id: "res-005",
    study: "Ecodoppler Cardíaco",
    date: "2026-05-23",
    status: "pending",
    summary: "Realizado hoy. Resultado esperado antes de consulta cardiólogo (10/06).",
    fileUrl: ""
  },
  {
    id: "res-006",
    study: "Holter Cardíaco 24 hs",
    date: "2026-06-01",
    status: "not_done",
    summary: "Pendiente 01/06.",
    fileUrl: ""
  },
  {
    id: "res-007",
    study: "Ecografía Prostática + Renal + Vesical",
    date: "2026-06-04",
    status: "not_done",
    summary: "Pendiente 04/06. Para evaluación prostática.",
    fileUrl: ""
  },
  {
    id: "res-008",
    study: "Laboratorio Endocrinológico (TSH + T4)",
    date: "2026-06-10",
    status: "not_done",
    summary: "Pendiente 10/06. Control Levotiroxina (6 semanas).",
    fileUrl: ""
  },
  {
    id: "res-009",
    study: "Flujometría Urinaria",
    date: "2026-07-06",
    status: "not_done",
    summary: "Pendiente 06/07.",
    fileUrl: ""
  }
];

export async function seedData() {
  try {
    for (const apt of initialAppointments) {
      await setDoc(doc(db, "appointments", apt.id), apt);
    }
    for (const med of initialMedications) {
      await setDoc(doc(db, "medications", med.id), med);
    }
    for (const ord of initialOrders) {
      await setDoc(doc(db, "orders", ord.id), ord);
    }
    for (const res of initialResults) {
      await setDoc(doc(db, "results", res.id), res);
    }
    console.log("✅ Datos iniciales cargados en Firebase");
    return true;
  } catch (e) {
    console.error("Error seeding data:", e);
    return false;
  }
}
