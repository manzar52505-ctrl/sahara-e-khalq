import { useState, useEffect, useRef } from 'react';
import { motion, useInView, animate } from 'motion/react';
import { Users, Utensils, GraduationCap, Cross, HeartHandshake, Loader2 } from 'lucide-react';
import { Language } from '../types';
import { subscribeToStats } from '../services/firebase';

interface CounterProps {
  value: number;
  suffix?: string;
}

function Counter({ value, suffix = "" }: CounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 2.5,
        onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
        ease: "easeOut",
      });
      return () => controls.stop();
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {displayValue.toLocaleString()}{suffix}
    </span>
  );
}

interface ImpactBarProps {
  lang: Language;
}

export default function ImpactBar({ lang }: ImpactBarProps) {
  const [dbStats, setDbStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToStats((data: any) => {
      setDbStats(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const stats = [
    { 
      icon: Users, 
      value: dbStats?.familiesHelped || 12400, 
      suffix: '+', 
      labelEn: 'Families Helped', 
      labelUr: 'خاندانوں کی مدد' 
    },
    { 
      icon: Utensils, 
      value: dbStats?.mealsServed || 85000, 
      suffix: '+', 
      labelEn: 'Meals Served', 
      labelUr: 'کھانا فراہم کیا' 
    },
    { 
      icon: GraduationCap, 
      value: dbStats?.studentsSupported || 3200, 
      suffix: '+', 
      labelEn: 'Students Supported', 
      labelUr: 'طلباء کی حمایت' 
    },
    { 
      icon: Cross, 
      value: dbStats?.medicalCases || 940, 
      suffix: '+', 
      labelEn: 'Medical Cases', 
      labelUr: 'طبی کیسز' 
    },
    { 
      icon: HeartHandshake, 
      value: dbStats?.totalVolunteers || 320, 
      suffix: '+', 
      labelEn: 'Volunteers', 
      labelUr: 'رضاکار' 
    },
  ];

  if (loading && !dbStats) {
    return (
      <div className="bg-primary-dark py-12 flex justify-center">
        <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
      </div>
    );
  }

  return (
    <section className="bg-primary-dark text-white py-12 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,_#fff_0%,_transparent_70%)]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`text-center ${idx === 4 ? 'col-span-2 lg:col-span-1' : ''}`}
            >
              <div className="inline-flex p-3 rounded-2xl bg-white/5 border border-white/10 mb-4">
                <stat.icon className="w-6 h-6 text-accent" />
              </div>
              <div className="text-3xl md:text-5xl font-serif font-bold text-accent mb-2">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-ivory/60">
                {lang === 'en' ? stat.labelEn : stat.labelUr}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
