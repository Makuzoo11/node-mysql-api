import nodemailer from 'nodemailer';

export default async function sendEmail({ to, subject, html }: any) {
    try {
        console.log('SMTP HOST:', process.env.SMTP_HOST);
        console.log('SMTP USER:', process.env.SMTP_USER);
        console.log('SMTP PORT:', process.env.SMTP_PORT);

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000
        });

        const info = await transporter.sendMail({
            from: `"Mark Remitar" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html
        });

        console.log('EMAIL SENT:', info.messageId);

    } catch (error) {
        console.log('EMAIL ERROR:', error);
    }
}