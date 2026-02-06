import arcjet, { tokenBucket, detectBot } from "@arcjet/node";

const aj = arcjet({
    key: process.env.ARCJET_KEY,
    rules: [
        tokenBucket({
            mode: "LIVE",
            characteristics: ["ip.src"],
            refillRate: 10,
            interval: 10,
            capacity: 100,
        }),
        detectBot({
            mode: process.env.ARCJET_MODE || "DRY_RUN",
            allow: [
                "CATEGORY:SEARCH_ENGINE",
                "LIKELY_AUTOMATED"
            ],
        }),
    ],
});

const arcjetMiddleware = async (req, res, next) => {
    const skipPaths = [
        '/health',
        '/api/health',
        '/',
        '/status',
        '/favicon.ico'
    ];

    if (req.method === 'OPTIONS') {
        return next();
    }

    if (skipPaths.includes(req.path)) {
        return next();
    }

    if (process.env.DISABLE_ARCJET === 'true') {
        return next();
    }

    if (!process.env.ARCJET_KEY) {
        console.warn('ARCJET_KEY not set, skipping protection');
        return next();
    }

    try {
        const decision = await aj.protect(req);

        if (decision.isDenied() && process.env.ARCJET_MODE === "DRY_RUN") {
            console.log("Arcjet would have blocked:", {
                ip: req.ip,
                path: req.path,
                method: req.method,
                reason: decision.reason,
                userAgent: req.get('user-agent')?.substring(0, 100)
            });
            return next();
        }

        if (decision.isDenied()) {
            console.log("Arcjet blocked request:", {
                ip: req.ip,
                path: req.path,
                reason: decision.reason
            });

            return res.status(403).json({
                error: "Forbidden",
                message: "Request blocked by security system"
            });
        }

        next();
    } catch (error) {
        console.error("Arcjet error:", error.message);
        next();
    }
};

export default arcjetMiddleware;