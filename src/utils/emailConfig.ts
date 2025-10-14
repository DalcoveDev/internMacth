// Email configuration utility
export const getEmailConfig = () => {
  // Safely access environment variables
  const serviceId = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_EMAILJS_SERVICE_ID : undefined;
  const templateId = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_EMAILJS_TEMPLATE_ID : undefined;
  const publicKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_EMAILJS_PUBLIC_KEY : undefined;
  
  return {
    serviceId,
    templateId,
    publicKey,
    isConfigured: !!(serviceId && templateId && publicKey && 
                 serviceId !== 'YOUR_SERVICE_ID' && 
                 templateId !== 'YOUR_TEMPLATE_ID' && 
                 publicKey !== 'YOUR_PUBLIC_KEY')
  };
};