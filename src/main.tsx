/* ──────────────────────────────────────────────
 *  Main Entry Point — OWNI Pro Max Gallery
 *  Inicialização do React 19 com StrictMode
 * ────────────────────────────────────────────── */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/globals.css";

/* ── Montar aplicação no DOM ── */
const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error("Root element not found. Ensure index.html has <div id='root'></div>");
}

createRoot(rootElement).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
