import { Request, Response, NextFunction } from "express";
import { prisma } from "../../lib/prisma.js";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Unauthorized: Please log in" });
  }

  try {
    const cookieHeader = req.cookies['connect.sid'];
    let sessionId = req.sessionID;

    if (cookieHeader && cookieHeader.startsWith('s:')) {
      sessionId = cookieHeader.split('.')[0].substring(2);
    }

    const session = await prisma.session.findUnique({
      where: { sid: sessionId },
    });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ message: "Session expired or invalid. Please log in again." });
    }

    // Since userId column is NULL in your DB, we parse it from the 'data' JSON string
    const sessionData = JSON.parse(session.data);
    if (!sessionData.userId || sessionData.userId !== req.session.userId) {
      return res.status(401).json({ message: "Invalid session data" });
    }

    return next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Internal server error during authentication" });
  }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  // This would require fetching the user from DB to check role
  // For now, let's assume the user is fetched in a separate middleware or here
  // But standard session-based auth often relies on session data
  next(); // Placeholder
};
