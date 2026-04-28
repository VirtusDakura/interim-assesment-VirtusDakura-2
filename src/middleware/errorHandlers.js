export function notFound(req, res) {
  return res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err?.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(" ") });
  }

  if (err?.type === "entity.parse.failed" || err instanceof SyntaxError) {
    return res.status(400).json({ message: "Malformed JSON in request body." });
  }

  if (err?.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return res.status(409).json({ message: `Duplicate value for ${field}.` });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error.";

  return res.status(statusCode).json({ message });
}
