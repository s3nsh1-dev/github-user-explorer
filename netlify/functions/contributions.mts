/**
 * `GET /api/contributions?login=:login` → GraphQL `Contributions`
 *
 * The contribution calendar. This endpoint is the entire reason the proxy
 * exists rather than a token-free client: the calendar is GraphQL-only, and
 * GitHub's GraphQL API refuses unauthenticated requests (decision B2).
 */
import { badRequest, endpoint, proxyGraphQL, readLogin } from "./_shared/github.mts";
import { CONTRIBUTIONS_QUERY } from "./_shared/queries.mts";

export default endpoint(async (req) => {
  const login = readLogin(req);
  if (login === null) return badRequest();

  return proxyGraphQL(CONTRIBUTIONS_QUERY, { login });
});
