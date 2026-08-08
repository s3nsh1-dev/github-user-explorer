/**
 * `GET /api/repo?owner=:owner&name=:name` → GitHub `GET /repos/:owner/:name`
 *
 * The repository detail page. This is the endpoint that redirects: GitHub 301s
 * a renamed repository to `/repositories/:id`, and `proxyRest` follows it.
 */
import {
  badRequest,
  endpoint,
  proxyRest,
  readLogin,
  readRepoName,
} from "./_shared/github.mts";

export default endpoint(async (req) => {
  const owner = readLogin(req, "owner");
  const name = readRepoName(req, "name");
  if (owner === null || name === null) return badRequest();

  return proxyRest(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`
  );
});
