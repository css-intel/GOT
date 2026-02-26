import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendBookingConfirmation(to, booking) {
  if (!process.env.SMTP_USER) {
    console.log('SMTP not configured, skipping email for booking:', booking.id);
    return;
  }

  const html = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
      <div style="background: #1e40af; color: white; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">G.O.T Transportation</h1>
        <p style="margin: 4px 0 0; opacity: 0.9; font-size: 14px;">Nita Jr. Get On Through</p>
      </div>
      <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px;">
        <h2 style="color: #1e40af; margin-top: 0;">Booking Confirmed! \uD83D\uDE97</h2>
        <div style="background: #eff6ff; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 4px 0;"><strong>Booking ID:</strong> ${booking.id.slice(0, 8).toUpperCase()}</p>
          <p style="margin: 4px 0;"><strong>Pickup:</strong> ${booking.pickup_address}</p>
          <p style="margin: 4px 0;"><strong>Dropoff:</strong> ${booking.dropoff_address}</p>
          <p style="margin: 4px 0;"><strong>Service:</strong> ${booking.service_type === 'medical_courier' ? 'Medical Courier' : 'Personal Transportation'}</p>
          <p style="margin: 4px 0;"><strong>Scheduled:</strong> ${booking.is_asap ? 'ASAP' : new Date(booking.scheduled_at).toLocaleString()}</p>
          <p style="margin: 4px 0; font-size: 18px; color: #1e40af;"><strong>Fare: $${parseFloat(booking.fare_amount).toFixed(2)}</strong></p>
        </div>
        <p style="color: #64748b; font-size: 14px;">Thank you for choosing G.O.T Transportation. We'll be there for you!</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"G.O.T Transportation" <${process.env.SMTP_USER}>`,
    to,
    subject: `Booking Confirmed - G.O.T Transportation #${booking.id.slice(0, 8).toUpperCase()}`,
    html,
  });
}
