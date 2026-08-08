import { Alert, AlertTitle, Button } from "@mui/material";
import { NotFoundError, RateLimitError } from "../helper/githubErrors";

/**
 * The one way this app renders a failed request.
 *
 * Six places used to print an error value straight into an unstyled `<div>`,
 * and one stringified the error object whole — six unthemed divs in an app
 * with a custom dark mode, each leaking an internal implementation string
 * (report/vulnerabilities/09).
 *
 * **Two layers, deliberately.** The fetch layer *throws* detailed, typed
 * errors so they reach the console and the React Query devtools; this
 * component *renders* a classified generic one. That is why
 * vulnerabilities/05 ("do not swallow errors") and /09 ("do not disclose
 * them") are both right — they are talking about different layers.
 *
 * Branch on `instanceof`, never on message text: since S4 the proxy answers
 * with a fixed error code and never GitHub's own text, so the status is what
 * carries meaning and `helper/githubFetch.ts` has already turned it into one
 * of these classes. Rewording a message must not change what renders.
 */
const describe = (error: unknown): { title: string; body: string } => {
  if (error instanceof RateLimitError) {
    return {
      title: "GitHub rate limit reached",
      body: `Too many requests to GitHub right now. Try again after ${error.resetAt.toLocaleTimeString()}.`,
    };
  }
  if (error instanceof NotFoundError) {
    return {
      title: "Not found",
      body: "That GitHub user or repository doesn’t exist.",
    };
  }
  return {
    title: "Something went wrong",
    body: "Couldn’t load data from GitHub. Please try again.",
  };
};

type Props = {
  error: unknown;
  onRetry?: () => void;
  /** Extra `sx` for the Alert, so call sites can keep their own spacing. */
  sx?: React.ComponentProps<typeof Alert>["sx"];
};

const ErrorState = ({ error, onRetry, sx }: Props) => {
  if (import.meta.env.DEV) console.error(error);
  const { title, body } = describe(error);

  return (
    <Alert
      severity="error"
      sx={{ maxWidth: 700, mx: "auto", my: 4, ...sx }}
      action={
        onRetry && (
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        )
      }
    >
      <AlertTitle>{title}</AlertTitle>
      {body}
    </Alert>
  );
};

export default ErrorState;
