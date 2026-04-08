/* ──────────────────────────────────────────────
 *  VideoCard Component
 *  Card de vídeo com preview, badges de formato,
 *  duração, dimensões, tamanho e overlays
 * ────────────────────────────────────────────── */

import type { CSSProperties, FC } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
	Clock,
	Download,
	Expand,
	HardDrive,
	Heart,
	Monitor,
	Play,
	Share2,
} from "lucide-react";
import type { VideoItem } from "@/types/index.ts";

/* ── Estilos ── */
const s: Record<string, CSSProperties> = {
	card: {
		position: "relative",
		borderRadius: "var(--radius-md)",
		overflow: "hidden",
		cursor: "pointer",
		background: "rgba(20, 20, 28, 0.5)",
		backdropFilter: "blur(12px)",
		WebkitBackdropFilter: "blur(12px)",
		border: "1px solid var(--glass-border)",
	},
	thumbWrap: {
		position: "relative",
		width: "100%",
		aspectRatio: "16/9",
		overflow: "hidden",
		background: "var(--color-graphite)",
	},
	thumb: {
		width: "100%",
		height: "100%",
		objectFit: "cover",
		transition: "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
	},
	overlay: {
		position: "absolute",
		inset: 0,
		background:
			"linear-gradient(180deg, transparent 0%, rgba(5,5,7,0.3) 50%, rgba(5,5,7,0.85) 100%)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		opacity: 0,
		transition: "opacity 300ms cubic-bezier(0.16, 1, 0.3, 1)",
	},
	playBtn: {
		width: 56,
		height: 56,
		borderRadius: "50%",
		background: "rgba(124, 124, 255, 0.85)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		boxShadow: "0 0 24px rgba(124, 124, 255, 0.4)",
		backdropFilter: "blur(8px)",
	},
	badge: {
		position: "absolute",
		top: 10,
		left: 10,
		padding: "0.2rem 0.5rem",
		borderRadius: "var(--radius-sm)",
		fontSize: "var(--font-xs)",
		fontWeight: 700,
		background: "rgba(124, 124, 255, 0.2)",
		color: "#a5a5ff",
		backdropFilter: "blur(8px)",
		border: "1px solid rgba(124, 124, 255, 0.15)",
		letterSpacing: "0.04em",
	},
	duration: {
		position: "absolute",
		bottom: 10,
		right: 10,
		padding: "0.2rem 0.5rem",
		borderRadius: "var(--radius-sm)",
		fontSize: "var(--font-xs)",
		fontWeight: 600,
		background: "rgba(0,0,0,0.7)",
		color: "var(--color-white)",
		backdropFilter: "blur(4px)",
	},
	expandBtn: {
		position: "absolute",
		top: 10,
		right: 10,
		width: 32,
		height: 32,
		borderRadius: "var(--radius-sm)",
		background: "rgba(0,0,0,0.5)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		opacity: 0,
		transition: "opacity 250ms ease",
		backdropFilter: "blur(4px)",
	},
	body: {
		padding: "0.875rem 1rem",
		display: "flex",
		flexDirection: "column",
		gap: "0.5rem",
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
	},
	meta: {
		display: "flex",
		alignItems: "center",
		gap: "0.75rem",
		flexWrap: "wrap",
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
	},
};

interface VideoCardProps {
	item: VideoItem;
	onOpen: (item: VideoItem) => void;
	onLike: (id: string) => void;
	onToast: (msg: string) => void;
}

const VideoCard: FC<VideoCardProps> = ({ item, onOpen, onLike, onToast }) => {
	const [hovered, setHovered] = useState(false);

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
			{/* ── Thumbnail Area ── */}
			<div style={s.thumbWrap}>
				<img
					src={item.thumbnail}
					alt={item.title}
					style={{
						...s.thumb,
						transform: hovered ? "scale(1.06)" : "scale(1)",
					}}
					loading="lazy"
				/>

				{/* ── Play Overlay ── */}
				<div style={{ ...s.overlay, opacity: hovered ? 1 : 0 }}>
					<div style={s.playBtn}>
						<Play size={24} color="#fff" fill="#fff" />
					</div>
				</div>

				{/* ── Format Badge ── */}
				<span style={s.badge}>{item.format}</span>

				{/* ── Duration ── */}
				<span style={s.duration}>{item.duration}</span>

				{/* ── Expand Button ── */}
				<button
					type="button"
					style={{ ...s.expandBtn, opacity: hovered ? 1 : 0 }}
					onClick={(e) => {
						e.stopPropagation();
						onOpen(item);
					}}
					aria-label="Expand video"
				>
					<Expand size={14} color="var(--color-white)" />
				</button>
			</div>

			{/* ── Body ── */}
			<div style={s.body}>
				<h3 style={s.title}>{item.title}</h3>
				<p style={s.desc}>{item.description}</p>

				{/* ── Metadata Row ── */}
				<div style={s.meta}>
					<span style={s.metaItem}>
						<Monitor size={11} />
						{item.dimensions}
					</span>
					<span style={s.metaItem}>
						<Clock size={11} />
						{item.duration}
					</span>
					<span style={s.metaItem}>
						<HardDrive size={11} />
						{item.fileSize}
					</span>

					{/* ── Action Buttons ── */}
					<div style={{ ...s.actions, opacity: hovered ? 1 : 0 }}>
						<button
							type="button"
							style={{
								...s.actionBtn,
								background: item.liked
									? "rgba(255, 80, 100, 0.15)"
									: "transparent",
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
			</div>
		</motion.article>
	);
};

export default VideoCard;
