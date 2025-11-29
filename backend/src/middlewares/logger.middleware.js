function loggerMiddleware(req, res, next) {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - startTime;
    const logData = {
      timestamp,
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get("user-agent"),
      ip: req.ip || req.connection.remoteAddress,
      userId: req.user?.id || "anonymous"
    };

    console.log(`[${logData.timestamp}] ${logData.method} ${logData.url} ${logData.statusCode} - ${logData.duration} - User: ${logData.userId}`);
    
    if (res.statusCode >= 400) {
      console.error(`[ERROR] ${logData.method} ${logData.url} - Status: ${logData.statusCode}`, {
        body: req.body,
        params: req.params,
        query: req.query
      });
    }

    return originalSend.call(this, data);
  };

  next();
}

export { loggerMiddleware };

