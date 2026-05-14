import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Send } from 'lucide-react';
import { Language } from '../types';

interface ContactProps {
  lang: Language;
  onToast: (msg: string) => void;
}

export default function Contact({ lang, onToast }: ContactProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onToast(lang === 'en' ? "Message sent! We'll get back to you soon." : "پیغام موصول ہوگیا! ہم جلد رابطہ کریں گے۔");
  };

  const contactInfo = [
    { 
      icon: MapPin, 
      labelEn: 'Primary Location', 
      labelUr: 'پتہ', 
      val: 'Rawalpindi & Islamabad, Pakistan',
      color: 'bg-accent/10 text-accent'
    },
    { 
      icon: Phone, 
      labelEn: 'Call/WhatsApp', 
      labelUr: 'فون نمبر', 
      val: '+92 336 0013523',
      color: 'bg-primary/10 text-primary'
    },
    { 
      icon: Mail, 
      labelEn: 'Official Email', 
      labelUr: 'ای میل', 
      val: 'saharaekhalq@gmail.com',
      color: 'bg-accent/10 text-accent'
    },
    { 
      icon: Clock, 
      labelEn: 'Response Hours', 
      labelUr: 'اوقاتِ کار', 
      val: 'Mon – Sat: 9:00 AM – 6:00 PM',
      color: 'bg-primary/10 text-primary'
    },
  ];

  return (
    <section id="contact" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-accent font-bold uppercase tracking-widest text-sm mb-4 block">
            {lang === 'en' ? 'Get In Touch' : 'رابطہ کریں'}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 leading-tight">
            {lang === 'en' ? 'We are Always Ready to Hear from You' : 'ہم سے رابطہ کریں'}
          </h2>
          <p className="text-primary/60 font-urdu text-2xl">ہم سے ملیں</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-32">
          <div className="space-y-12">
            <div className="grid sm:grid-cols-2 gap-8">
              {contactInfo.map((info, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="space-y-4"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${info.color}`}>
                    <info.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-lg mb-1">
                      {lang === 'en' ? info.labelEn : info.labelUr}
                    </h4>
                    <p className="text-primary/60 italic leading-snug">{info.val}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="pt-8 border-t border-primary/5">
              <h4 className="font-bold text-primary text-xl mb-8">
                {lang === 'en' ? 'Connect via Social Media' : 'سوشل میڈیا پر جڑیں'}
              </h4>
              <div className="flex gap-6">
                <a 
                  href="https://www.instagram.com/saharaekhalq" 
                  target="_blank" 
                  className="w-16 h-16 bg-primary text-white rounded-[1.5rem] flex items-center justify-center text-2xl hover:bg-accent hover:rotate-6 transition-all shadow-xl shadow-primary/20"
                >
                  <Instagram className="w-8 h-8" />
                </a>
                <a 
                  href="https://www.facebook.com/share/1AxxvQiWxV/" 
                  target="_blank" 
                  className="w-16 h-16 bg-primary text-white rounded-[1.5rem] flex items-center justify-center text-2xl hover:bg-accent hover:rotate-6 transition-all shadow-xl shadow-primary/20"
                >
                  <Facebook className="w-8 h-8" />
                </a>
                <a 
                  href="https://wa.me/923360013523" 
                  target="_blank" 
                  className="w-16 h-16 bg-[#25d366] text-white rounded-[1.5rem] flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-all shadow-xl shadow-[#25d366]/20"
                >
                   <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.832 11.832 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
              </div>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-ivory p-10 md:p-14 rounded-[3.5rem] shadow-2xl border border-accent/20"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                  <label className="text-sm font-bold text-primary uppercase tracking-widest">{lang === 'en' ? 'Your Name' : 'آپ کا نام'}</label>
                  <input type="text" className="w-full bg-white/80 px-6 py-5 rounded-2xl border-2 border-transparent focus:border-accent transition-all outline-none" placeholder="Adeel Ahmed" required />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-primary uppercase tracking-widest">{lang === 'en' ? 'Your Email' : 'ای میل'}</label>
                  <input type="email" className="w-full bg-white/80 px-6 py-5 rounded-2xl border-2 border-transparent focus:border-accent transition-all outline-none" placeholder="adeel@mail.com" required />
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-bold text-primary uppercase tracking-widest">{lang === 'en' ? 'Inquiry Type' : 'پیغام کی قسم'}</label>
                <select className="w-full bg-white/80 px-6 py-5 rounded-2xl border-2 border-transparent focus:border-accent transition-all outline-none appearance-none cursor-pointer">
                  <option>{lang === 'en' ? "General Inquiry" : "عام معلومات"}</option>
                  <option>{lang === 'en' ? "Donation Question" : "عطیہ سے متعلق سوال"}</option>
                  <option>{lang === 'en' ? "Volunteer Interest" : "رضاکارانہ خدمت"}</option>
                  <option>{lang === 'en' ? "Partnership" : "اشتراک"}</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-primary uppercase tracking-widest">{lang === 'en' ? 'Your Message' : 'آپ کا پیغام'}</label>
                <textarea rows={5} className="w-full bg-white/80 px-6 py-5 rounded-2xl border-2 border-transparent focus:border-accent transition-all outline-none resize-none" placeholder={lang === 'en' ? 'How can we help you?' : 'ہم آپ کی کیا مدد کر سکتے ہیں؟'} required></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-bold text-xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all hover:-translate-y-1 active:translate-y-0"
              >
                {lang === 'en' ? 'Send Message' : 'پیغام بھیجیں'}
                <Send className="w-6 h-6" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
