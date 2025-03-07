// lib/allowedEmails.ts
export const allowedEmails = process.env.ALLOWED_EMAILS?.split(';') || [];
export const allowedDomains = process.env.ALLOWED_DOMAINS?.split(';') || [];
// 允许访问的电子邮件列表


/**
 * 检查电子邮件是否允许访问
 * @param email 用户的电子邮件地址
 * @returns 是否允许访问
 */
export function isEmailAllowed(email: string): boolean {
  if (!email) return false;
  
  // 检查完整电子邮件是否在允许列表中
  if (allowedEmails.includes(email.toLowerCase())) {
    return true;
  }
  
  // 检查域名是否在允许列表中
  if (allowedDomains.length > 0) {
    const domain = email.split('@')[1]?.toLowerCase();
    if (domain && allowedDomains.includes(domain)) {
      return true;
    }
  }
  
  return false;
}