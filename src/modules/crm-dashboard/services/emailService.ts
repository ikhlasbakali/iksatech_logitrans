// Service d'envoi d'emails avec EmailJS
export interface EmailParams {
  to_email: string;
  message: string;
  from_name: string;
  subject: string;
}

export const sendEmailService = async (params: EmailParams): Promise<boolean> => {
  try {
    // Configuration EmailJS
    const serviceId = 'service_logistics_default';
    const templateId = 'template_statistics';
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'YOUR_EMAILJS_PUBLIC_KEY';
    
    // Pour utiliser EmailJS, installer: npm install @emailjs/browser
    // import emailjs from '@emailjs/browser';
    
    // Simulation d'envoi (remplacer par l'API réelle)
    console.log('📧 Envoi email:', {
      to: params.to_email,
      subject: params.subject,
      message: params.message.substring(0, 100) + '...'
    });
    
    // Code réel avec EmailJS:
    // const result = await emailjs.send(serviceId, templateId, params, publicKey);
    // return result.status === 200;
    
    // Simulation de succès
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
    
  } catch (error) {
    console.error('Erreur envoi email:', error);
    throw new Error('Impossible d\'envoyer l\'email');
  }
};

// Service d'envoi WhatsApp
export const sendWhatsAppService = async (phone: string, message: string): Promise<boolean> => {
  try {
    // Nettoyer le numéro de téléphone
    const cleanPhone = phone.replace(/\D/g, '');
    const whatsappPhone = cleanPhone.startsWith('212') ? cleanPhone : `212${cleanPhone}`;
    
    // URL WhatsApp Business API
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
    
    console.log('📱 Envoi WhatsApp:', {
      phone: whatsappPhone,
      message: message.substring(0, 100) + '...'
    });
    
    // Ouvrir WhatsApp Web/App
    window.open(whatsappUrl, '_blank');
    
    // Simulation de succès
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
    
  } catch (error) {
    console.error('Erreur envoi WhatsApp:', error);
    throw new Error('Impossible d\'ouvrir WhatsApp');
  }
};

// Service d'envoi SMS (alternative)
export const sendSMSService = async (phone: string, message: string): Promise<boolean> => {
  try {
    // Utiliser une API SMS comme Twilio, Vonage, etc.
    const cleanPhone = phone.replace(/\D/g, '');
    
    console.log('📱 Envoi SMS:', {
      phone: cleanPhone,
      message: message.substring(0, 100) + '...'
    });
    
    // Code réel avec Twilio:
    // const client = require('twilio')(accountSid, authToken);
    // const result = await client.messages.create({
    //   body: message,
    //   from: '+1234567890',
    //   to: `+${cleanPhone}`
    // });
    
    // Simulation de succès
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
    
  } catch (error) {
    console.error('Erreur envoi SMS:', error);
    throw new Error('Impossible d\'envoyer le SMS');
  }
};
