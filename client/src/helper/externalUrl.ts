/**
 * Turns a GitHub profile's `blog` field into something safe to put in an
 * `href`, or `null` if it cannot be one.
 *
 * Two problems, both from the same source: this value is typed by the profile
 * owner and GitHub does not normalise it.
 *
 *   - **It is usually not a URL.** `"example.com"`, `"www.example.com"` and
 *     `"@handle"` are all common. `<a href="example.com">` is a *relative*
 *     path, so it would navigate inside this app to `/user/example.com`
 *     instead of leaving the site.
 *   - **It can be any scheme.** `javascript:…` in an `href` executes on click.
 *     That is stored XSS with a third party filling in the payload, so the
 *     allow-list is not optional: **http and https only.**
 */
export const toExternalUrl = (raw: string | null | undefined): string | null => {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (trimmed === "") return null;

  // No scheme means "assume the web", which is what the visitor meant when
  // they typed `example.com` into GitHub's website field.
  const candidate = /^[a-z][a-z0-9+.-]*:/i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  // A scheme alone is not a destination: `https://` parses, and links nowhere.
  if (url.hostname === "") return null;

  return url.toString();
};
