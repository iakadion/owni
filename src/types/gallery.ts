/* ──────────────────────────────────────────────
 *  Gallery Type Definitions
 *  Tipos centrais para todo o sistema de galeria
 * ────────────────────────────────────────────── */

/** Categorias de mídia disponíveis para filtragem */
export type MediaCategory = "All" | "Sites" | "Apps" | "Tools" | "Components";

/** Tipos de mídia suportados */
export type MediaType = "video" | "audio" | "image";

/** Variantes de aspect ratio para imagens */
export type AspectRatio = "tall" | "normal" | "wide";

/** Estado de reprodução de áudio/vídeo */
export type PlaybackState = "idle" | "playing" | "paused";

/** Formatos de arquivo suportados */
export type FileFormat =
	| "MP4"
	| "WEBM"
	| "MOV"
	| "MP3"
	| "WAV"
	| "OGG"
	| "FLAC"
	| "PNG"
	| "JPG"
	| "WEBP"
	| "SVG"
	| "GIF";

/** Item de mídia base — campos compartilhados */
interface MediaItemBase {
	id: string;
	title: string;
	description: string;
	category: Exclude<MediaCategory, "All">;
	thumbnail: string;
	createdAt: string;
	liked: boolean;
}

/** Item de vídeo — demos de apps, walkthroughs de sites, gravações de tela */
export interface VideoItem extends MediaItemBase {
	type: "video";
	src: string;
	format: Extract<FileFormat, "MP4" | "WEBM" | "MOV">;
	duration: string;
	dimensions: string;
	fileSize: string;
}

/** Item de áudio — podcasts, tutoriais, previews de som */
export interface AudioItem extends MediaItemBase {
	type: "audio";
	src: string;
	format: Extract<FileFormat, "MP3" | "WAV" | "OGG" | "FLAC">;
	duration: string;
	fileSize: string;
	waveformData: number[];
}

/** Item de imagem — screenshots, mockups, capturas de interface */
export interface ImageItem extends MediaItemBase {
	type: "image";
	src: string;
	format: Extract<FileFormat, "PNG" | "JPG" | "WEBP" | "SVG" | "GIF">;
	aspectRatio: AspectRatio;
	dimensions: string;
	fileSize: string;
}

/** União discriminada de todos os tipos de mídia */
export type GalleryItem = VideoItem | AudioItem | ImageItem;

/** Estado do toast notification */
export interface ToastState {
	id: string;
	message: string;
	type: "success" | "info" | "error";
	visible: boolean;
}

/** Estado do lightbox */
export interface LightboxState {
	isOpen: boolean;
	item: GalleryItem | null;
}

/** Estado do upload via drag-and-drop */
export interface UploadState {
	isDragging: boolean;
	isHovering: boolean;
	isDropped: boolean;
	files: File[];
}
