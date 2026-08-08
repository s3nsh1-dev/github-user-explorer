/**
 * The only Node global the functions touch.
 *
 * This file sits outside functions/ on purpose — Netlify would otherwise try
 * to deploy it as a function called `globals.d` and fail the build on the
 * illegal name. `functions/tsconfig.json` pulls it back in by path.
 *
 * That tsconfig sets `"types": []` so nothing is pulled in implicitly
 * from `client/node_modules/@types`; everything else the functions use
 * (`fetch`, `Request`, `Response`, `URL`, `URLSearchParams`) is a web standard
 * and comes from the `DOM` lib. Declaring the one exception by hand keeps the
 * function bundle free of a `@types/node` dependency it would otherwise need
 * only for this.
 */
declare const process: {
  readonly env: Record<string, string | undefined>;
};
