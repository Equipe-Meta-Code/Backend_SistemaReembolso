import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

interface AuthRequest extends Request {
    user?: string;
}

const isAuthenticated = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Obter o token do cabeçalho
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new Error("Token não fornecido");
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            throw new Error("Token inválido");
        }

        // Verificar token
        jwt.verify(token, "anyKey", (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
            if (err || !decoded || typeof decoded !== 'object') {
                return next(new Error("Token expirado ou inválido, faça login novamente"));
            }
            
            req.user = (decoded as JwtPayload).id;
            next();
        });
    } catch (error) {
        next(error);
    }
};

export default isAuthenticated;