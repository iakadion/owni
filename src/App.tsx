/* ──────────────────────────────────────────────
 *  App Component — OWNI Pro Max Gallery
 *  Integração de todos os componentes modulares
 * ────────────────────────────────────────────── */

import type { CSSProperties, FC } from "react";
import {
	Header,
	FilterBar,
	MasonryGrid,
	VideoCard,
	AudioCard,
	ImageCard,
	Lightbox,
	UploadZone,
	ToastContainer,
} from "@/components/index.ts";
import { useGallery } from "@/hooks/useGallery.ts";
import type { AudioItem, ImageItem, VideoItem } from "@/types/index.ts";

/* ── Estilos do Layout Principal ── */
const styles: Record<string, CSSProperties> = {
	app: {
		width: "100%",
		minHeight: "100dvh",
		display: "flex",
		flexDirection: "column",
		background: "var(--color-black-deep)",
	},
	container: {
		width: "100%",
		maxWidth: 1400,
		margin: "0 auto",
		padding: "0 1.5rem 3rem",
		display: "flex",
		flexDirection: "column",
		gap: "1.5rem",
	},
	divider: {
		width: "100%",
		height: 1,
		background: "var(--glass-border)",
		margin: "0.5rem 0",
	},
	footer: {
		marginTop: "auto",
		padding: "2rem 1.5rem",
		textAlign: "center",
		fontSize: "var(--font-xs)",
		color: "var(--color-silver)",
		borderTop: "1px solid var(--glass-border)",
	},
};

const App: FC = () => {
	const {
		items,
		allItems,
		activeCategory,
		categoryCounts,
		lightbox,
		toasts,
		handleCategoryChange,
		handleSearch,
		handleLike,
		handleOpenLightbox,
		handleCloseLightbox,
		showToast,
		dismissToast,
		handleUpload,
	} = useGallery();

	return (
		<div style={styles.app}>
			{/* ── Main Container ── */}
			<main style={styles.container}>
				{/* ── Header Section ── */}
				<Header onSearch={handleSearch} totalItems={allItems.length} />

				{/* ── Filter Bar Section ── */}
				<FilterBar
					activeCategory={activeCategory}
					onCategoryChange={handleCategoryChange}
					categoryCounts={categoryCounts}
				/>

				{/* ── Divider ── */}
				<div style={styles.divider} />

				{/* ── Gallery Grid Section ── */}
				<MasonryGrid isEmpty={items.length === 0}>
					{items.map((item) => {
						switch (item.type) {
							case "video":
								return (
									<VideoCard
										key={item.id}
										item={item as VideoItem}
										onOpen={handleOpenLightbox}
										onLike={handleLike}
										onToast={showToast}
									/>
								);
							case "audio":
								return (
									<AudioCard
										key={item.id}
										item={item as AudioItem}
										onOpen={handleOpenLightbox}
										onLike={handleLike}
										onToast={showToast}
									/>
								);
							case "image":
								return (
									<ImageCard
										key={item.id}
										item={item as ImageItem}
										onOpen={handleOpenLightbox}
										onLike={handleLike}
										onToast={showToast}
									/>
								);
							default:
								return null;
						}
					})}
				</MasonryGrid>

				{/* ── Divider ── */}
				<div style={styles.divider} />

				{/* ── Upload Zone Section ── */}
				<UploadZone onUpload={handleUpload} onToast={showToast} />
			</main>

			{/* ── Footer Section ── */}
			<footer style={styles.footer}>
				OWNI Pro Max Gallery — Premium glassmorphism media showcase
			</footer>

			{/* ── Lightbox Modal (Portal-like) ── */}
			<Lightbox
				item={lightbox.item}
				isOpen={lightbox.isOpen}
				onClose={handleCloseLightbox}
			/>

			{/* ── Toast Notifications ── */}
			<ToastContainer toasts={toasts} onDismiss={dismissToast} />
		</div>
	);
};

export default App;
