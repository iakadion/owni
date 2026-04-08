/* ──────────────────────────────────────────────
 *  UploadZone Component
 *  Drag-and-drop upload com dashed border,
 *  hover highlight, drop activation e
 *  multi-format badge display
 * ────────────────────────────────────────────── */

import type { CSSProperties, FC } from "react";
import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloudUpload, FileVideo, FileAudio, FileImage, Check } from "lucide-react";

/* ── Formatos suportados ── */
const SUPPORTED_FORMATS = [
	{ label: "MP4", color: "#7c7cff" },
	{ label: "WEBM", color: "#5a5aee" },
	{ label: "MOV", color: "#8b5cf6" },
	{ label: "MP3", color: "#a78bfa" },
	{ label: "WAV", color: "#7c7cff" },
	{ label: "PNG", color: "#5a5aee" },
	{ label: "JPG", color: "#8b5cf6" },
	{ label: "WEBP", color: "#a78bfa" },
	{ label: "SVG", color: "#7c7cff" },
	{ label: "GIF", color: "#5a5aee" },
];

/* ── Estilos ── */
const s: Record<string, CSSProperties> = {
	container: {
		width: "100%",
		padding: "2rem",
		borderRadius: "var(--radius-lg)",
		border: "2px dashed rgba(124, 124, 255, 0.2)",
		background: "rgba(20, 20, 28, 0.3)",
		backdropFilter: "blur(12px)",
		WebkitBackdropFilter: "blur(12px)",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		gap: "1rem",
		cursor: "pointer",
		transition: "all 300ms cubic-bezier(0.16, 1, 0.3, 1)",
		position: "relative",
		overflow: "hidden",
		minHeight: 180,
	},
	containerHover: {
		borderColor: "rgba(124, 124, 255, 0.5)",
		background: "rgba(124, 124, 255, 0.04)",
		boxShadow: "0 0 30px rgba(124, 124, 255, 0.08)",
	},
	containerDrop: {
		borderColor: "rgba(124, 124, 255, 0.7)",
		background: "rgba(124, 124, 255, 0.08)",
		boxShadow: "0 0 40px rgba(124, 124, 255, 0.15)",
		transform: "scale(1.01)",
	},
	containerSuccess: {
		borderColor: "rgba(80, 200, 120, 0.5)",
		background: "rgba(80, 200, 120, 0.04)",
	},
	iconWrap: {
		width: 56,
		height: 56,
		borderRadius: "50%",
		background: "rgba(124, 124, 255, 0.1)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		border: "1px solid rgba(124, 124, 255, 0.1)",
	},
	heading: {
		fontSize: "var(--font-md)",
		fontWeight: 600,
		color: "var(--color-white)",
		textAlign: "center",
	},
	subtext: {
		fontSize: "var(--font-sm)",
		color: "var(--color-silver)",
		textAlign: "center",
	},
	formats: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		gap: "0.375rem",
		flexWrap: "wrap",
		maxWidth: 400,
	},
	formatBadge: {
		padding: "0.15rem 0.4rem",
		borderRadius: "var(--radius-sm)",
		fontSize: "0.625rem",
		fontWeight: 700,
		letterSpacing: "0.04em",
		border: "1px solid rgba(124, 124, 255, 0.12)",
	},
	hiddenInput: {
		display: "none",
	},
	fileList: {
		display: "flex",
		flexDirection: "column",
		gap: "0.5rem",
		width: "100%",
		maxWidth: 400,
	},
	fileItem: {
		display: "flex",
		alignItems: "center",
		gap: "0.5rem",
		padding: "0.5rem 0.75rem",
		borderRadius: "var(--radius-sm)",
		background: "rgba(255,255,255,0.03)",
		border: "1px solid var(--glass-border)",
		fontSize: "var(--font-sm)",
		color: "var(--color-silver-light)",
	},
	fileName: {
		flex: 1,
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	fileSize: {
		fontSize: "var(--font-xs)",
		color: "var(--color-silver)",
		flexShrink: 0,
	},
};

/** Retorna ícone baseado no tipo MIME */
const getFileIcon = (type: string) => {
	if (type.startsWith("video/")) return FileVideo;
	if (type.startsWith("audio/")) return FileAudio;
	return FileImage;
};

interface UploadZoneProps {
	onUpload: (files: File[]) => void;
	onToast: (msg: string) => void;
}

const UploadZone: FC<UploadZoneProps> = ({ onUpload, onToast }) => {
	const [isDragging, setIsDragging] = useState(false);
	const [isHovering, setIsHovering] = useState(false);
	const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
	const [showSuccess, setShowSuccess] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const dragCounter = useRef(0);

	const handleFiles = useCallback(
		(files: FileList | null) => {
			if (!files || files.length === 0) return;
			const fileArray = Array.from(files);
			setDroppedFiles(fileArray);
			setShowSuccess(true);
			onUpload(fileArray);
			onToast(`${fileArray.length} file${fileArray.length > 1 ? "s" : ""} uploaded successfully`);
			setTimeout(() => setShowSuccess(false), 3000);
		},
		[onUpload, onToast],
	);

	const handleDragEnter = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		dragCounter.current++;
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		dragCounter.current--;
		if (dragCounter.current === 0) setIsDragging(false);
	}, []);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			dragCounter.current = 0;
			setIsDragging(false);
			handleFiles(e.dataTransfer.files);
		},
		[handleFiles],
	);

	const containerStyle: CSSProperties = {
		...s.container,
		...(showSuccess ? s.containerSuccess : {}),
		...(isDragging ? s.containerDrop : isHovering ? s.containerHover : {}),
	};

	return (
		<motion.div
			style={containerStyle}
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
			onDragEnter={handleDragEnter}
			onDragLeave={handleDragLeave}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
			onClick={() => inputRef.current?.click()}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
			whileHover={{ scale: 1.005 }}
		>
			{/* ── Hidden File Input ── */}
			<input
				ref={inputRef}
				type="file"
				multiple
				accept="video/*,audio/*,image/*"
				style={s.hiddenInput}
				onChange={(e) => handleFiles(e.target.files)}
			/>

			{/* ── Icon ── */}
			<div style={s.iconWrap}>
				{showSuccess ? (
					<Check size={24} color="#50c878" />
				) : (
					<CloudUpload
						size={24}
						color={isDragging ? "#a5a5ff" : "#7c7cff"}
					/>
				)}
			</div>

			{/* ── Text ── */}
			<p style={s.heading}>
				{isDragging
					? "Drop files here"
					: showSuccess
						? "Upload complete!"
						: "Drag & drop media files"}
			</p>
			<p style={s.subtext}>
				{isDragging
					? "Release to upload your site, app & tool previews"
					: "or click to browse — add new site, app and tool previews"}
			</p>

			{/* ── Format Badges ── */}
			{!showSuccess && (
				<div style={s.formats}>
					{SUPPORTED_FORMATS.map((fmt) => (
						<span
							key={fmt.label}
							style={{
								...s.formatBadge,
								background: `${fmt.color}15`,
								color: fmt.color,
							}}
						>
							{fmt.label}
						</span>
					))}
				</div>
			)}

			{/* ── Dropped Files List ── */}
			<AnimatePresence>
				{showSuccess && droppedFiles.length > 0 && (
					<motion.div
						style={s.fileList}
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
					>
						{droppedFiles.slice(0, 5).map((file) => {
							const Icon = getFileIcon(file.type);
							return (
								<div key={file.name} style={s.fileItem}>
									<Icon size={14} color="#a5a5ff" />
									<span style={s.fileName}>{file.name}</span>
									<span style={s.fileSize}>
										{(file.size / (1024 * 1024)).toFixed(1)} MB
									</span>
								</div>
							);
						})}
						{droppedFiles.length > 5 && (
							<span style={{ ...s.fileSize, textAlign: "center" }}>
								+{droppedFiles.length - 5} more files
							</span>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

export default UploadZone;
