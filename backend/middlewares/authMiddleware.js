import jwt from "jsonwebtoken";

// Middleware to authenticate the user
export const authenticateUser = (req, res, next) => {
    // Extract the Authorization header from the request
    const authHeader = req.headers.authorization;
    

    // Check if the Authorization header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token, authorization denied." });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1];
    console.log(token);

    try {
        // Verify the token using the secret key from the environment variable
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);

        // Attach the decoded user data to the request object
        req.user = decoded;

        // Call the next middleware or route handler
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token." });
    }
};
