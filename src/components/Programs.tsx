import { motion } from 'motion/react';
import { Utensils, GraduationCap, Cross, Home, HeartPulse, Baby } from 'lucide-react';
import { Language } from '../types';

interface ProgramsProps {
  lang: Language;
}

export default function Programs({ lang }: ProgramsProps) {
  const programs = [
    { 
      icon: Utensils, 
      id: 'food',
      en: 'Food & Nutrition', 
      ur: 'خوراک اور غذائیت',
      descEn: 'Daily meals, Ramadan packages, and emergency rations for those in need.',
      descUr: 'ضرورت مندوں کے لیے روزانہ کا کھانا، رمضان پیکجز اور ہنگامی راشن۔'
    },
    { 
      icon: GraduationCap, 
      id: 'edu',
      en: 'Education Support', 
      ur: 'تعلیمی مدد',
      descEn: 'Scholarships and school supplies for deserving students to build a future.',
      descUr: 'مستقبل کی تعمیر کے لیے مستحق طلباء کے لیے وظائف اور اسکول کا سامان۔'
    },
    { 
      icon: HeartPulse, 
      id: 'med',
      en: 'Medical Assistance', 
      ur: 'طبی امداد',
      descEn: 'Free medical camps and basic medicine provision for vulnerable communities.',
      descUr: 'کمزور کمیونٹیز کے لیے مفت طبی کیمپس اور بنیادی ادویات کی فراہمی۔'
    },
    { 
      icon: Home, 
      id: 'shelter',
      en: 'Shelter & Relief', 
      ur: 'پناہ گاہ اور ریلیف',
      descEn: 'Emergency housing and community reconstruction aid after disasters.',
      descUr: 'آفات کے بعد ہنگامی رہائش اور کمیونٹی کی تعمیر نو میں امداد۔'
    },
    { 
      icon: Cross, 
      id: 'women',
      en: 'Women Empowerment', 
      ur: 'خواتین کی بااختیاری',
      descEn: 'Vocational training and skill development certificates for financial independence.',
      descUr: 'مالی آزادی کے لیے پیشہ ورانہ تربیت اور مہارت کی ترقی کے سرٹیفکیٹس۔'
    },
    { 
      icon: Baby, 
      id: 'orphan',
      en: 'Orphan Care', 
      ur: 'یتیموں کی کفالت',
      descEn: 'Monthly stipends and educational sponsorships for orphan children.',
      descUr: 'یتیم بچوں کے لیے ماہانہ وظیفہ اور تعلیمی کفالت۔'
    },
  ];

  return (
    <section id="programs" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-accent font-bold uppercase tracking-widest text-sm mb-4 block"
          >
            {lang === 'en' ? 'Our Causes' : 'ہمارے مقاصد'}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-primary mb-4"
          >
            {lang === 'en' ? 'Making an Impact Where it Matters' : 'اہم ترین پروگرامز اور مقاصد'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-primary/60 font-urdu text-2xl"
          >
            ہمارے پروگرام اور مقاصد
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((p, i) => (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-ivory/50 p-10 rounded-[2rem] border border-accent/5 hover:border-accent/40 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-accent group-hover:text-white transition-colors duration-500">
                <p.icon className="w-8 h-8 text-accent group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                {lang === 'en' ? p.en : p.ur}
              </h3>
              <p className="text-primary/70 mb-6 leading-relaxed">
                {lang === 'en' ? p.descEn : p.descUr}
              </p>
              <div className="w-12 h-1 bg-accent/20 group-hover:w-full group-hover:bg-accent transition-all duration-500"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
