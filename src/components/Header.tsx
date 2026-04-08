/* ──────────────────────────────────────────────
 *  Header Component
 *  Cabeçalho premium com branding e busca
 * ────────────────────────────────────────────── */

import { type CSSProperties, type FC, useState } from "react";
import { Search, Sparkles } from "lucide-react";

/* ── Estilos ── */
const styles: Record<string, CSSProperties> = {
	header: {
		width: "100%",
		padding: "2rem 0 1.5rem",
		display: "flex",
		flexDirection: "column",
		gap: "1.5rem",
	},
	topRow: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		flexWrap: "wrap",
		gap: "1rem",
	},
	brand: {
		display: "flex",
		alignItems: "center",
		gap: "0.75rem",
	},
	logoIcon: {
		width: 40,
		height: 40,
		borderRadius: "12px",
		background: "linear-gradient(135deg, #7c7cff 0%, #5a5aee 100%)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		boxShadow: "0 0 20px rgba(124, 124, 255, 0.25)",
	},
	title: {
		fontSize: "var(--font-2xl)",
		fontWeight: 700,
		color: "var(--color-white)",
		letterSpacing: "-0.02em",
		lineHeight: 1.2,
	},
	subtitle: {
		fontSize: "var(--font-sm)",
		color: "var(--color-silver)",
		fontWeight: 400,
		letterSpacing: "0.04em",
		textTransform: "uppercase" as const,
	},
	searchWrapper: {
		position: "relative" as const,
		maxWidth: 320,
		width: "100%",
	},
	searchIcon: {
		position: "absolute" as const,
		left: 14,
		top: "50%",
		transform: "translateY(-50%)",
		color: "var(--color-silver)",
		pointerEvents: "none" as const,
	},
	searchInput: {
		width: "100%",
		height: 44,
		padding: "0 1rem 0 2.75rem",
		fontSize: "var(--font-base)",
		color: "var(--color-white)",
		background: "rgba(20, 20, 28, 0.5)",
		backdropFilter: "blur(12px)",
		WebkitBackdropFilter: "blur(12px)",
		border: "1px solid var(--glass-border)",
		borderRadius: "var(--radius-full)",
		outline: "none",
		transition: "border-color 250ms cubic-bezier(0.16, 1, 0.3, 1)",
		fontFamily: "var(--font-family)",
	},
};

interface HeaderProps {
	onSearch: (query: string) => void;
	totalItems: number;
}

const Header: FC<HeaderProps> = ({ onSearch, totalItems }) => {
	const [focused, setFocused] = useState(false);

	return (
		<header style={styles.header}>
			{/* ── Top Row: Brand + Search ── */}
			<div style={styles.topRow}>
				{/* ── Brand ── */}
				<div style={styles.brand}>
					<div style={styles.logoIcon}>
						<Sparkles size={20} color="#fff" strokeWidth={2.5} />
					</div>
					<div>
						<h1 style={styles.title}>OWNI</h1>
						<p style={styles.subtitle}>Pro Max Gallery — {totalItems} items</p>
					</div>
				</div>

				{/* ── Search ── */}
				<div style={styles.searchWrapper}>
					<div style={styles.searchIcon}>
						<Search size={16} />
					</div>
					<input
						type="text"
						placeholder="Search media..."
						onChange={(e) => onSearch(e.target.value)}
						onFocus={() => setFocused(true)}
						onBlur={() => setFocused(false)}
						style={{
							...styles.searchInput,
							borderColor: focused
								? "rgba(124, 124, 255, 0.4)"
								: "var(--glass-border)",
						}}
					/>
				</div>
			</div>
		</header>
	);
};

export default Header;
