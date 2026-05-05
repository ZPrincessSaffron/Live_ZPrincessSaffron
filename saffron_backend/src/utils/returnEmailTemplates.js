export const getReturnEmailTemplate = (userName, productName, orderId, status, reason = "") => {
  const statusConfig = {
    REQUESTED: {
      title: "Return Request Received",
      message: `We have received your return request for <strong>${productName}</strong>. Our team will review the request and get back to you shortly.`,
      badgeBg: "#F9F4E8",
      badgeColor: "#C6A85A",
      badgeBorder: "#C6A85A",
    },
    APPROVED: {
      title: "Return Request Approved",
      message: `Great news! Your return request for <strong>${productName}</strong> has been approved. Please keep the item ready for pickup at your provided address.`,
      badgeBg: "#F9F4E8",
      badgeColor: "#C6A85A",
      badgeBorder: "#C6A85A",
    },
    REJECTED: {
      title: "Return Request Rejected",
      message: `Your return request for <strong>${productName}</strong> has been rejected.`,
      badgeBg: "#FDEAEA",
      badgeColor: "#A94442",
      badgeBorder: "#EABBB9",
    },
    REFUNDED: {
      title: "Refund Initiated",
      message: `Your refund for <strong>${productName}</strong> has been initiated via Razorpay. It may take 5-7 business days to reflect in your account.`,
      badgeBg: "#F9F4E8",
      badgeColor: "#C6A85A",
      badgeBorder: "#C6A85A",
    },
  };

  const config = statusConfig[status.toUpperCase()] || {
    title: "Return Update",
    message: `Your return request status for ${productName} has been updated to ${status}.`,
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
            .reason-box { background-color: #f8f8f8; padding: 15px; border-radius: 8px; border-left: 4px solid ${brandGold}; margin: 20px 0; text-align: left; }
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
                                <h2 class="main-title">Dear ${userName},</h2>
                                <h2 class="main-title" style="font-size: 16px;">${config.title}</h2>
                                <p class="body-text">${config.message}</p>
                                
                                ${reason ? `<div class="reason-box"><p class="body-text" style="color: ${brandPurple}; font-weight: 600;">Note:</p><p class="body-text">${reason}</p></div>` : ''}

                                <p class="body-text" style="margin-top: 20px;">Order ID: <strong style="color: ${brandPurple}; font-weight: 600;">#${orderId.toUpperCase()}</strong></p>
                                <div class="status-pill">${status.replace('_', ' ')}</div>
                                <br/>
                                <a href="https://zprincesssaffron.com/profile/returns" class="button">View Return Details</a>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 40px 20px; background-color: #ffffff;">
                                <p class="footer-text" style="margin-bottom: 4px;">&copy; 2026 Z-PRINCESS SAFFRON. All rights reserved.</p>
                                <p class="footer-text">Excellence in Every Thread of Saffron</p>
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
