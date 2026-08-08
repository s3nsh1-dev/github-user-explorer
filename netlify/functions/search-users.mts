/**
 * `GET /api/search-users?q=&page=&per_page=` → GitHub `GET /search/users`
 *
 * Backs the infinite-scrolling explore page. `q` is passed through as a single
 * parameter, so `a&per_page=100` stays one value instead of smuggling a second
 * parameter into the upstream request — the tampering vulnerabilities/03
 * describes.
 */
import {
  badRequest,
  endpoint,
  proxyRest,
  readInt,
  readSearchQuery,
} from "./_shared/github.mts";

export default endpoint(async (req) => {
  const q = readSearchQuery(req);
  if (q === null) return badRequest();

  const search = new URLSearchParams({
    q,
    page: String(readInt(req, "page", 1, 100)),
    per_page: String(readInt(req, "per_page", 20, 100)),
  });

  return proxyRest("/search/users", search);
});
