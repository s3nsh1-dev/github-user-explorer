/**
 * `GET /api/owner-type?login=:login` → GraphQL `OwnerType`
 *
 * Tells the profile page whether a login is a User or an Organization, which
 * decides whether it renders a contribution graph or the org's top repos.
 */
import { badRequest, endpoint, proxyGraphQL, readLogin } from "./_shared/github.mts";
import { OWNER_TYPE_QUERY } from "./_shared/queries.mts";

export default endpoint(async (req) => {
  const login = readLogin(req);
  if (login === null) return badRequest();

  return proxyGraphQL(OWNER_TYPE_QUERY, { login });
});
