/**
 * Every GraphQL document the product sends, as static text, server-side.
 *
 * These lived in `client/src/constants/graphqlQueries.ts` until the proxy
 * existed. They cannot stay there: whatever the browser can send, an attacker
 * can rewrite, and the proxy holds a token. A `query` field arriving from a
 * client would have to be either executed — the pre-P08 injection, now
 * authenticated — or ignored, in which case shipping it was pointless. So the
 * client sends `{ login }` and nothing else, and the document is chosen here
 * by which endpoint was called.
 *
 * Nothing interpolates. A login travels in `variables`, where it cannot be
 * parsed as query syntax. The attack this closes was a login of
 *
 *   a") {__typename} viewer {login email} z: repositoryOwner(login:"b
 *
 * reachable as a percent-encoded route parameter, which React Router decodes —
 * it closed the string literal and appended a `viewer { login email }`
 * selection resolving to the token owner. See report/vulnerabilities/02.
 *
 * Operations are named so they stay identifiable in GitHub's API logs.
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
