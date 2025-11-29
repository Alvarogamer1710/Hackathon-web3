# 👁️ AccessVault: Inclusión Documental en BSV

[![Hackathon](https://img.shields.io/badge/Hackathon-Web3_2025-blueviolet?style=for-the-badge)](https://www.mmerge.io/es/hackathon-2025)
[![Challenge](https://img.shields.io/badge/Challenge-Fundación%20ONCE-yellow?style=for-the-badge&logo=accessibility)](https://www.fundaciononce.es/)
[![Powered By](https://img.shields.io/badge/Powered_by-mMerge-00D1FF?style=for-the-badge)](https://www.mmerge.io/)
[![BSV](https://img.shields.io/badge/Blockchain-BSV-e9b20e?style=for-the-badge&logo=bitcoin)](https://bitcoinsv.com/)

> **Gestión de documentación vital para personas invidentes: Sin barreras visuales, asegurada por Blockchain.**

---

## 📽️ Demo & Pitch
[🌐 Probar Aplicación (Deploy)](#) | [📺 Ver Video Pitch (1 min)](#)

---

## 🎯 El Reto: Fundación ONCE
Las personas ciegas se enfrentan a un **"abismo digital"** en la burocracia actual:
1.  **Inseguridad:** Transportar papeles físicos importantes (certificados de discapacidad, DNI) es un riesgo.
2.  **Dependencia:** Los portales web actuales no son semánticos, obligando al usuario a pedir ayuda a terceros para leer datos privados.
3.  **Gestión de Wallets:** Las wallets cripto tradicionales (con frases semilla y QRs) son prácticamente imposibles de usar con un lector de pantalla.

## 💡 Nuestra Solución: AccessVault
Hemos creado una **billetera documental auditiva**. Una aplicación donde la interfaz gráfica es secundaria y la estructura semántica es prioritaria.

Utilizamos la blockchain de **BSV** para crear un registro inmutable de la documentación del usuario, permitiéndole compartir permisos o demostrar la validez de un papel sin necesidad de verlo físicamente.

---

## ⚙️ Arquitectura Técnica (BSV & mMerge)

Para cumplir con el requisito de accesibilidad extrema, hemos descartado las wallets de navegador tradicionales (como plugins) y hemos integrado **mMerge**.

### ¿Por qué mMerge para la ONCE?
La integración con [mMerge](https://www.mmerge.io/) nos permite una **abstracción de cuenta**.
* El usuario invidente se loguea con métodos estándar (Email/Social) que ya sabe navegar.
* No hay gestión de *seed phrases* compleja ni escaneo visual de QRs.
* La firma de transacciones ocurre en un entorno seguro y accesible.

### Flujo de Datos
```mermaid
sequenceDiagram
    participant U as Usuario (Screen Reader)
    participant F as Frontend (A11y First)
    participant M as mMerge SDK
    participant B as BSV Blockchain

    U->>F: "Subir Certificado Discapacidad" (Comando Voz/Teclado)
    F->>M: Solicitar Firma Digital
    Note right of M: Autenticación sin fricción visual
    M->>B: Transacción on-chain (Hash del doc)
    B-->>F: Confirmación (TXID)
    F-->>U: Feedback Auditivo "Documento guardado seguro"

🛠️ Tech Stack

    Frontend: React / Next.js (Optimizado con roles ARIA y navegación por teclado).

    Identidad & Wallet: mMerge API (Gestión de usuarios y firmas).

    Blockchain Data: BSV SDK para la construcción de transacciones.

    Lectura Rápida: fast.brc.dev para recuperar el estado de los documentos instantáneamente.

    Accesibilidad: Tests automatizados con axe-core.

♿ Características de Accesibilidad (A11y)

Nuestra prioridad en el desarrollo ha sido el cumplimiento WCAG 2.1 AAA:

    Skip Links: Navegación directa al contenido principal para evitar menús repetitivos.

    Etiquetado Semántico: Uso estricto de <main>, <nav>, <article> y aria-live para notificaciones dinámicas (ej: cuando una transacción de BSV se completa).

    Contraste y Tipografía: Interfaz en alto contraste por defecto.

    Feedback Sonoro: Sonidos distintivos para éxito/error en operaciones blockchain.

🚀 Instalación Local

    Clonar repositorio:
    Bash

git clone [https://github.com/tu-repo/access-vault.git](https://github.com/tu-repo/access-vault.git)

Instalar dependencias:
Bash

npm install

Configuración mMerge: Crea un archivo .env con las credenciales obtenidas en el portal de mMerge:
Bash

NEXT_PUBLIC_MMERGE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_BSV_NETWORK=testnet

Ejecutar:
Bash

    npm run dev

👥 Equipo de Desarrollo

    Juan Labajo - Frontend & A11y

    Mario Ibañez - BSV Integration

    Iván Sanz - Backend Logic

    Álvaro Hernández - UX/UI & Product