import nodemailer from 'nodemailer';

export default async function sendEmail({ to, subject, html }: any) {

    try {

        console.log('SMTP HOST:', process.env.SMTP_HOST);
        console.log('SMTP USER:', process.env.SMTP_USER);

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        const info = await transporter.sendMail({
            from: `"Mark Remitar" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html
        });

        console.log('EMAIL SENT:', info);

    } catch (error) {

        console.log('EMAIL ERROR:', error);

    }
}