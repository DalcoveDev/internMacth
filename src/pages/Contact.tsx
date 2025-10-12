import { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Clock, User, MessageSquare, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { getEmailConfig } from '../utils/emailConfig';

const Contact = () => {
  const form = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    // Get EmailJS configuration
    const emailConfig = getEmailConfig();
    
    // Check if EmailJS is properly configured
    if (!emailConfig.isConfigured) {
      console.error('EmailJS is not properly configured. Please check your .env file.');
      setIsSubmitting(false);
      setSubmitError('Email service is not configured. Please contact the site administrator.');
      return;
    }
    
    // EmailJS integration
    if (form.current) {
      emailjs.sendForm(emailConfig.serviceId, emailConfig.templateId, form.current, {
        publicKey: emailConfig.publicKey,
      })
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      }, (error) => {
        console.log('FAILED...', error);
        setIsSubmitting(false);
        setSubmitError('Failed to send message. Please try again later.');
      });
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      content: 'support@internmatch.com',
      description: 'We respond within 24 hours'
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 5pm'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      content: '123 Career Street, San Francisco, CA 94107',
      description: 'Suite 500, Tech Tower'
    },
    {
      icon: Clock,
      title: 'Office Hours',
      content: 'Monday - Friday',
      description: '9:00 AM - 6:00 PM'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-primary-foreground relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url('/images/Download Abstract green papercut style layers background for free.jpeg')` }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6">
            <MessageSquare size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            We'd love to hear from you. Get in touch with our team and we'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Information & Form Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">Get In Touch</h2>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-muted rounded-lg hover:bg-accent transition-colors duration-300">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <IconComponent size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground text-lg">{info.title}</h3>
                        <p className="text-foreground font-medium">{info.content}</p>
                        <p className="text-muted-foreground text-sm mt-1">{info.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Office Map Placeholder */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Location</h3>
                <div className="bg-muted rounded-xl overflow-hidden h-64 flex items-center justify-center border border-border">
                  <div className="text-center">
                    <MapPin size={48} className="text-primary mx-auto mb-4" />
                    <p className="text-foreground font-medium">123 Career Street</p>
                    <p className="text-muted-foreground">San Francisco, CA 94107</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">Send Us a Message</h2>
              
              <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
                {submitSuccess ? (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send size={24} className="text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form ref={form} onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User size={18} className="text-muted-foreground" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail size={18} className="text-muted-foreground" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                        Subject
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MessageSquare size={18} className="text-muted-foreground" />
                        </div>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="How can we help you?"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                        Message
                      </label>
                      <div className="relative">
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="block w-full px-3 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="Your message here..."
                        ></textarea>
                      </div>
                    </div>
                    
                    {submitError && (
                      <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                        <p className="text-destructive text-sm">{submitError}</p>
                      </div>
                    )}
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300 ${
                        isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={18} className="mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Find answers to common questions about our platform and services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
              <h3 className="font-bold text-foreground text-lg mb-2">How do I create an account?</h3>
              <p className="text-muted-foreground">
                Click the "Sign Up" button in the top right corner and choose whether you're a student or company. 
                Fill in your details and verify your email to get started.
              </p>
            </div>
            
            <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
              <h3 className="font-bold text-foreground text-lg mb-2">What information do you need from companies?</h3>
              <p className="text-muted-foreground">
                We require basic company information, verification documents, and details about the internship positions 
                you wish to post. This helps ensure a quality experience for students.
              </p>
            </div>
            
            <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
              <h3 className="font-bold text-foreground text-lg mb-2">How long does it take to get matched with an internship?</h3>
              <p className="text-muted-foreground">
                The matching process varies, but most students find opportunities within 2-4 weeks of creating their profile. 
                Premium members typically see faster results.
              </p>
            </div>
            
            <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
              <h3 className="font-bold text-foreground text-lg mb-2">Is there a fee to use InternMatch?</h3>
              <p className="text-muted-foreground">
                Basic access is free for students. Companies pay a small fee to post internships and access premium features. 
                We also offer premium subscriptions for students with additional benefits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Support CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Need Immediate Assistance?</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-primary-foreground/90">
            Our support team is available to help you with any questions or issues you may have.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a 
              href="mailto:support@internmatch.com" 
              className="px-8 py-4 bg-primary-foreground text-primary font-bold rounded-xl hover:bg-primary-foreground/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center"
            >
              Email Support
            </a>
            <a 
              href="tel:+15551234567" 
              className="px-8 py-4 bg-secondary text-secondary-foreground font-bold rounded-xl hover:bg-secondary/90 border-2 border-border transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center"
            >
              Call Us Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;