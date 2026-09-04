import crypto from 'crypto';

export function validateWebAppData(initData: string, token: string): boolean {
  if (!initData || !token) return false;
  
  try {
    const parsedData = new URLSearchParams(initData);
    const hash = parsedData.get('hash');
    if (!hash) return false;
    
    parsedData.delete('hash');
    const dataCheckString = Array.from(parsedData.entries())
      .map(([key, value]) => \=\)
      .sort()
      .join('\n');
      
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(token).digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
    
    return calculatedHash === hash;
  } catch (e) {
    return false;
  }
}
