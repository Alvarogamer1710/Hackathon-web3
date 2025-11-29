📖 AccessReader: Decodificando la Web para Todos

Un "filtro accesible" para internet. Transformamos el caos de la web en una experiencia de lectura limpia, audible y, gracias a BSV, eterna.

📽️ Demo

<!-- Enlace a vuestro video o deploy -->

🌐 Probar AccessReader | 📺 Ver Pitch (1 min)

🧐 El Problema (Contexto ONCE)

Las personas con ceguera o baja visión navegan por una web hostil:

Ruido Estructural: Banners, menús mal etiquetados y pop-ups confunden a los lectores de pantalla.

Fatiga Visual: Tipografías pequeñas y bajo contraste hacen ilegible el contenido para personas con resto visual.

Fugacidad: El contenido accesible es escaso. Si una web cambia su diseño, la accesibilidad se rompe.

💡 La Solución: AccessReader

AccessReader es una herramienta que ingiere contenido (URLs o texto pegado) y lo re-renderiza en un entorno controlado estrictamente accesible.

Funcionalidades Clave (MVP)

👁️ Modo Lectura Puro: Elimina todo el CSS original y presenta el texto en una sola columna con jerarquía semántica clara.

🗣️ Text-to-Speech (TTS) Nativo: Lectura en voz alta con controles de velocidad y pausa, sin depender de software externo caro.

🎨 Personalización Extrema: Temas de Alto Contraste (Blanco/Negro, Amarillo/Negro) y escalado de fuentes masivo.

⛓️ Guardado Inmutable (BSV): ¿Te gusta este artículo? Guárdalo en la blockchain de Bitcoin SV. Será accesible para siempre, sin censura y sin cambios de diseño.

⚙️ Integración Blockchain (El Valor de BSV)

Usamos BSV a través de mMerge para convertir la accesibilidad efímera en permanente.

Identidad Simplificada (mMerge): El usuario se loguea con su cuenta social (sin seed phrases complicadas).

On-Chain Storage: Al pulsar "Guardar en Biblioteca", el texto procesado y limpio se sube a la blockchain.

Beneficio: Creamos una biblioteca descentralizada de conocimiento accesible.

graph LR
    A[Web Caótica] -->|Copiar URL| B(AccessReader Engine)
    B -->|Limpieza| C[Vista Accesible]
    C -->|Lectura TTS| D[Usuario (Audio)]
    C -->|Guardar| E{mMerge SDK}
    E -->|Transacción| F[BSV Blockchain]
    F -->|Persistencia| G[Biblioteca Eterna]


🛠️ Tech Stack

Frontend: React (Vite) + TailwindCSS.

Accesibilidad: Web Speech API (Nativa del navegador), ARIA live regions.

Blockchain: mMerge API + BSV SDK.

Sanitización: DOMPurify (para limpiar HTML entrante).

🚀 Guía de Uso Rápido

Entrada: Pega una URL o un texto en el campo principal.

Ajuste: Usa TAB para navegar a los controles de fuente y contraste.

Escucha: Pulsa ESPACIO en el botón de reproducción para iniciar la síntesis de voz.

Guarda: Si quieres conservar el texto, pulsa en "Guardar en BSV".

👥 Equipo "AccessTeam"

Juan Labajo - Frontend & A11y Specialist

Mario Ibañez - Blockchain Lead

Iván Sanz - Backend & Logic

Álvaro Hernández - Product & UX

📄 Licencia

MIT License. Hackathon Web3 2025.