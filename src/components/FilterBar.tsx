/* ──────────────────────────────────────────────
 *  FilterBar Component
 *  Filtros por categoria com contadores e animações
 * ────────────────────────────────────────────── */

import type { CSSProperties, FC } from "react";
import { motion } from "framer-motion";
import { Globe, Layers, LayoutGrid, Settings, Smartphone } from "lucide-react";
import type { MediaCategory } from "@/types/index.ts";

/* ── Ícones por categoria ── */
const categoryIcons: Record<MediaCategory, FC<{ size: number }>> = {
	All: LayoutGrid,
	Sites: Globe,
	Apps: Smartphone,
	Tools: Settings,
	Components: Layers,
};

/* ── Estilos ── */
const styles: Record<string, CSSProperties> = {
	container: {
		display: "flex",
		alignItems: "center",
		gap: "0.5rem",
		overflowX: "auto",
		paddingBottom: "0.5rem",
		scrollbarWidth: "none",
	},
	pill: {
		display: "flex",
		alignItems: "center",
		gap: "0.5rem",
		padding: "0.5rem 1rem",
		borderRadius: "var(--radius-full)",
		fontSize: "var(--font-sm)",
		fontWeight: 500,
		whiteSpace: "nowrap" as const,
		cursor: "pointer",
		border: "1px solid transparent",
		transition: "all 250ms cubic-bezier(0.16, 1, 0.3, 1)",
		userSelect: "none" as const,
		fontFamily: "var(--font-family)",
	},
	pillInactive: {
		background: "rgba(20, 20, 28, 0.4)",
		color: "var(--color-silver)",
		borderColor: "var(--glass-border)",
	},
	pillActive: {
		background: "linear-gradient(135deg, rgba(124,124,255,0.15) 0%, rgba(90,90,238,0.1) 100%)",
		color: "var(--color-white)",
		borderColor: "rgba(124, 124, 255, 0.3)",
		boxShadow: "0 0 16px rgba(124, 124, 255, 0.1)",
	},
	counter: {
		fontSize: "var(--font-xs)",
		fontWeight: 600,
		padding: "0.125rem 0.4rem",
		borderRadius: "var(--radius-full)",
		lineHeight: 1.4,
	},
	counterInactive: {
		background: "rgba(255,255,255,0.06)",
		color: "var(--color-silver)",
	},
	counterActive: {
		background: "rgba(124, 124, 255, 0.2)",
		color: "#a5a5ff",
	},
};

interface FilterBarProps {
	activeCategory: MediaCategory;
	onCategoryChange: (category: MediaCategory) => void;
	categoryCounts: Record<MediaCategory, number>;
}

const FilterBar: FC<FilterBarProps> = ({ activeCategory, onCategoryChange, categoryCounts }) => {
	const categories: MediaCategory[] = ["All", "Sites", "Apps", "Tools", "Components"];

	return (
		<nav style={styles.container} role="tablist" aria-label="Media category filters">
			{categories.map((cat) => {
				const isActive = activeCategory === cat;
				const Icon = categoryIcons[cat];

				return (
					<motion.button
						key={cat}
						role="tab"
						aria-selected={isActive}
						onClick={() => onCategoryChange(cat)}
						whileHover={{ scale: 1.04 }}
						whileTap={{ scale: 0.96 }}
						style={{
							...styles.pill,
							...(isActive ? styles.pillActive : styles.pillInactive),
						}}
					>
						<Icon size={14} />
						<span>{cat}</span>
						<span
							style={{
								...styles.counter,
								...(isActive ? styles.counterActive : styles.counterInactive),
							}}
						>
							{categoryCounts[cat]}
						</span>
					</motion.button>
				);
			})}
		</nav>
	);
};

export default FilterBar;
