import nodemailer from "nodemailer";

export const sendBookingEmail = async (toEmail, guestName, listing, checkIn, checkOut, totalRent) => {
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
        console.log("SMTP credentials (SMTP_USER / SMTP_PASS) not configured in environment. Skipping email sending.");
        return;
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: user,
            pass: pass
        }
    });

    const mailOptions = {
        from: `"Airbnb Support" <${user}>`,
        to: toEmail,
        subject: "🎉 Booking Confirmed - Airbnb App",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); color: #2d3748;">
                <div style="text-align: center; border-bottom: 2px solid #ff385c; padding-bottom: 20px; margin-bottom: 25px;">
                    <h1 style="color: #ff385c; margin: 0; font-size: 28px;">Booking Confirmed!</h1>
                    <p style="color: #4a5568; font-size: 16px; margin: 8px 0 0 0;">Hi ${guestName}, your reservation was successful.</p>
                </div>
                
                <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ff385c;">
                    <h2 style="margin-top: 0; color: #2d3748; font-size: 18px; margin-bottom: 12px;">🏡 Property Info</h2>
                    <p style="margin: 6px 0; color: #4a5568; font-size: 15px;"><strong>Title:</strong> ${listing.title}</p>
                    <p style="margin: 6px 0; color: #4a5568; font-size: 15px;"><strong>Location:</strong> ${listing.landMark}, ${listing.city}</p>
                    <p style="margin: 6px 0; color: #4a5568; font-size: 15px;"><strong>Rent Rate:</strong> Rs. ${listing.rent} / day</p>
                </div>
                
                <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #4a5568;">
                    <h2 style="margin-top: 0; color: #2d3748; font-size: 18px; margin-bottom: 12px;">📅 Stay Details</h2>
                    <p style="margin: 6px 0; color: #4a5568; font-size: 15px;"><strong>Check-In Date:</strong> ${new Date(checkIn).toLocaleDateString()}</p>
                    <p style="margin: 6px 0; color: #4a5568; font-size: 15px;"><strong>Check-Out Date:</strong> ${new Date(checkOut).toLocaleDateString()}</p>
                </div>
                
                <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: right; margin-bottom: 10px;">
                    <h3 style="margin: 0; color: #2d3748; font-size: 22px;">Total Paid: <span style="color: #ff385c;">Rs. ${totalRent}</span></h3>
                </div>
                
                <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #a0aec0; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                    <p>Thank you for booking with us! Hope you have a wonderful stay.</p>
                    <p style="margin: 5px 0 0 0;">This is an automated confirmation email for your Airbnb project demo.</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Booking confirmation email sent to: ${toEmail}`);
    } catch (error) {
        console.error("Mailer sendMail error:", error);
    }
};
