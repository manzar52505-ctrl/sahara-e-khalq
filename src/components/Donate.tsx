import { motion } from 'motion/react';
import { Smartphone, Mail, MessageCircle, ArrowRight } from 'lucide-react';
import { Language } from '../types';

interface DonateProps {
  lang: Language;
  onCopy: (text: string) => void;
}

export default function Donate({ lang, onCopy }: DonateProps) {
  const accountNum = "0301-0076298";
  
  return (
    <section id="donate" className="py-24 bg-primary text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-serif font-bold mb-6"
          >
            {lang === 'en' ? 'Make a Lasting Change Today' : 'آج ہی ایک دائمی تبدیلی کا حصہ بنیں'}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-3xl text-accent font-serif mb-12"
          >
            {lang === 'en' ? 'Your contribution is a beacon of hope.' : 'آپ کا عطیہ حقداروں کے لیے امید کی کرن ہے۔'}
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* EasyPaisa Card */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 p-12 rounded-[2.5rem] flex flex-col items-center text-center group transition-colors hover:bg-white/10"
          >
            <div className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-accent/20 group-hover:scale-110 transition-transform">
              <Smartphone className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">EasyPaisa</h3>
            <p className="text-ivory/60 mb-8 text-sm uppercase tracking-widest font-bold">
              {lang === 'en' ? 'Direct Mobile Donation' : 'براہِ راست عطیہ'}
            </p>
            <div className="bg-white/10 w-full py-6 rounded-2xl border border-white/5 mb-8">
              <span className="text-3xl font-mono font-bold block text-accent tracking-tighter">{accountNum}</span>
              <span className="text-xs font-bold opacity-50 uppercase mt-2 block">Adeel Ahmed Farooqi</span>
            </div>
            <button 
              onClick={() => onCopy(accountNum)}
              className="w-full bg-accent hover:bg-accent-dark text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              {lang === 'en' ? 'Copy Number' : 'نمبر کاپی کریں'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Contact Card */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 p-12 rounded-[2.5rem] flex flex-col items-center text-center group transition-colors hover:bg-white/10"
          >
            <div className="w-20 h-20 bg-[#25d366] rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-[#25d366]/20 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-10 h-10 text-white fill-current" />
            </div>
            <h3 className="text-2xl font-bold mb-2">WhatsApp Us</h3>
            <p className="text-ivory/60 mb-8 text-sm uppercase tracking-widest font-bold">
              {lang === 'en' ? 'Inquiries & Details' : 'معلومات اور تفصیلات'}
            </p>
            <p className="text-ivory/80 leading-relaxed mb-8 h-[100px] flex items-center">
              {lang === 'en' ? 
                'Message us for bank transfer details, monthly sponsorships, or verification of activities.' : 
                'بینک ٹرانسفر، ماہانہ کفالت یا سرگرمیوں کی تصدیق کے لیے ہمیں پیغام بھیجیں۔'
              }
            </p>
            <a 
              href="https://wa.me/923360013523" 
              target="_blank"
              className="w-full border-2 border-white/30 hover:border-white text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
            >
              {lang === 'en' ? 'Open WhatsApp' : 'واٹس ایپ پر رابطہ کریں'}
            </a>
          </motion.div>

          {/* Email Card */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 p-12 rounded-[2.5rem] flex flex-col items-center text-center group transition-colors hover:bg-white/10"
          >
            <div className="w-20 h-20 bg-ivory rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-ivory/10 group-hover:scale-110 transition-transform">
              <Mail className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Email Support</h3>
            <p className="text-ivory/60 mb-8 text-sm uppercase tracking-widest font-bold">
              {lang === 'en' ? 'Partnership & Reports' : 'اشتراک اور رپورٹنگ'}
            </p>
            <p className="text-ivory/80 leading-relaxed mb-8 h-[100px] flex items-center">
              {lang === 'en' ? 
                'Connect with us for corporate partnerships, project proposals, or detailed annual impact reports.' : 
                'کارپوریٹ شراکت داری، پروجیکٹ کی تجاویز یا تفصیلی رپورٹوں کے لیے رابطہ کریں۔'
              }
            </p>
            <a 
              href="mailto:saharaekhalq@gmail.com" 
              className="w-full border-2 border-white/30 hover:border-white text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
            >
              {lang === 'en' ? 'Send Email' : 'ای میل بھیجیں'}
            </a>
          </motion.div>
        </div>
        
        <div className="mt-20 text-center font-urdu text-3xl text-accent opacity-80 italic">
          اللہ آپ کے رزق میں برکت دے اور اس تعاون کو قبول فرمائے۔ آمین
        </div>
      </div>
    </section>
  );
}
