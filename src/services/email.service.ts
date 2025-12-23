import nodemailer from 'nodemailer';

export const EmailService = {
    sendWelcomeEmail: async (to: string, name: string, password: string) => {
        try {
            if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
                console.warn("EMAIL_USER or EMAIL_PASS not set. Skipping email.");
                return;
            }

            const transporter = nodemailer.createTransport({
                service: 'gmail', // or configured host
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to,
                subject: 'Welcome to Skiptracing Platform - Account Credentials',
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome, ${name}!</h2>
            <p>Your agent account has been created on the Skiptracing Platform.</p>
            <p>Here are your login credentials:</p>
            <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px;">
              <p><strong>Email:</strong> ${to}</p>
              <p><strong>Password:</strong> ${password}</p>
            </div>
            <p>Please login and change your password immediately.</p>
          </div>
        `,
            };

            await transporter.sendMail(mailOptions);
            console.log(`Welcome email sent to ${to}`);
        } catch (error) {
            console.error("Error sending email:", error);
            // Don't block creation if email fails, but log it
        }
    },
};
