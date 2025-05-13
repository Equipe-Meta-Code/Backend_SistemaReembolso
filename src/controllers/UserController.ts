import { Request, Response, NextFunction } from "express";
import User from "../models/UserModel"; // Alterado de UserModel para User
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
    user?: number;
}

class UserController {
    // Register
    static register = asyncHandler(async (req: Request, res: Response) => {
        const { name, email, password } = req.body;

        // Validations
        if (!name || !email || !password) {
            res.status(400).json({ 
                message: "Por favor, preencha todos os campos.",
                alertType: "error"
            });
            return; // Garantir que a função retorne void após o envio de resposta
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ 
                message: "Email já está em uso!",
                alertType: "error"
            });
            return; // Garantir que a função retorne void após o envio de resposta
        }

        // Hash the user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user
        const userCreated = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Send the response
        res.json({ name: userCreated.name, email: userCreated.email, id: userCreated.userId });
    });

    // Login
    static login = asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;

        // Check if user email exists
        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ 
                message: "Credenciais inválidas.",
                alertType: "error"
            });
            return; // Garantir que a função retorne void após o envio de resposta
        }

        // Check if user password is valid
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ 
                message: "Credenciais inválidas.",
                alertType: "error"
            });
            return; // Garantir que a função retorne void após o envio de resposta
        }

        // Generate the token
        const token = jwt.sign({ id: user._id }, "anyKey" /* , { expiresIn: "30d" } */);

        // Send the response
        res.json({
            message: "Login sucesso",
            alertType: "success",
            token,
            id: user.userId,
            name: user.name,
            email: user.email,
        });
    });

    // Profile
    static profile = asyncHandler(async (req: AuthRequest, res: Response) => {
        // Find the user
        const user = await User.findById({ userId: req.user }).select("-password");
        if (!user) {
            res.status(404).json({ 
                message: "Usuário não encontrado.",
                alertType: "error"
            });
            return; // Garantir que a função retorne void após o envio de resposta
        }
        res.json({ user });
    });

    static userList = asyncHandler(async (req: AuthRequest, res: Response) => {
        const users = await User.find({}).select("-password");
        
        if (!users || users.length === 0) {
            res.status(404).json({ 
                message: "Nenhum usuário encontrado.",
                alertType: "error"
            });
            return; // Garantir que a função retorne void após o envio de resposta
        }
        res.json({ users });
    });
}

export default UserController;