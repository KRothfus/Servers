export function middlewareLogResponses(req, res, next) {
    res.on('finish', () => {
        if (res.statusCode >= 400) {
            console.log(`[NON-OK] ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`);
        }
    });
    next();
}
;
// streak 2
// streak 3
// streak 4
// streak 5
// streak 6
// streak 7
// streak 8
