export type ModeType = "light" | "dark";

export type ModeContextType = {
  mode: ModeType;
  handleSettingMode: (mode: ModeType) => void;
};

export type GitHubUser = {
  id: string; // node_id
  username: string; // login
  name: string | null;
  avatar_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  joined: string; // created_at
  lastActive: string; // updated_at
  followers: number;
  following: number;
  followers_url: string;
  following_url: string;
  html_url: string; // Main GitHub profile link
  public_repos: number;
  repos_url: string;
  login: string;
  email: string;
  hirable: string;
  accountType: string;
  blog: string | null;
  gists: number;
  x_handle: string;
  starred_url: string;
};
export type GitHubApiUser = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  name: string | null;
  created_at: string;
  updated_at: string;
  followers: number;
  following: number;
  followers_url: string;
  following_url: string;
  public_repos: number;
  repos_url: string;
  email: string;
  hireable: boolean;
  type: string;
  blog: string | null;
  public_gists: number;
  twitter_username: string | null;
  starred_url: string;
  // You can add more fields if needed
};

export type UserObjectType = {
  login: string;
  avatar_url: string;
  html_url: string;
  id: number;
  repos_url: string;
};

export type UserCardsProps = {
  userName: string;
  imageURL: string;
  githubURL: string;
  seeRepos: string;
};

export type Repo = {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  full_name: string;
  url: string;
};
export type PaginationProps = {
  page: number;
  username: string;
  totalRepos: number;
  changePageNumber: (value: number) => void;
};

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  size: number;
  visibility: string;
  default_branch: string;
  license: { name: string } | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

export interface GitHubUserSearchResult {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubUser[];
}
export type OrganizationTop10ReposType = {
  data: {
    organization: {
      repositories: {
        nodes: {
          name: string;
          description: string;
          stargazerCount: number | null;
          updatedAt: string;
        }[];
      };
    };
  };
};

export type OrganizationRepoResponseType = {
  data: OrganizationTop10ReposType | undefined;
  isLoading: boolean;
  error: Error | unknown;
};

// Type for GitHub user contribution calendar GraphQL response
export type ContributionCalendarResponse = {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: Array<{
            contributionDays: Array<{
              date: string;
              contributionCount: number;
              color: string;
            }>;
          }>;
        };
      };
    };
  };
};

export type ContributionCalenderResponseType = {
  data: ContributionCalendarResponse | undefined;
  isLoading: boolean;
  error: Error | unknown;
};
