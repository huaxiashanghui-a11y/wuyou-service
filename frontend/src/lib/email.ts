// 邮件发送模块

const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || '';
const EMAIL_API_KEY = process.env.EMAIL_API_KEY || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@wysz88.com';

interface EmailResult {
  success: boolean;
  message: string;
}

// 发送邮件（支持多种提供商）
export async function sendEmail(to: string, otpCode: string): Promise<EmailResult> {
  if (!EMAIL_API_KEY) {
    console.warn('EMAIL_API_KEY not configured, skipping email send');
    return { success: false, message: '邮件服务未配置' };
  }

  const subject = '【无忧服务】验证码';
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #1447E6;">无忧服务</h2>
      <p>您的验证码是：</p>
      <p style="font-size: 32px; font-weight: bold; color: #75092D; letter-spacing: 4px;">${otpCode}</p>
      <p>验证码5分钟内有效，请勿泄露给他人。</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb;" />
      <p style="color: #999; font-size: 12px;">此邮件由系统自动发送，请勿回复。</p>
    </div>
  `;

  try {
    switch (EMAIL_PROVIDER.toLowerCase()) {
      case 'sendgrid':
        return await sendViaSendgrid(to, subject, htmlBody);
      case 'resend':
        return await sendViaResend(to, subject, htmlBody);
      case 'smtp':
        return await sendViaGeneric(to, subject, htmlBody);
      default:
        // 尝试通用 SMTP API 格式
        return await sendViaGeneric(to, subject, htmlBody);
    }
  } catch (error: any) {
    console.error('Email send error:', error);
    return { success: false, message: '邮件发送失败' };
  }
}

// SendGrid API
async function sendViaSendgrid(to: string, subject: string, html: string): Promise<EmailResult> {
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${EMAIL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: EMAIL_FROM },
      subject,
      content: [{ type: 'text/html', value: html }],
    }),
  });

  if (response.ok) {
    return { success: true, message: '验证码已发送' };
  }
  const body = await response.text();
  console.error('SendGrid error:', body);
  return { success: false, message: '邮件发送失败' };
}

// Resend API
async function sendViaResend(to: string, subject: string, html: string): Promise<EmailResult> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${EMAIL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    }),
  });

  if (response.ok) {
    return { success: true, message: '验证码已发送' };
  }
  const body = await response.text();
  console.error('Resend error:', body);
  return { success: false, message: '邮件发送失败' };
}

// 通用 SMTP API（自定义端点）
async function sendViaGeneric(to: string, subject: string, html: string): Promise<EmailResult> {
  // 如果没有配置提供商，直接返回失败并记录日志到console
  if (!EMAIL_PROVIDER) {
    console.log(`[EMAIL] Would send to ${to}: ${subject} / ${html.substring(0, 100)}...`);
    return { success: false, message: '邮件服务未配置' };
  }

  const response = await fetch(`https://api.${EMAIL_PROVIDER}/send`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${EMAIL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    }),
  });

  if (response.ok) {
    return { success: true, message: '验证码已发送' };
  }
  return { success: false, message: '邮件发送失败' };
}
