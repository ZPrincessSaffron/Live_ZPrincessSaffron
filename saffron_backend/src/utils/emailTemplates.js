export const getOrderEmailTemplate = (orderId, status, fullName) => {
  const statusConfig = {
    PENDING: {
      title: "Order Received",
      message: "We have received your order and it is currently being reviewed.",
      badgeBg: "#F9F4E8",
      badgeColor: "#C6A85A",
      badgeBorder: "#C6A85A",
    },
    CONFIRMED: {
      title: "Order Confirmed",
      message: "Your luxury saffron order has been confirmed successfully.",
      badgeBg: "#F9F4E8",
      badgeColor: "#C6A85A",
      badgeBorder: "#C6A85A",
    },
    PROCESSING: {
      title: "Carefully Preparing",
      message: "Your order is being carefully packed for shipping.",
      badgeBg: "#F9F4E8",
      badgeColor: "#C6A85A",
      badgeBorder: "#C6A85A",
    },
    SHIPPED: {
      title: "Order Dispatched",
      message: "Great news! Your order has been dispatched and is on its way.",
      badgeBg: "#2D133D",
      badgeColor: "#E6C76A",
      badgeBorder: "#C6A85A",
    },
    OUT_FOR_DELIVERY: {
      title: "Nearby Delivery",
      message: "Your order is nearby and will reach you very soon.",
      badgeBg: "#F9F4E8",
      badgeColor: "#C6A85A",
      badgeBorder: "#C6A85A",
    },
    DELIVERED: {
      title: "Hand Delivered",
      message: "Your luxury saffron experience has been delivered.",
      badgeBg: "#F9F4E8",
      badgeColor: "#C6A85A",
      badgeBorder: "#C6A85A",
    },
    CANCELLED: {
      title: "Order Cancelled",
      message: "Your order has been successfully cancelled.",
      badgeBg: "#FDEAEA",
      badgeColor: "#A94442",
      badgeBorder: "#EABBB9",
    },
    PAID: {
      title: "Payment Received",
      message: "Thank you for your payment. Your order is now being processed.",
      badgeBg: "#F9F4E8",
      badgeColor: "#C6A85A",
      badgeBorder: "#C6A85A",
    },
  };

  const config = statusConfig[status.toUpperCase()] || {
    title: "Order Update",
    message: `Your order #${orderId} has been updated to ${status}.`,
    badgeBg: "#F9F4E8",
    badgeColor: "#C6A85A",
    badgeBorder: "#C6A85A",
  };

  const brandPurple = "#2D133D";
  const brandGold = "#C6A85A";
  const brandIvory = "#FCF9F2";
  const softGold = "#E6C76A";

  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>${config.title}</title>
        <style type="text/css">
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500&family=Manrope:wght@300;400;500&display=swap');
            body { margin: 0; padding: 0; min-width: 100%; width: 100% !important; height: 100% !important; background-color: #ffffff; }
            table { border-spacing: 0; border-collapse: collapse; }
            img { border: 0; }
            .content { width: 100%; max-width: 600px; }
            .header-text { font-family: 'Cinzel', serif; font-size: 22px; font-weight: 500; letter-spacing: 0.25em; color: ${brandGold}; margin: 0; }
            .main-title { font-family: 'Cinzel', serif; font-size: 19px; font-weight: 500; color: ${brandPurple}; margin-bottom: 8px; letter-spacing: 0.1em; }
            .body-text { font-family: 'Manrope', sans-serif; font-size: 13px; line-height: 1.8; color: #8E8E8E; margin: 0; letter-spacing: 0.02em; }
            .status-pill { display: inline-block; padding: 4px 16px; border-radius: 20px; font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; background-color: ${config.badgeBg}; color: ${config.badgeColor}; border: 1px solid ${config.badgeBorder || 'transparent'}; margin: 18px 0; }
            .button { display: inline-block; padding: 13px 32px; background: linear-gradient(135deg, ${softGold} 0%, ${brandGold} 100%); color: ${brandPurple} !important; text-decoration: none; border-radius: 30px; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; margin-top: 28px; }
            .footer-text { font-family: 'Manrope', sans-serif; font-size: 10px; color: #B0B0B0; letter-spacing: 0.08em; line-height: 1.8; }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #ffffff;">
        <table width="100%" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td align="center" style="padding: 60px 0;">
                    <!-- Email Card -->
                    <table width="90%" class="content" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color: #ffffff;">
                        <!-- Brand Header -->
                        <tr>
                            <td align="center" bgcolor="${brandPurple}" style="padding: 45px 20px; background-color: ${brandPurple}; border-radius: 12px 12px 0 0;">
                                <h1 class="header-text">Z-PRINCESS SAFFRON</h1>
                            </td>
                        </tr>
                        <!-- Content Body -->
                        <tr>
                            <td align="center" style="padding: 60px 40px; background-color: ${brandIvory}; border-radius: 0 0 12px 12px;">
                                <h2 class="main-title">${config.title}</h2>
                                <p class="body-text">${config.message}</p>
                                <p class="body-text" style="margin-top: 8px;">Order ID: <strong style="color: ${brandPurple}; font-weight: 600;">#${orderId.toUpperCase()}</strong></p>
                                <div class="status-pill">${status}</div>
                                <br/>
                                <a href="https://zprincesssaffron.com/orders/${orderId}" class="button">Access Details</a>
                            </td>
                        </tr>
                        <!-- Footer Section -->
                        <tr>
                            <td align="center" style="padding: 40px 20px; background-color: #ffffff;">
                                <p class="footer-text" style="margin-bottom: 4px;">&copy; 2026 Z-PRINCESS SAFFRON. All rights reserved.</p>
                                <p class="footer-text">The World's Finest Saffron Experience</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `;
};

export const getResetEmailTemplate = (resetUrl, fullName) => {
  const brandPurple = "#2D133D";
  const brandGold = "#C6A85A";
  const brandIvory = "#FCF9F2";
  const softGold = "#E6C76A";

  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Password Reset Request</title>
        <style type="text/css">
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500&family=Manrope:wght@300;400;500&display=swap');
            body { margin: 0; padding: 0; min-width: 100%; width: 100% !important; height: 100% !important; background-color: #ffffff; }
            table { border-spacing: 0; border-collapse: collapse; }
            img { border: 0; }
            .content { width: 100%; max-width: 600px; }
            .header-text { font-family: 'Cinzel', serif; font-size: 22px; font-weight: 500; letter-spacing: 0.25em; color: ${brandGold}; margin: 0; }
            .main-title { font-family: 'Cinzel', serif; font-size: 19px; font-weight: 500; color: ${brandPurple}; margin-bottom: 8px; letter-spacing: 0.1em; }
            .body-text { font-family: 'Manrope', sans-serif; font-size: 13px; line-height: 1.8; color: #8E8E8E; margin: 0; letter-spacing: 0.02em; }
            .button { display: inline-block; padding: 13px 32px; background: linear-gradient(135deg, ${softGold} 0%, ${brandGold} 100%); color: ${brandPurple} !important; text-decoration: none; border-radius: 30px; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; margin-top: 28px; }
            .footer-text { font-family: 'Manrope', sans-serif; font-size: 10px; color: #B0B0B0; letter-spacing: 0.08em; line-height: 1.8; }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #ffffff;">
        <table width="100%" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td align="center" style="padding: 60px 0;">
                    <table width="90%" class="content" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color: #ffffff;">
                        <tr>
                            <td align="center" bgcolor="${brandPurple}" style="padding: 45px 20px; background-color: ${brandPurple}; border-radius: 12px 12px 0 0;">
                                <h1 class="header-text">Z-PRINCESS SAFFRON</h1>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 60px 40px; background-color: ${brandIvory}; border-radius: 0 0 12px 12px;">
                                <h2 class="main-title">Password Reset</h2>
                                <p class="body-text">Dear ${fullName},</p>
                                <p class="body-text">We received a request to reset your password. Click the button below to choose a new one. This link will expire in 10 minutes.</p>
                                <br/>
                                <a href="${resetUrl}" class="button">Reset Password</a>
                                <p class="body-text" style="margin-top: 30px; font-size: 11px;">If you didn't request this, you can safely ignore this email.</p>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 40px 20px; background-color: #ffffff;">
                                <p class="footer-text" style="margin-bottom: 4px;">&copy; 2026 Z-PRINCESS SAFFRON. All rights reserved.</p>
                                <p class="footer-text">The World's Finest Saffron Experience</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `;
};

export const getOTPEmailTemplate = (otp, fullName) => {
  const brandPurple = "#2D133D";
  const brandGold = "#C6A85A";
  const brandIvory = "#FCF9F2";

  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Login Verification Code</title>
        <style type="text/css">
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500&family=Manrope:wght@300;400;500&display=swap');
            body { margin: 0; padding: 0; min-width: 100%; width: 100% !important; height: 100% !important; background-color: #ffffff; }
            table { border-spacing: 0; border-collapse: collapse; }
            .content { width: 100%; max-width: 600px; }
            .header-text { font-family: 'Cinzel', serif; font-size: 22px; font-weight: 500; letter-spacing: 0.25em; color: ${brandGold}; margin: 0; }
            .main-title { font-family: 'Cinzel', serif; font-size: 19px; font-weight: 500; color: ${brandPurple}; margin-bottom: 8px; letter-spacing: 0.1em; }
            .body-text { font-family: 'Manrope', sans-serif; font-size: 13px; line-height: 1.8; color: #8E8E8E; margin: 0; letter-spacing: 0.02em; }
            .otp-code { font-family: 'Cinzel', serif; font-size: 36px; font-weight: 500; color: ${brandPurple}; letter-spacing: 0.3em; margin: 30px 0; padding: 20px; background-color: #F8F4EB; border-radius: 8px; display: inline-block; border: 1px solid ${brandGold}; }
            .footer-text { font-family: 'Manrope', sans-serif; font-size: 10px; color: #B0B0B0; letter-spacing: 0.08em; line-height: 1.8; }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #ffffff;">
        <table width="100%" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td align="center" style="padding: 60px 0;">
                    <table width="90%" class="content" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color: #ffffff;">
                        <tr>
                            <td align="center" bgcolor="${brandPurple}" style="padding: 45px 20px; background-color: ${brandPurple}; border-radius: 12px 12px 0 0;">
                                <h1 class="header-text">Z-PRINCESS SAFFRON</h1>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 60px 40px; background-color: ${brandIvory}; border-radius: 0 0 12px 12px;">
                                <h2 class="main-title">Verification Code</h2>
                                <p class="body-text">Dear ${fullName},</p>
                                <p class="body-text">To complete your login from a new device, please use the following verification code. This code is valid for 5 minutes.</p>
                                <div class="otp-code">${otp}</div>
                                <p class="body-text" style="font-size: 11px;">If you didn't attempt to log in, please secure your account immediately.</p>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 40px 20px; background-color: #ffffff;">
                                <p class="footer-text" style="margin-bottom: 4px;">&copy; 2026 Z-PRINCESS SAFFRON. All rights reserved.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `;
};

