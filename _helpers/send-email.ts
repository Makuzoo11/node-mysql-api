export default async function sendEmail({ to, subject, html }: any) {
    try {
        console.log('Sending email via Brevo API to:', to);
        
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY!,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { 
                    name: 'Mark Go Remitar', 
                    email: 'remitarponce@gmail.com'
                },
                to: [{ email: to }],
                subject,
                htmlContent: html
            })
        });

        const data = await response.json();
        console.log('EMAIL RESPONSE:', JSON.stringify(data));

    } catch (error) {
        console.log('EMAIL ERROR:', error);
    }
}