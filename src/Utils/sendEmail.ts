// utils/sendEmail.ts
import dotenv from 'dotenv';
dotenv.config();

import nodemailer from "nodemailer";

console.log("Email de envio:", process.env.EMAIL_USER);
console.log("Senha do app:", process.env.EMAIL_PASS ? "Definida" : "Não definida");

const transporter = nodemailer.createTransport({
    service: "gmail", // ou "hotmail", ou SMTP personalizado
    auth: {
        user: process.env.EMAIL_USER, // adicione em .env.example
        pass: process.env.EMAIL_PASS,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error("Erro ao conectar com o serviço de email:", error);
    } else {
        console.log("Conexão com o serviço de email OK");
    }
});

export const sendVerificationCode = async (to: string, code: string) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: "Seu código de verificação (2FA)",
        text: `Seu código de verificação é: ${code}`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Código de verificação enviado para ${to}`);
        console.log("📬 Detalhes do envio:", info);
        return info;  // Retorna o resultado para debug
    } catch (err) {
        console.error("❌ Erro ao enviar email:", err);
        throw err; // relança para ser capturado no controlador
    }
};
