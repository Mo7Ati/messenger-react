import type { ApiError } from './api'

/** Type guard: is the thrown value our normalized ApiError? */
export function isApiError(err: unknown): err is ApiError {
  return (
    err != null &&
    typeof err === 'object' &&
    'status' in err &&
    typeof (err as ApiError).status === 'number' &&
    'message' in err &&
    typeof (err as ApiError).message === 'string'
  )
}

/** Get a user-facing message from any thrown error (ApiError, backend body, or string). */
export function getErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
  if (isApiError(err)) return err.message
  if (err && typeof err === 'object' && 'message' in err)
    return String((err as { message: unknown }).message)
  if (typeof err === 'string') return err
  return fallback
}

/** Check if the error is a 404 Not Found. */
export function isNotFound(err: unknown): boolean {
  return isApiError(err) && err.status === 404
}

/** Check if the error is 401 Unauthorized. */
export function isUnauthorized(err: unknown): boolean {
  return isApiError(err) && err.status === 401
}

/** Get HTTP status from error, or undefined if not an ApiError. */
export function getErrorStatus(err: unknown): number | undefined {
  return isApiError(err) ? err.status : undefined
}
