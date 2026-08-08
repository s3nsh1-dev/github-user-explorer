/**
 * `parseInt(searchParams.get("page") || "1", 10)` returns NaN for `?page=abc`,
 * and that NaN travels straight into the request URL. Anything that is not a
 * page number falls back to page 1.
 */
export const parsePage = (raw: string | null | undefined): number => {
  const n = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
};
