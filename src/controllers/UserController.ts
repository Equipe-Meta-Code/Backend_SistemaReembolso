import { Request, Response, NextFunction } from "express";
import User from "../models/UserModel"; // Alterado de UserModel para User
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendVerificationCode } from "../utils/sendEmail";
import { saveCode } from "../utils/2faStore";
import { verifyCode } from "../utils/2faStore";
import { authorizeReset } from "../utils/2faStore";
import { isAuthorizedForReset } from "../utils/2faStore";
import { sendVerificationCode } from "../utils/sendEmail";
import { saveCode, verifyCode } from "../utils/2faStore";
import crypto from "crypto";

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
        const user = await User.findOne({ email: email.trim() });
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

        // Geração do código 2FA
        const verificationCode = crypto.randomInt(0, 1000000).toString().padStart(6, "0");
        
        // Armazenamento temporário do código
        saveCode(user.email, verificationCode);

        // Envio do código por email
        await sendVerificationCode(user.email, verificationCode);

        res.json({
            message: "Código de verificação enviado para seu email.",
            alertType: "info",
            email,
        });
    });

    // Verificação do código 2FA
    static verify2FA = asyncHandler(async (req: Request, res: Response) => {
        const { email, code } = req.body;

        // Verifica se o usuário existe
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({
                message: "Usuário não encontrado.",
                alertType: "error"
            });
            return;
        }

        // Verifica se o código é válido
        const isValid = verifyCode(email, code);
        if (!isValid) {
            res.status(401).json({
                message: "Código inválido ou expirado.",
                alertType: "error"
            });
            return;
        }

        // Gerar token JWT após verificação
        const token = jwt.sign({ id: user.userId }, "anyKey");

        res.json({
            message: "Autenticação bem-sucedida!",
            alertType: "success",
            token,
            id: user.userId,
            name: user.name,
            email: user.email,
        });
    });

    // Recuperação de senha
        static recuperarSenha = asyncHandler(async (req: Request, res: Response) => {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({
                message: "O email é obrigatório.",
                alertType: "error"
            });
            return;
        }

        console.log(`📨 Email recebido para recuperação de senha: ${email}`);

        const user = await User.findOne({ email });
        if (!user) {
            res.status(200).json({
                message: "Se este e-mail estiver cadastrado, enviaremos instruções para recuperação.",
                alertType: "success"
            });
            return;
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        try {
            await sendVerificationCode(email, code);
            saveCode(email, code); // <-- Salva o código com expiração
            console.log(`✅ Código de verificação enviado e salvo para ${email}`);
            res.status(200).json({
                message: "Se este e-mail estiver cadastrado, enviaremos instruções para recuperação.",
                alertType: "success"
            });
        } catch (error) {
            console.error("❌ Erro ao enviar email:", error);
            res.status(500).json({
                message: "Erro ao enviar email de recuperação.",
                alertType: "error"
            });
        }
    });

    static verificarCodigo = asyncHandler(async (req: Request, res: Response) => {
        const { email, code } = req.body;

        if (!email || !code) {
            res.status(400).json({
                message: "Email e código são obrigatórios.",
                alertType: "error"
            });
            return;
        }

        const isValid = verifyCode(email, code);

        if (!isValid) {
            res.status(401).json({
                message: "Código inválido ou expirado.",
                alertType: "error"
            });
            return;
        }

        // Aqui autorizamos reset
        authorizeReset(email);

        res.status(200).json({
            message: "Código verificado com sucesso.",
            alertType: "success"
        });
    });
    
        // Atualizar senha após verificação de código
    static atualizarSenha = asyncHandler(async (req: Request, res: Response) => {
        const { email, code, novaSenha } = req.body;

        if (!email || !code || !novaSenha) {
            res.status(400).json({
                message: "Email, código e nova senha são obrigatórios.",
                alertType: "error"
            });
            return;
        }

        // Verifica se o código é válido
        const isValid = isAuthorizedForReset(email);
        if (!isValid) {
            res.status(401).json({
                message: "Código inválido ou expirado.",
                alertType: "error"
            });
            return;
        }

        // Busca o usuário
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({
                message: "Usuário não encontrado.",
                alertType: "error"
            });
            return;
        }

        // Atualiza a senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(novaSenha, salt);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            message: "Senha atualizada com sucesso!",
            alertType: "success"
        });
    });


    // Reenviar código de verificação 2FA
    static resendCode = asyncHandler(async (req: Request, res: Response) => {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({
                message: "Email é obrigatório.",
                alertType: "error"
            });
            return;
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({
                message: "Usuário não encontrado.",
                alertType: "error"
            });
            return;
        }

        const verificationCode = crypto.randomInt(0, 1000000).toString().padStart(6, "0");

        saveCode(email, verificationCode); // salva novo código

        await sendVerificationCode(email, verificationCode); // reenvia

        res.json({
            message: "Novo código de verificação enviado.",
            alertType: "info",
            email,
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