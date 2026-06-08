import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "orders@yourdomain.com";

// ─── Order Confirmation Email ────────────────────────────────────────────────

interface OrderEmailParams {
  toEmail: string;
  clientName: string;
  orderId: string;
  productTitle: string;
  productImage?: string;
  quantity: number;
  totalAmount: number;
  paymentMethod: string;
  estimatedDelivery: string;
}

export async function sendOrderConfirmationEmail(params: OrderEmailParams) {
  const {
    toEmail,
    clientName,
    orderId,
    productTitle,
    productImage,
    quantity,
    totalAmount,
    paymentMethod,
    estimatedDelivery,
  } = params;

  const paymentLabel =
    paymentMethod === "COD"
      ? "💵 Cash on Delivery"
      : paymentMethod === "UPI"
      ? "📱 UPI"
      : "💳 Credit / Debit Card (Stripe)";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;">MyShop</h1>
              <p style="color:#c7d2fe;margin:8px 0 0;font-size:14px;">Order Confirmation</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">

              <h2 style="color:#1f2937;font-size:22px;margin:0 0 8px;">
                🎉 Order Placed Successfully!
              </h2>
              <p style="color:#6b7280;font-size:15px;margin:0 0 24px;">
                Hi <strong>${clientName}</strong>, thank you for shopping with us. Your order has been confirmed.
              </p>

              <!-- Order ID -->
              <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin-bottom:24px;">
                <p style="margin:0;font-size:13px;color:#9ca3af;text-transform:uppercase;font-weight:600;">Order ID</p>
                <p style="margin:4px 0 0;font-size:15px;color:#1f2937;font-family:monospace;font-weight:700;">
                  #${orderId.slice(-8).toUpperCase()}
                </p>
              </div>

              <!-- Product -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  ${
                    productImage
                      ? `<td width="80" style="padding:16px;">
                          <img src="${productImage}" alt="${productTitle}" width="72" height="72"
                            style="border-radius:8px;object-fit:cover;display:block;" />
                        </td>`
                      : ""
                  }
                  <td style="padding:16px;">
                    <p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#1f2937;">${productTitle}</p>
                    <p style="margin:0;font-size:14px;color:#6b7280;">Quantity: ${quantity}</p>
                  </td>
                  <td align="right" style="padding:16px;">
                    <p style="margin:0;font-size:20px;font-weight:700;color:#4f46e5;">₹${totalAmount.toFixed(2)}</p>
                  </td>
                </tr>
              </table>

              <!-- Details grid -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td width="50%" style="padding-right:8px;">
                    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:16px;">
                      <p style="margin:0 0 4px;font-size:12px;color:#3b82f6;text-transform:uppercase;font-weight:600;">Payment</p>
                      <p style="margin:0;font-size:14px;color:#1e40af;font-weight:600;">${paymentLabel}</p>
                    </div>
                  </td>
                  <td width="50%" style="padding-left:8px;">
                    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px;">
                      <p style="margin:0 0 4px;font-size:12px;color:#16a34a;text-transform:uppercase;font-weight:600;">Estimated Delivery</p>
                      <p style="margin:0;font-size:14px;color:#15803d;font-weight:600;">📅 ${estimatedDelivery}</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Total -->
              <div style="background:#4f46e5;border-radius:10px;padding:16px;display:flex;justify-content:space-between;margin-bottom:24px;">
                <table width="100%"><tr>
                  <td style="color:#c7d2fe;font-size:15px;">Total Amount</td>
                  <td align="right" style="color:#ffffff;font-size:20px;font-weight:700;">₹${totalAmount.toFixed(2)}</td>
                </tr></table>
              </div>

              <!-- CTA -->
              <div style="text-align:center;margin-bottom:24px;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/my-orders"
                  style="display:inline-block;background:#4f46e5;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:600;">
                  View My Orders →
                </a>
              </div>

              <p style="color:#9ca3af;font-size:13px;text-align:center;margin:0;">
                Questions? Reply to this email or visit our store.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                © ${new Date().getFullYear()} MyShop. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: `✅ Order Confirmed — #${orderId.slice(-8).toUpperCase()} | MyShop`,
      html,
    });
    return result;
  } catch (error) {
    // Non-blocking: log error but don't break order flow
    console.error("Resend email error:", error);
    return null;
  }
}

// ─── Delivery OTP Email ──────────────────────────────────────────────────────

interface OtpEmailParams {
  toEmail: string;
  clientName: string;
  orderId: string;
  productTitle: string;
  otp: string;
}

export async function sendDeliveryOtpEmail(params: OtpEmailParams) {
  const { toEmail, clientName, orderId, productTitle, otp } = params;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#059669,#10b981);padding:28px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:26px;font-weight:700;">MyShop</h1>
              <p style="color:#a7f3d0;margin:6px 0 0;font-size:14px;">Delivery OTP</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">

              <h2 style="color:#1f2937;font-size:20px;margin:0 0 8px;">
                📦 Your Order is Out for Delivery!
              </h2>
              <p style="color:#6b7280;font-size:15px;margin:0 0 24px;">
                Hi <strong>${clientName}</strong>, your order is arriving today. Use the OTP below to confirm delivery.
              </p>

              <!-- Product -->
              <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:14px 16px;margin-bottom:24px;">
                <p style="margin:0;font-size:13px;color:#9ca3af;text-transform:uppercase;font-weight:600;">Order</p>
                <p style="margin:4px 0 0;font-size:15px;color:#1f2937;font-weight:600;">${productTitle}</p>
                <p style="margin:2px 0 0;font-size:12px;color:#9ca3af;font-family:monospace;">
                  #${orderId.slice(-8).toUpperCase()}
                </p>
              </div>

              <!-- OTP Box -->
              <div style="background:linear-gradient(135deg,#ecfdf5,#d1fae5);border:2px solid #6ee7b7;border-radius:14px;padding:28px;text-align:center;margin-bottom:24px;">
                <p style="margin:0 0 8px;font-size:13px;color:#065f46;text-transform:uppercase;font-weight:700;letter-spacing:1px;">
                  Your Delivery OTP
                </p>
                <p style="margin:0;font-size:48px;font-weight:900;color:#059669;letter-spacing:12px;font-family:monospace;">
                  ${otp}
                </p>
                <p style="margin:12px 0 0;font-size:13px;color:#6b7280;">
                  ⏱️ Valid for <strong>30 minutes</strong>
                </p>
              </div>

              <!-- Warning -->
              <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:14px 16px;margin-bottom:24px;">
                <p style="margin:0;font-size:13px;color:#9a3412;">
                  ⚠️ <strong>Do not share this OTP</strong> with anyone. Only give it to the delivery person at your doorstep.
                </p>
              </div>

              <p style="color:#9ca3af;font-size:13px;text-align:center;margin:0;">
                If you did not expect a delivery, please contact support immediately.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                © ${new Date().getFullYear()} MyShop. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
            
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: `🔐 Delivery OTP: ${otp} — Order #${orderId.slice(-8).toUpperCase()} | MyShop`,
      html,
    });
    console.log("✅ OTP email sent:", result);
    return result;
  } catch (error) {
    console.error("❌ Resend OTP email error:", error);
    return null;
  }
}
