# Fernando — Control Médico 🏥

App para seguimiento médico de Fernando Malito. Datos en tiempo real via Firebase Firestore. Accesible desde cualquier dispositivo simultáneamente.

---

## 🚀 Deploy paso a paso

### 1. Instalar dependencias (una sola vez)
```bash
npm install
```

### 2. Probar en local
```bash
npm start
# Abre http://localhost:3000
```

### 3. Cargar datos iniciales en Firebase
En la app, si aparece el botón **"⚡ Cargar datos iniciales"** en la esquina superior derecha, hacé click una sola vez. Eso sube todos los datos (turnos, medicación, resultados, órdenes) a Firebase.

> ⚠️ Solo hacerlo una vez. Si los datos ya están, no lo vuelvas a presionar.

---

### 4. Subir a GitHub
```bash
git init
git add .
git commit -m "Fernando control médico - inicial"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/fernando-control.git
git push -u origin main
```

### 5. Deploy en Vercel
1. Ir a [vercel.com](https://vercel.com) → Import Project
2. Conectar tu repo de GitHub `fernando-control`
3. Framework: **Create React App** (lo detecta solo)
4. Click en **Deploy**

Vercel te da una URL tipo `https://fernando-control.vercel.app`

---

### 6. Firebase — Reglas de seguridad

En [Firebase Console](https://console.firebase.google.com) → tu proyecto → Firestore Database → Rules, poner esto para que cualquiera en la familia pueda leer/escribir:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

> Para más seguridad después podés agregar autenticación, pero para uso familiar esto es suficiente.

---

## 📱 Uso

| Tab | Para qué sirve |
|-----|----------------|
| 📅 Turnos | Ver próximos y realizados. Agregar/editar/marcar como hecho |
| 💊 Medicación | Lista de medicamentos con dosis y recetas |
| 🔬 Resultados | Estado de cada estudio (disponible / pendiente / no hecho) |
| 📋 Órdenes | Órdenes PAMI con número y vencimiento |

---

## 📦 Estructura del proyecto

```
fernando-control/
├── public/
│   └── index.html
├── src/
│   ├── lib/
│   │   ├── firebase.js      ← Config Firebase
│   │   └── seedData.js      ← Datos iniciales
│   ├── components/
│   │   ├── AppointmentsTab.js
│   │   ├── MedicationsTab.js
│   │   ├── ResultsTab.js
│   │   └── OrdersTab.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
├── vercel.json
└── README.md
```
