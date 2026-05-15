import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

//Authentication
export const authenticateMiddleware = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authentication failed!" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (!decoded) {
      return res.status(401).json({ message: "Authentication failed!" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).json({ message: `Error:${error}` });
  }
};
