/* ──────────────────────────────────────────────
 *  Toast Component
 *  Notificações slide-up com feedback visual,
 *  auto-dismiss e ícones por tipo
 * ────────────────────────────────────────────── */

import type { CSSProperties, FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import type { ToastState } from "@/types/index.ts";

/* ── Estilos ── */
const s: Record<string, CSSProperties> = {
	container: {
		position: "fixed",
		bottom: 24,
		right: 24,
		zIndex: 2000,
		display: "flex",
		flexDirection: "column",
		gap: "0.5rem",
		pointerEvents: "none",
	},
	toast: {
		display: "flex",
		alignItems: "center",
		gap: "0.625rem",
		padding: "0.75rem 1rem",
		borderRadius: "var(--radius-md)",
		background: "rgba(20, 20, 28, 0.85)",
		backdropFilter: "blur(20px)",
		WebkitBackdropFilter: "blur(20px)",
		border: "1px solid var(--glass-border)",
		boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
		pointerEvents: "auto",
		maxWidth: 360,
		minWidth: 240,
	},
	message: {
		flex: 1,
		fontSize: "var(--font-sm)",
		fontWeight: 500,
		color: "var(--color-white)",
		lineHeight: 1.4,
	},
	closeBtn: {
		width: 24,
		height: 24,
		borderRadius: "var(--radius-sm)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		cursor: "pointer",
		flexShrink: 0,
		background: "transparent",
		border: "none",
		transition: "background 200ms ease",
	},
};

/* ── Cores e ícones por tipo ── */
const typeConfig = {
	success: { icon: CheckCircle, color: "#50c878" },
	info: { icon: Info, color: "#7c7cff" },
	error: { icon: AlertCircle, color: "#ff5064" },
};

interface ToastContainerProps {
	toasts: ToastState[];
	onDismiss: (id: string) => void;
}

const ToastContainer: FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
	return (
		<div style={s.container}>
			<AnimatePresence mode="popLayout">
				{toasts
					.filter((t) => t.visible)
					.map((toast) => {
						const config = typeConfig[toast.type];
						const Icon = config.icon;

						return (
							<motion.div
								key={toast.id}
								style={{
									...s.toast,
									borderColor: `${config.color}20`,
								}}
								initial={{ opacity: 0, y: 40, scale: 0.95 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: -20, scale: 0.95 }}
								transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
								layout
							>
								<Icon size={16} color={config.color} />
								<span style={s.message}>{toast.message}</span>
								<button
									type="button"
									style={s.closeBtn}
									onClick={() => onDismiss(toast.id)}
									aria-label="Dismiss notification"
								>
									<X size={12} color="var(--color-silver)" />
								</button>
							</motion.div>
						);
					})}
			</AnimatePresence>
		</div>
	);
};

export default ToastContainer;
