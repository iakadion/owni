/* ──────────────────────────────────────────────
 *  AudioCard Component
 *  Card de áudio com waveform dinâmico animado,
 *  barra de progresso com gradient fill,
 *  toggle de playback e metadata
 * ────────────────────────────────────────────── */

import type { CSSProperties, FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, HardDrive, Heart, Music, Pause, Play, Share2 } from "lucide-react";
import type { AudioItem } from "@/types/index.ts";

/* ── Estilos ── */
const s: Record<string, CSSProperties> = {
	card: {
		position: "relative",
		borderRadius: "var(--radius-md)",
		overflow: "hidden",
		background: "rgba(20, 20, 28, 0.5)",
		backdropFilter: "blur(12px)",
		WebkitBackdropFilter: "blur(12px)",
		border: "1px solid var(--glass-border)",
		padding: "1rem",
		display: "flex",
		flexDirection: "column",
		gap: "0.75rem",
	},
	topRow: {
		display: "flex",
		alignItems: "flex-start",
		gap: "0.75rem",
	},
	iconWrap: {
		width: 48,
		height: 48,
		borderRadius: "var(--radius-md)",
		background: "linear-gradient(135deg, rgba(124,124,255,0.15) 0%, rgba(90,90,238,0.08) 100%)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexShrink: 0,
		border: "1px solid rgba(124, 124, 255, 0.1)",
	},
	info: {
		flex: 1,
		minWidth: 0,
	},
	title: {
		fontSize: "var(--font-base)",
		fontWeight: 600,
		color: "var(--color-white)",
		lineHeight: 1.3,
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	desc: {
		fontSize: "var(--font-sm)",
		color: "var(--color-silver)",
		lineHeight: 1.4,
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		marginTop: "0.125rem",
	},
	badge: {
		padding: "0.15rem 0.4rem",
		borderRadius: "var(--radius-sm)",
		fontSize: "var(--font-xs)",
		fontWeight: 700,
		background: "rgba(124, 124, 255, 0.15)",
		color: "#a5a5ff",
		border: "1px solid rgba(124, 124, 255, 0.1)",
		letterSpacing: "0.04em",
		flexShrink: 0,
		alignSelf: "flex-start",
	},
	waveformContainer: {
		width: "100%",
		height: 48,
		display: "flex",
		alignItems: "center",
		gap: 1.5,
		padding: "0 0.25rem",
		cursor: "pointer",
		position: "relative",
	},
	waveBar: {
		flex: 1,
		borderRadius: 2,
		transition: "height 200ms cubic-bezier(0.16, 1, 0.3, 1)",
		minWidth: 2,
	},
	progressRow: {
		display: "flex",
		alignItems: "center",
		gap: "0.75rem",
	},
	playBtn: {
		width: 36,
		height: 36,
		borderRadius: "50%",
		background: "linear-gradient(135deg, #7c7cff 0%, #5a5aee 100%)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexShrink: 0,
		boxShadow: "0 0 16px rgba(124, 124, 255, 0.25)",
		cursor: "pointer",
		border: "none",
	},
	progressTrack: {
		flex: 1,
		height: 4,
		borderRadius: 2,
		background: "rgba(255,255,255,0.06)",
		overflow: "hidden",
		position: "relative",
	},
	progressFill: {
		height: "100%",
		borderRadius: 2,
		background: "linear-gradient(90deg, #7c7cff 0%, #a78bfa 50%, #7c7cff 100%)",
		backgroundSize: "200% 100%",
		transition: "width 100ms linear",
	},
	timeLabel: {
		fontSize: "var(--font-xs)",
		color: "var(--color-silver)",
		fontVariantNumeric: "tabular-nums",
		minWidth: 36,
		textAlign: "right",
	},
	meta: {
		display: "flex",
		alignItems: "center",
		gap: "0.75rem",
	},
	metaItem: {
		display: "flex",
		alignItems: "center",
		gap: "0.25rem",
		fontSize: "var(--font-xs)",
		color: "var(--color-silver)",
	},
	actions: {
		display: "flex",
		alignItems: "center",
		gap: "0.25rem",
		marginLeft: "auto",
		opacity: 0,
		transition: "opacity 250ms ease",
	},
	actionBtn: {
		width: 30,
		height: 30,
		borderRadius: "var(--radius-sm)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		transition: "background 200ms ease",
		border: "none",
		background: "transparent",
		cursor: "pointer",
	},
};

interface AudioCardProps {
	item: AudioItem;
	onOpen: (item: AudioItem) => void;
	onLike: (id: string) => void;
	onToast: (msg: string) => void;
}

const AudioCard: FC<AudioCardProps> = ({ item, onOpen, onLike, onToast }) => {
	const [hovered, setHovered] = useState(false);
	const [playing, setPlaying] = useState(false);
	const [progress, setProgress] = useState(0);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	/* ── Simular progresso de áudio ── */
	const togglePlay = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			if (playing) {
				if (intervalRef.current) clearInterval(intervalRef.current);
				setPlaying(false);
			} else {
				setPlaying(true);
				intervalRef.current = setInterval(() => {
					setProgress((prev) => {
						if (prev >= 100) {
							if (intervalRef.current) clearInterval(intervalRef.current);
							setPlaying(false);
							return 0;
						}
						return prev + 0.5;
					});
				}, 50);
			}
		},
		[playing],
	);

	useEffect(() => {
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, []);

	return (
		<motion.article
			className="glass-card"
			style={s.card}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			onClick={() => onOpen(item)}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
			whileHover={{ y: -4 }}
		>
			{/* ── Top Row: Icon + Info + Badge ── */}
			<div style={s.topRow}>
				<div style={s.iconWrap}>
					<Music size={20} color="#a5a5ff" />
				</div>
				<div style={s.info}>
					<h3 style={s.title}>{item.title}</h3>
					<p style={s.desc}>{item.description}</p>
				</div>
				<span style={s.badge}>{item.format}</span>
			</div>

			{/* ── Waveform Visualization ── */}
			<div style={s.waveformContainer} role="img" aria-label="Audio waveform">
				{item.waveformData.map((amplitude, i) => {
					const barProgress = (i / item.waveformData.length) * 100;
					const isPlayed = barProgress <= progress;
					const isAnimating = playing && Math.abs(barProgress - progress) < 5;

					return (
						<div
							key={`bar-${item.id}-${
								// biome-ignore lint/suspicious/noArrayIndexKey: waveform bars are static
								i
							}`}
							style={{
								...s.waveBar,
								height: `${amplitude * (isAnimating ? 100 : 80)}%`,
								background: isPlayed
									? "linear-gradient(180deg, #7c7cff 0%, #5a5aee 100%)"
									: "rgba(255,255,255,0.08)",
								opacity: isPlayed ? 1 : 0.6,
							}}
						/>
					);
				})}
			</div>

			{/* ── Progress Row: Play + Bar + Time ── */}
			<div style={s.progressRow}>
				<button type="button" style={s.playBtn} onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
					{playing ? (
						<Pause size={16} color="#fff" fill="#fff" />
					) : (
						<Play size={16} color="#fff" fill="#fff" />
					)}
				</button>

				<div style={s.progressTrack}>
					<div style={{ ...s.progressFill, width: `${progress}%` }} />
				</div>

				<span style={s.timeLabel}>{item.duration}</span>
			</div>

			{/* ── Metadata + Actions ── */}
			<div style={s.meta}>
				<span style={s.metaItem}>
					<HardDrive size={11} />
					{item.fileSize}
				</span>
				<span style={s.metaItem}>{item.duration}</span>

				<div style={{ ...s.actions, opacity: hovered ? 1 : 0 }}>
					<button
						type="button"
						style={{
							...s.actionBtn,
							background: item.liked ? "rgba(255, 80, 100, 0.15)" : "transparent",
						}}
						onClick={(e) => {
							e.stopPropagation();
							onLike(item.id);
						}}
						aria-label="Like"
					>
						<Heart
							size={14}
							color={item.liked ? "#ff5064" : "var(--color-silver)"}
							fill={item.liked ? "#ff5064" : "none"}
						/>
					</button>
					<button
						type="button"
						style={s.actionBtn}
						onClick={(e) => {
							e.stopPropagation();
							onToast("Link copied to clipboard");
						}}
						aria-label="Share"
					>
						<Share2 size={14} color="var(--color-silver)" />
					</button>
					<button
						type="button"
						style={s.actionBtn}
						onClick={(e) => {
							e.stopPropagation();
							onToast("Download started");
						}}
						aria-label="Download"
					>
						<Download size={14} color="var(--color-silver)" />
					</button>
				</div>
			</div>
		</motion.article>
	);
};

export default AudioCard;
