const dotenv = require("dotenv");
const nodemailer = require('nodemailer');

dotenv.config({ path: "config/.env" });

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    },
    family: 4
});

exports.sendRegistrationEmail = async (newUserEmail, verificationUrl) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: newUserEmail,
            subject: 'Please Verify Your Email',
            text: `Please verify your email by clicking the following link: ${verificationUrl}`,
            html: `
                <p>Please verify your email by clicking the following link: <a href="${verificationUrl}">Verify Email</a></p>
                <p>If you have already verified your email, you can now log in.</p>
            `
        });

        console.log('Verification email sent to:', newUserEmail);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

exports.sendDeliveryEmail = async (customerEmail, orderItems, subtotal, grandTotal) => {
    try {
        const itemsHtml = orderItems.map(item => `
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #333;">
                <div style="flex: 1; color: #2c2c2c;">
                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
                    ${item.name} (x${item.quantity})
                </div>
                <div style="flex: 1; text-align: right; color: #2c2c2c;">₱${item.price}</div>
            </div>
        `).join('');

        const info = await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: customerEmail,
            subject: 'Your Order has been Delivered',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #333; background-color: #a8cba0; color: #2c2c2c;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://res.cloudinary.com/dwp8u82sd/image/upload/v1732329703/logo_khcdb5.png" alt="Your Logo" style="width: 150px;">
                    </div>
                    <h2 style="text-align: center; color: #2c2c2c;">Order Receipt</h2>
                    <p>Dear Customer,</p>
                    <p>Your order has been delivered successfully. Here are the details:</p>
                    <div style="border-top: 1px solid #333; border-bottom: 1px solid #333; padding: 10px 0;">
                        ${itemsHtml}
                    </div>
                    <div style="text-align: right; margin-top: 20px; color: #2c2c2c;">
                        <p><strong>Subtotal:</strong> ₱${subtotal}</p>
                        <p><strong>Grand Total:</strong> ₱${grandTotal}</p>
                    </div>
                    <p>Thank you for shopping with us!</p>
                    <p>Best regards,<br>MEW</p>
                </div>
            `
        });

        console.log('Delivery email sent to:', customerEmail);
    } catch (error) {
        console.error('Error sending delivery email:', error);
    }
};