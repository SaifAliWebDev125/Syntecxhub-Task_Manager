// Wraps async route handlers so rejected promises flow into Express's error middleware
// instead of needing try/catch in every controller.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
