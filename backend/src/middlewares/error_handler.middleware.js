function errorHandler(err, req, res, next) {
  if (err && err.statusCode) {
    res.status(err.statusCode).json({
      message: err.message,
      details: err.details,
    });
    return;
  }

  if (err && err.issues && Array.isArray(err.issues)) {
    res.status(400).json({
      message: "Validation failed",
      details: err.issues,
    });
    return;
  }

  res.status(500).json({
    name: err.name || "Error",
    message: err.message || "Internal Server Error",
  });
}

export { errorHandler };
