/**
 * Every GraphQL document the client sends, as static text.
 *
 * Nothing here interpolates. A login travels in the `variables` object, where
 * it can never be parsed as query syntax — that is the whole fix for
 * vulnerabilities/02. Previously a login of
 *
 *   a") {__typename} viewer {login email} z: repositoryOwner(login:"b
 *
 * (reachable as a percent-encoded route param, which React Router decodes)
 * closed the string literal and appended a `viewer { login email }` selection
 * that resolves to the token owner.
 *
 * Operations are named so they also show up identifiably in GitHub's API logs.
 *
 * ⚠️ If B2 lands on a backend proxy (P34), these constants must move
 * server-side and the client must send only `{ login }`. A proxy that forwards
 * a client-supplied `query` string is exactly as vulnerable as the code this
 * file replaces — with a secret token behind it.
 */

export const OWNER_TYPE_QUERY = /* GraphQL */ `
  query OwnerType($login: String!) {
    repositoryOwner(login: $login) {
      __typename
    }
  }
`;

export const CONTRIBUTIONS_QUERY = /* GraphQL */ `
  query Contributions($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
      }
    }
  }
`;

export const ORG_TOP_REPOS_QUERY = /* GraphQL */ `
  query OrgTopRepos($login: String!) {
    organization(login: $login) {
      repositories(first: 10, orderBy: { field: UPDATED_AT, direction: DESC }) {
        nodes {
          name
          description
          stargazerCount
          updatedAt
        }
      }
    }
  }
`;
