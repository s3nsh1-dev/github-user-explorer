/**
 * `GET /api/user-repos?login=:login&page=&per_page=` → GitHub
 * `GET /users/:login/repos`
 *
 * One page of the repositories tab. `per_page` is capped at GitHub's own
 * maximum so a caller cannot turn one page view into a 100-item response.
 */
import {
  badRequest,
  endpoint,
  proxyRest,
  readInt,
  readLogin,
} from "./_shared/github.mts";

export default endpoint(async (req) => {
  const login = readLogin(req);
  if (login === null) return badRequest();

  const search = new URLSearchParams({
    page: String(readInt(req, "page", 1, 1000)),
    per_page: String(readInt(req, "per_page", 8, 100)),
  });

  return proxyRest(`/users/${encodeURIComponent(login)}/repos`, search);
});
