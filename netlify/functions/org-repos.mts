/**
 * `GET /api/org-repos?login=:login` → GraphQL `OrgTopRepos`
 *
 * The ten most recently updated repositories of an organization.
 */
import { badRequest, endpoint, proxyGraphQL, readLogin } from "./_shared/github.mts";
import { ORG_TOP_REPOS_QUERY } from "./_shared/queries.mts";

export default endpoint(async (req) => {
  const login = readLogin(req);
  if (login === null) return badRequest();

  return proxyGraphQL(ORG_TOP_REPOS_QUERY, { login });
});
