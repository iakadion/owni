/* ──────────────────────────────────────────────
 *  MasonryGrid Component
 *  Layout masonry/grid adaptativo e responsivo
 * ────────────────────────────────────────────── */

import { type CSSProperties, type FC, type ReactNode, useEffect, useState } from "react";

/* ── Estilos ── */
const styles: Record<string, CSSProperties> = {
	grid: {
		display: "grid",
		gap: "1rem",
		width: "100%",
	},
	empty: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		padding: "4rem 2rem",
		textAlign: "center",
		color: "var(--color-silver)",
	},
	emptyTitle: {
		fontSize: "var(--font-lg)",
		fontWeight: 600,
		color: "var(--color-silver-light)",
		marginBottom: "0.5rem",
	},
	emptyText: {
		fontSize: "var(--font-base)",
		color: "var(--color-silver)",
	},
};

/** Hook para calcular colunas responsivas */
const useColumns = (): number => {
	const [cols, setCols] = useState(3);

	useEffect(() => {
		const update = () => {
			const w = window.innerWidth;
			if (w >= 1280) setCols(4);
			else if (w >= 1024) setCols(3);
			else if (w >= 640) setCols(2);
			else setCols(1);
		};
		update();
		window.addEventListener("resize", update);
		return () => window.removeEventListener("resize", update);
	}, []);

	return cols;
};

interface MasonryGridProps {
	children: ReactNode[];
	isEmpty?: boolean;
}

const MasonryGrid: FC<MasonryGridProps> = ({ children, isEmpty }) => {
	const columns = useColumns();

	if (isEmpty || children.length === 0) {
		return (
			<div style={styles.empty}>
				<p style={styles.emptyTitle}>No media found</p>
				<p style={styles.emptyText}>Try adjusting your filters or search query.</p>
			</div>
		);
	}

	return (
		<div
			style={{
				...styles.grid,
				gridTemplateColumns: `repeat(${columns}, 1fr)`,
			}}
		>
			{children}
		</div>
	);
};

export default MasonryGrid;
