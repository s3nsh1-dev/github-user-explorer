/**
 * `GET /api/users?login=:login` → GitHub `GET /users/:login`
 *
 * The profile payload behind every `/user/:login` page.
 */
import { badRequest, endpoint, proxyRest, readLogin } from "./_shared/github.mts";

export default endpoint(async (req) => {
  const login = readLogin(req);
  if (login === null) return badRequest();

  return proxyRest(`/users/${encodeURIComponent(login)}`);
});
