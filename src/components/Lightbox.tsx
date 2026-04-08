/* ──────────────────────────────────────────────
 *  Lightbox Component
 *  Modal com backdrop blur, keyboard escape close,
 *  click-outside close, video preview, audio waveform
 *  player com play/pause, e full image view
 * ────────────────────────────────────────────── */

import type { CSSProperties, FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, HardDrive, Monitor, Music, Pause, Play, X } from "lucide-react";
import type { AudioItem, GalleryItem, ImageItem, VideoItem } from "@/types/index.ts";

/* ── Estilos ── */
const s: Record<string, CSSProperties> = {
	backdrop: {
		position: "fixed",
		inset: 0,
		zIndex: 1000,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		padding: "2rem",
		background: "rgba(5, 5, 7, 0.85)",
		backdropFilter: "blur(40px)",
		WebkitBackdropFilter: "blur(40px)",
	},
	modal: {
		position: "relative",
		maxWidth: 900,
		width: "100%",
		maxHeight: "90vh",
		borderRadius: "var(--radius-xl)",
		background: "rgba(20, 20, 28, 0.8)",
		backdropFilter: "blur(20px)",
		WebkitBackdropFilter: "blur(20px)",
		border: "1px solid var(--glass-border)",
		overflow: "hidden",
		display: "flex",
		flexDirection: "column",
		boxShadow: "0 32px 64px rgba(0,0,0,0.5), 0 0 40px rgba(124,124,255,0.05)",
	},
	closeBtn: {
		position: "absolute",
		top: 16,
		right: 16,
		zIndex: 10,
		width: 40,
		height: 40,
		borderRadius: "50%",
		background: "rgba(0,0,0,0.5)",
		backdropFilter: "blur(8px)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		cursor: "pointer",
		border: "1px solid rgba(255,255,255,0.08)",
		transition: "background 200ms ease",
	},
	mediaArea: {
		width: "100%",
		background: "var(--color-black-deep)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		minHeight: 300,
		position: "relative",
	},
	image: {
		maxWidth: "100%",
		maxHeight: "60vh",
		objectFit: "contain",
	},
	videoPlaceholder: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		gap: "1rem",
		padding: "3rem",
		width: "100%",
		aspectRatio: "16/9",
		background: "var(--color-graphite)",
	},
	videoPlayBtn: {
		width: 72,
		height: 72,
		borderRadius: "50%",
		background: "linear-gradient(135deg, #7c7cff 0%, #5a5aee 100%)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		boxShadow: "0 0 32px rgba(124, 124, 255, 0.35)",
		cursor: "pointer",
		border: "none",
	},
	audioSection: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		gap: "1.5rem",
		padding: "3rem 2rem",
		width: "100%",
		background: "var(--color-graphite)",
	},
	audioIconBig: {
		width: 80,
		height: 80,
		borderRadius: "var(--radius-xl)",
		background: "linear-gradient(135deg, rgba(124,124,255,0.2) 0%, rgba(90,90,238,0.1) 100%)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		border: "1px solid rgba(124, 124, 255, 0.15)",
	},
	waveformLarge: {
		width: "100%",
		maxWidth: 500,
		height: 64,
		display: "flex",
		alignItems: "center",
		gap: 2,
	},
	waveBar: {
		flex: 1,
		borderRadius: 2,
		transition: "height 200ms ease",
		minWidth: 3,
	},
	audioControls: {
		display: "flex",
		alignItems: "center",
		gap: "1rem",
	},
	audioPlayBtn: {
		width: 48,
		height: 48,
		borderRadius: "50%",
		background: "linear-gradient(135deg, #7c7cff 0%, #5a5aee 100%)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		boxShadow: "0 0 20px rgba(124, 124, 255, 0.3)",
		cursor: "pointer",
		border: "none",
	},
	progressTrack: {
		width: 300,
		maxWidth: "60vw",
		height: 4,
		borderRadius: 2,
		background: "rgba(255,255,255,0.06)",
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
		borderRadius: 2,
		background: "linear-gradient(90deg, #7c7cff 0%, #a78bfa 50%, #7c7cff 100%)",
		transition: "width 100ms linear",
	},
	infoBar: {
		padding: "1.25rem 1.5rem",
		display: "flex",
		flexDirection: "column",
		gap: "0.5rem",
		borderTop: "1px solid var(--glass-border)",
	},
	infoTitle: {
		fontSize: "var(--font-lg)",
		fontWeight: 700,
		color: "var(--color-white)",
	},
	infoDesc: {
		fontSize: "var(--font-base)",
		color: "var(--color-silver)",
		lineHeight: 1.5,
	},
	infoMeta: {
		display: "flex",
		alignItems: "center",
		gap: "1rem",
		flexWrap: "wrap",
		marginTop: "0.25rem",
	},
	metaChip: {
		display: "flex",
		alignItems: "center",
		gap: "0.3rem",
		fontSize: "var(--font-sm)",
		color: "var(--color-silver)",
		padding: "0.25rem 0.6rem",
		borderRadius: "var(--radius-full)",
		background: "rgba(255,255,255,0.04)",
		border: "1px solid var(--glass-border)",
	},
};

interface LightboxProps {
	item: GalleryItem | null;
	isOpen: boolean;
	onClose: () => void;
}

const Lightbox: FC<LightboxProps> = ({ item, isOpen, onClose }) => {
	const modalRef = useRef<HTMLDivElement>(null);
	const [audioPlaying, setAudioPlaying] = useState(false);
	const [audioProgress, setAudioProgress] = useState(0);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	/* ── Keyboard Escape ── */
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		if (isOpen) {
			document.addEventListener("keydown", handler);
			document.body.style.overflow = "hidden";
		}
		return () => {
			document.removeEventListener("keydown", handler);
			document.body.style.overflow = "";
		};
	}, [isOpen, onClose]);

	/* ── Click Outside ── */
	const handleBackdropClick = useCallback(
		(e: React.MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
				onClose();
			}
		},
		[onClose],
	);

	/* ── Audio Toggle ── */
	const toggleAudio = useCallback(() => {
		if (audioPlaying) {
			if (intervalRef.current) clearInterval(intervalRef.current);
			setAudioPlaying(false);
		} else {
			setAudioPlaying(true);
			intervalRef.current = setInterval(() => {
				setAudioProgress((prev) => {
					if (prev >= 100) {
						if (intervalRef.current) clearInterval(intervalRef.current);
						setAudioPlaying(false);
						return 0;
					}
					return prev + 0.4;
				});
			}, 50);
		}
	}, [audioPlaying]);

	/* ── Cleanup ── */
	useEffect(() => {
		if (!isOpen) {
			setAudioPlaying(false);
			setAudioProgress(0);
			if (intervalRef.current) clearInterval(intervalRef.current);
		}
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [isOpen]);

	return (
		<AnimatePresence>
			{isOpen && item && (
				<motion.div
					style={s.backdrop}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
					onClick={handleBackdropClick}
				>
					<motion.div
						ref={modalRef}
						style={s.modal}
						initial={{ opacity: 0, scale: 0.92, y: 30 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.92, y: 30 }}
						transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
					>
						{/* ── Close Button ── */}
						<button type="button" style={s.closeBtn} onClick={onClose} aria-label="Close lightbox">
							<X size={18} color="var(--color-white)" />
						</button>

						{/* ── Media Area ── */}
						<div style={s.mediaArea}>
							{/* Video Preview */}
							{item.type === "video" && (
								<div style={s.videoPlaceholder}>
									<img
										src={item.thumbnail}
										alt={item.title}
										style={{
											position: "absolute",
											inset: 0,
											width: "100%",
											height: "100%",
											objectFit: "cover",
											opacity: 0.4,
										}}
									/>
									<button type="button" style={s.videoPlayBtn} aria-label="Play video">
										<Play size={32} color="#fff" fill="#fff" />
									</button>
									<span
										style={{
											fontSize: "var(--font-sm)",
											color: "var(--color-silver-light)",
											zIndex: 1,
										}}
									>
										{(item as VideoItem).duration} — {(item as VideoItem).dimensions}
									</span>
								</div>
							)}

							{/* Audio Waveform Player */}
							{item.type === "audio" && (
								<div style={s.audioSection}>
									<div style={s.audioIconBig}>
										<Music size={36} color="#a5a5ff" />
									</div>

									{/* Waveform */}
									<div style={s.waveformLarge}>
										{(item as AudioItem).waveformData.map((amp, i) => {
											const barProg =
												(i / (item as AudioItem).waveformData.length) * 100;
											const isPlayed = barProg <= audioProgress;
											return (
												<div
													key={`lb-bar-${item.id}-${
														// biome-ignore lint/suspicious/noArrayIndexKey: static bars
														i
													}`}
													style={{
														...s.waveBar,
														height: `${amp * 90}%`,
														background: isPlayed
															? "linear-gradient(180deg, #7c7cff 0%, #5a5aee 100%)"
															: "rgba(255,255,255,0.1)",
													}}
												/>
											);
										})}
									</div>

									{/* Controls */}
									<div style={s.audioControls}>
										<button
											type="button"
											style={s.audioPlayBtn}
											onClick={toggleAudio}
											aria-label={audioPlaying ? "Pause" : "Play"}
										>
											{audioPlaying ? (
												<Pause size={20} color="#fff" fill="#fff" />
											) : (
												<Play size={20} color="#fff" fill="#fff" />
											)}
										</button>
										<div style={s.progressTrack}>
											<div
												style={{
													...s.progressFill,
													width: `${audioProgress}%`,
												}}
											/>
										</div>
									</div>
								</div>
							)}

							{/* Full Image View */}
							{item.type === "image" && (
								<img
									src={(item as ImageItem).src}
									alt={item.title}
									style={s.image}
								/>
							)}
						</div>

						{/* ── Info Bar ── */}
						<div style={s.infoBar}>
							<h2 style={s.infoTitle}>{item.title}</h2>
							<p style={s.infoDesc}>{item.description}</p>
							<div style={s.infoMeta}>
								{item.type === "video" && (
									<>
										<span style={s.metaChip}>
											<Clock size={12} />
											{(item as VideoItem).duration}
										</span>
										<span style={s.metaChip}>
											<Monitor size={12} />
											{(item as VideoItem).dimensions}
										</span>
									</>
								)}
								{item.type === "image" && (
									<span style={s.metaChip}>
										<Monitor size={12} />
										{(item as ImageItem).dimensions}
									</span>
								)}
								<span style={s.metaChip}>
									<HardDrive size={12} />
									{item.type === "video"
										? (item as VideoItem).fileSize
										: item.type === "audio"
											? (item as AudioItem).fileSize
											: (item as ImageItem).fileSize}
								</span>
								<span style={s.metaChip}>{item.category}</span>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default Lightbox;
