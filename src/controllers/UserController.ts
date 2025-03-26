import { Request, Response } from "express";
import User from "../models/UserModel"; // Alterado de UserModel para User
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
    user?: string;
}

class UserController {
    // Register
    static register = asyncHandler(async (req: Request, res: Response) => {
        const { name, email, password } = req.body;

        // Validations
        if (!name || !email || !password) {
            throw new Error("Por favor, preencha todos os campos.");
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            throw new Error("Usuário já cadastrado.");
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
        res.json({ name: userCreated.name, email: userCreated.email, id: userCreated.id });
    });

    // Login
    static login = asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;

        // Check if user email exists
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("Credenciais inválidas.");
        }

        // Check if user password is valid
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Credenciais inválidas.");
        }

        // Generate the token
        const token = jwt.sign({ id: user._id }, "anyKey" /* , { expiresIn: "30d" } */);

        // Send the response
        res.json({
            message: "Login sucesso",
            token,
            id: user._id,
            name: user.name,
            email: user.email,
        });
    });

    // Profile
    static profile = asyncHandler(async (req: AuthRequest, res: Response) => {
        // Find the user
        const user = await User.findById(req.user).select("-password");
        res.json({ user });
    });
}

export default UserController;