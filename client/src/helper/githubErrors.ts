/**
 * Typed errors for every GitHub request.
 *
 * These are classes rather than a discriminated union on purpose: `instanceof`
 * is what the retry predicate (P11) and the error renderer (P13) need, and a
 * union would force both of them to re-derive the shape.
 *
 * Note: `class X extends Error` subclassing behaves correctly here because the
 * build targets ES2020, not ES5.
 *
 * Fields are declared and assigned rather than written as constructor parameter
 * properties — `erasableSyntaxOnly` is on in tsconfig.app.json, which bans them.
 */

export class GitHubError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "GitHubError";
    this.status = status;
  }
}

export class NotFoundError extends GitHubError {
  constructor(what = "Resource") {
    super(`${what} not found`, 404);
    this.name = "NotFoundError";
  }
}

export class RateLimitError extends GitHubError {
  readonly resetAt: Date;

  constructor(resetAt: Date) {
    super("GitHub rate limit reached", 403);
    this.name = "RateLimitError";
    this.resetAt = resetAt;
  }
}
