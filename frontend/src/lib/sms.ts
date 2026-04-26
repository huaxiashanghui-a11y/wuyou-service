// SMSPoh 短信发送模块
// 文档: https://smspoh.com/api-documentation

const SMS_API_KEY = process.env.SMS_API_KEY || '';
const SMS_FROM = process.env.SMS_FROM || 'SMSPoh';

interface SmspohResponse {
  status: string;
  message?: string;
  data?: any;
}

// 规范化缅甸手机号码
// 输入支持: +959xxxx, 09xxxx, 959xxxx
// 输出: 959xxxxxx (SMSPoh 要求的格式)
export function normalizePhoneNumber(phone: string): string {
  // 去除空格、横线等
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // 去除开头的 +
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }

  // 缅甸号码处理
  // 09开头的缅甸手机号(10位): 09xxxxxxxx -> 959xxxxxxxx (去掉前导0，加95前缀)
  if (cleaned.startsWith('09') && cleaned.length === 10) {
    cleaned = '95' + cleaned.substring(1);
  }
  // 959开头(11位): 已经是标准格式
  else if (cleaned.startsWith('959') && cleaned.length === 11) {
    // 保持不变
  }
  // 95开头(9位): 95xxxxxxx，需要补全
  else if (cleaned.startsWith('95') && cleaned.length < 11) {
    // 保持原样
  }

  return cleaned;
}

// 发送短信
export async function sendSms(phoneNumber: string, otpCode: string): Promise<{ success: boolean; message: string }> {
  if (!SMS_API_KEY) {
    console.warn('SMS_API_KEY not configured, skipping SMS send');
    return { success: false, message: '短信服务未配置' };
  }

  const normalizedPhone = normalizePhoneNumber(phoneNumber);
  const message = `您的验证码是: ${otpCode}，5分钟内有效。请勿泄露给他人。【无忧服务】`;

  try {
    const response = await fetch('https://smspoh.com/api/v2/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SMS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: normalizedPhone,
        message: message,
        sender: SMS_FROM,
      }),
    });

    const result: SmspohResponse = await response.json();

    if (response.ok && result.status === 'success') {
      console.log(`SMS sent to ${normalizedPhone}`);
      return { success: true, message: '验证码已发送' };
    } else {
      console.error('SMSPoh error:', result);
      return { success: false, message: result.message || '短信发送失败' };
    }
  } catch (error: any) {
    console.error('SMS send error:', error);
    return { success: false, message: '短信服务异常' };
  }
}
