// src/backend/server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

// Configuración
app.use(cors()); // Permite que React (puerto 3000) hable con este server
app.use(express.json());

const DB_FILE = path.join(__dirname, 'users.json');

// --- FUNCIONES DE AYUDA ---
// Leer usuarios del JSON
const getUsers = () => {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Guardar usuarios en el JSON
const saveUsers = (users) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
};

// --- ENDPOINTS (RUTAS) ---

// 1. LOGIN
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const users = getUsers();

    // Buscar si existe el usuario y coincide la contraseña
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        res.json({ success: true, user });
    } else {
        res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }
});

// 2. REGISTRO (Opcional, para crear nuevos)
app.post('/api/register', (req, res) => {
    const { email, password } = req.body;
    const users = getUsers();

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: "El usuario ya existe" });
    }

    const newUser = {
        id: Date.now(),
        email,
        password,
        hasPaid: false // Por defecto no han pagado
    };

    users.push(newUser);
    saveUsers(users); // ESCRIBE EN EL JSON

    res.json({ success: true, user: newUser });
});

// Arrancar servidor en puerto 5000 (para no chocar con React 3000)
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor Backend corriendo en http://localhost:${PORT}`);
});