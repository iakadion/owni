/* ──────────────────────────────────────────────
 *  Utility Helpers
 *  Funções auxiliares reutilizáveis
 * ────────────────────────────────────────────── */

/** Gera um ID único simples */
export const uid = (): string =>
	`${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

/** Classnames condicionais — junta classes filtrando falsy */
export const cn = (...classes: (string | false | null | undefined)[]): string =>
	classes.filter(Boolean).join(" ");

/** Debounce genérico */
export const debounce = <T extends (...args: unknown[]) => void>(
	fn: T,
	ms: number,
): ((...args: Parameters<T>) => void) => {
	let timer: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timer);
		timer = setTimeout(() => fn(...args), ms);
	};
};

/** Formata contagem com separador de milhar */
export const formatCount = (n: number): string =>
	n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
