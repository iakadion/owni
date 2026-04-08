/* ──────────────────────────────────────────────
 *  useGallery Hook
 *  Gerencia estado central da galeria:
 *  filtragem, busca, likes, lightbox e toasts
 * ────────────────────────────────────────────── */

import { useCallback, useMemo, useRef, useState } from "react";
import type { GalleryItem, LightboxState, MediaCategory, ToastState } from "@/types/index.ts";
import { galleryItems as initialItems } from "@/data/galleryData.ts";
import { uid } from "@/utils/helpers.ts";

export const useGallery = () => {
	/* ── Items State ── */
	const [items, setItems] = useState<GalleryItem[]>(initialItems);
	const [activeCategory, setActiveCategory] = useState<MediaCategory>("All");
	const [searchQuery, setSearchQuery] = useState("");

	/* ── Lightbox State ── */
	const [lightbox, setLightbox] = useState<LightboxState>({
		isOpen: false,
		item: null,
	});

	/* ── Toast State ── */
	const [toasts, setToasts] = useState<ToastState[]>([]);
	const toastTimeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

	/* ── Filtered Items ── */
	const filteredItems = useMemo(() => {
		let result = items;

		/* Filtro por categoria */
		if (activeCategory !== "All") {
			result = result.filter((item) => item.category === activeCategory);
		}

		/* Filtro por busca */
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase();
			result = result.filter(
				(item) =>
					item.title.toLowerCase().includes(q) ||
					item.description.toLowerCase().includes(q) ||
					item.category.toLowerCase().includes(q),
			);
		}

		return result;
	}, [items, activeCategory, searchQuery]);

	/* ── Category Counts ── */
	const categoryCounts = useMemo(() => {
		const counts: Record<MediaCategory, number> = {
			All: items.length,
			Sites: 0,
			Apps: 0,
			Tools: 0,
			Components: 0,
		};
		for (const item of items) {
			counts[item.category]++;
		}
		return counts;
	}, [items]);

	/* ── Actions ── */
	const handleCategoryChange = useCallback((category: MediaCategory) => {
		setActiveCategory(category);
	}, []);

	const handleSearch = useCallback((query: string) => {
		setSearchQuery(query);
	}, []);

	const handleLike = useCallback((id: string) => {
		setItems((prev) =>
			prev.map((item) => (item.id === id ? { ...item, liked: !item.liked } : item)),
		);
	}, []);

	const handleOpenLightbox = useCallback((item: GalleryItem) => {
		setLightbox({ isOpen: true, item });
	}, []);

	const handleCloseLightbox = useCallback(() => {
		setLightbox({ isOpen: false, item: null });
	}, []);

	const showToast = useCallback(
		(message: string, type: ToastState["type"] = "success") => {
			const id = uid();
			const toast: ToastState = { id, message, type, visible: true };
			setToasts((prev) => [...prev, toast]);

			/* Auto-dismiss após 3.5s */
			const timeout = setTimeout(() => {
				setToasts((prev) =>
					prev.map((t) => (t.id === id ? { ...t, visible: false } : t)),
				);
				/* Remove do array após animação de saída */
				setTimeout(() => {
					setToasts((prev) => prev.filter((t) => t.id !== id));
				}, 400);
			}, 3500);

			toastTimeouts.current.set(id, timeout);
		},
		[],
	);

	const dismissToast = useCallback((id: string) => {
		const timeout = toastTimeouts.current.get(id);
		if (timeout) {
			clearTimeout(timeout);
			toastTimeouts.current.delete(id);
		}
		setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, visible: false } : t)));
		setTimeout(() => {
			setToasts((prev) => prev.filter((t) => t.id !== id));
		}, 400);
	}, []);

	const handleUpload = useCallback((_files: File[]) => {
		/* Placeholder — em produção, faria upload real */
	}, []);

	return {
		/* State */
		items: filteredItems,
		allItems: items,
		activeCategory,
		categoryCounts,
		lightbox,
		toasts,

		/* Actions */
		handleCategoryChange,
		handleSearch,
		handleLike,
		handleOpenLightbox,
		handleCloseLightbox,
		showToast,
		dismissToast,
		handleUpload,
	};
};
