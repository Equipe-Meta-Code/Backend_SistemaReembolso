// utils/sendEmail.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail", // ou "hotmail", ou SMTP personalizado
    auth: {
        user: process.env.EMAIL_USER, // e.g. your@gmail.com
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
        await transporter.sendMail(mailOptions);
        console.log(`Código de verificação enviado para ${to}`);
    } catch (err) {
        console.error("Erro ao enviar email:", err);
    }
};