import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Send } from 'lucide-react';
import { Language } from '../types';

interface VolunteerProps {
  lang: Language;
  onToast: (msg: string) => void;
}

export default function Volunteer({ lang, onToast }: VolunteerProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onToast(lang === 'en' ? "Application submitted successfully!" : "درخواست کامیابی سے موصول ہوگئی!");
  };

  const perks = [
    { en: 'Flexible volunteer hours', ur: 'لچکدار اوقات کار' },
    { en: 'Professional development', ur: 'پیشہ ورانہ تربیت' },
    { en: 'Direct community impact', ur: 'کمیونٹی پر براہِ راست اثر' },
    { en: 'Certification provided', ur: 'سرٹیفکیٹ کی فراہمی' },
  ];

  return (
    <section id="volunteer" className="py-24 bg-ivory">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-accent/10">
          <div className="lg:w-2/5 bg-primary p-12 md:p-16 text-white flex flex-col justify-center relative">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-bl-[100px] pointer-events-none"></div>
            
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">
              {lang === 'en' ? 'Become a Guardian of Change' : 'تبدیلی کے معمار بنیں'}
            </h2>
            <p className="text-ivory/70 text-lg mb-12 leading-relaxed">
              {lang === 'en' ? 
                'Join our dedicated team of volunteers and help us serve the most vulnerable. Your time and skills can transform an entire community.' : 
                'رضاکار بنیں اور انسانیت کی خدمت میں ہمارا ساتھ دیں۔ آپ کا وقت اور مہارت ایک بڑی تبدیلی لا سکتی ہے۔'
              }
            </p>
            
            <div className="space-y-6">
              {perks.map((perk, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all">
                    <CheckCircle2 className="w-6 h-6 text-accent group-hover:text-white" />
                  </div>
                  <span className="text-lg font-medium">
                    {lang === 'en' ? perk.en : perk.ur}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:w-3/5 p-8 md:p-16">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-primary uppercase tracking-widest">{lang === 'en' ? 'Full Name' : 'مکمل نام'}</label>
                  <input type="text" className="w-full bg-ivory/50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-accent focus:bg-white transition-all outline-none" placeholder="Adeel Ahmed" required />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-primary uppercase tracking-widest">{lang === 'en' ? 'Email Address' : 'ای میل'}</label>
                  <input type="email" className="w-full bg-ivory/50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-accent focus:bg-white transition-all outline-none" placeholder="example@mail.com" required />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-primary uppercase tracking-widest">{lang === 'en' ? 'Phone Number' : 'فون نمبر'}</label>
                  <input type="tel" className="w-full bg-ivory/50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-accent focus:bg-white transition-all outline-none" placeholder="+92 3XX XXXXXXX" required />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-primary uppercase tracking-widest">{lang === 'en' ? 'Experience Area' : 'شعبہ'}</label>
                  <select className="w-full bg-ivory/50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-accent focus:bg-white transition-all outline-none appearance-none cursor-pointer">
                    <option>{lang === 'en' ? 'Social Work' : 'سماجی کام'}</option>
                    <option>{lang === 'en' ? 'Healthcare' : 'صحت'}</option>
                    <option>{lang === 'en' ? 'Education' : 'تعلیم'}</option>
                    <option>{lang === 'en' ? 'Media / Design' : 'میڈیا / ڈیزائن'}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-primary uppercase tracking-widest">{lang === 'en' ? 'How can you help?' : 'آپ کیسے مدد کر سکتے ہیں؟'}</label>
                <textarea rows={4} className="w-full bg-ivory/50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-accent focus:bg-white transition-all outline-none resize-none" placeholder={lang === 'en' ? 'Briefly describe your skills...' : 'اپنی مہارتوں کے بارے میں بتائیں...'}></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full bg-accent hover:bg-accent-dark text-white py-5 rounded-2xl font-bold text-xl shadow-xl shadow-accent/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-95"
              >
                {lang === 'en' ? 'Send Application' : 'درخواست بھیجیں'}
                <Send className="w-6 h-6" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
