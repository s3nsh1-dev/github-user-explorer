/**
 * The repository list's page arithmetic, as pure functions.
 *
 * `Pagination` computed `Math.ceil(totalRepos / 8)` inline on a prop that was
 * declared `number` but actually arrived `undefined` while the profile request
 * was in flight. `Math.ceil(undefined / 8)` is `NaN`, and `NaN <= 3` and
 * `NaN > 3` are *both* false — so neither branch ran, no page numbers
 * rendered, the "last page" button linked to `?page=NaN`, and
 * `disabled={page === totalPages}` never fired because `NaN !== NaN`.
 * report/suggestions/03 §3b.
 *
 * Extracted here because this is the part worth testing (P30) and because the
 * page size was a magic `8` in two files — the hook that requests a page and
 * the bar that counts them. If those ever diverge, pagination silently breaks.
 */

/** Repositories per page. Both the request and the page count use this. */
export const PER_PAGE = 8;

export const totalPageCount = (totalRepos: number): number =>
  Number.isFinite(totalRepos) && totalRepos > 0
    ? Math.ceil(totalRepos / PER_PAGE)
    : 0;

/**
 * The URL a page control points at.
 *
 * One definition, because there are now two components rendering these as
 * real `<a href>`s (P23) and a third computing the same string is how the
 * shapes drift. The login is encoded for the reason P07 encodes it in the API
 * URLs: it arrives from a route param, and a raw `/` in it would silently
 * become a different route.
 */
export const repoPageLink = (username: string, page: number): string =>
  `/user/${encodeURIComponent(username)}?${new URLSearchParams({
    tab: "repositories",
    page: String(page),
  })}`;

/** The (up to 3) page numbers to show around `page`. */
export const pageWindow = (page: number, totalPages: number): number[] => {
  if (!Number.isFinite(totalPages) || totalPages < 1) return [];
  if (totalPages <= 3) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const start = Math.min(Math.max(page, 1), totalPages - 2);
  return [start, start + 1, start + 2];
};
