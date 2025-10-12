// Email configuration utility
export const getEmailConfig = () => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  
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