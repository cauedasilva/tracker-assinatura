import aj from '../config/arcjet.js';
import { NODE_ENV } from '../config/env.js';

const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, { requested: 1 });

        for (const result of decision.results) {
            const reason = result.reason;

            if (reason.type === "RATE_LIMIT" && reason.remaining <= 0) {
                return res.status(429).json({
                    error: "Rate limit exceeded",
                    reset: reason.reset,
                });
            }

            if (NODE_ENV === "production") {
                if (reason.type === "BOT" && !reason.allowed.includes("CATEGORY:SEARCH_ENGINE")) {
                    return res.status(403).json({
                        error: "Bot detected",
                        reset: reason.reset
                    });
                }
            }

        }

        next();
    } catch (error) {
        console.log(`Arcjet Middleware Error: ${error}`);
        next(error);
    }
}

export default arcjetMiddleware;