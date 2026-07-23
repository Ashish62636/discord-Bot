import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Standard API response envelope.
 * Every API route returns { success, data?, error?, meta? }.
 */
export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json(
    { success: true, data },
    { status }
  );
}

export function apiError(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(details ? { details } : {}),
    },
    { status }
  );
}

export function apiValidationError(err: ZodError) {
  return apiError(
    "Validation failed",
    422,
    err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }))
  );
}

/**
 * Wraps a route handler with try/catch and Zod error handling.
 */
export function withErrorHandler(
  handler: (req: Request, context: { params: Record<string, string> }) => Promise<NextResponse>
) {
  return async (req: Request, context: { params: Record<string, string> }) => {
    try {
      return await handler(req, context);
    } catch (err) {
      if (err instanceof ZodError) {
        return apiValidationError(err);
      }
      console.error("[API Error]", err);
      return apiError("Internal server error", 500);
    }
  };
}
