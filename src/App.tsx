import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowDownRight, ArrowRight, Check, Clock3, Dumbbell, Facebook, Flame,
  Instagram, MapPin, Menu, Phone, Play, Radio, Send, Star, Target, X,
  Youtube, Zap,
} from 'lucide-react';
import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type ClassItem = { name: string; category: string; coach: string; time: string; duration: string; level: string; spots: number; color: string };
const classData: Record<string, ClassItem[]> = {
  Monday: [
    { name: 'Forge Strength', category: 'Strength', coach: 'Maya Chen', time: '06:00', duration: '45 min', level: 'All levels', spots: 8, color: 'lime' },
    { name: 'Engine Room', category: 'HIIT', coach: 'Nina Ford', time: '12:15', duration: '50 min', level: 'Intermediate', spots: 4, color: 'cyan' },
    { name: 'Mobility Reset', category: 'Yoga', coach: 'Kenji Sato', time: '18:30', duration: '40 min', level: 'All levels', spots: 12, color: 'violet' },
    { name: 'Fight Camp', category: 'Boxing', coach: 'Jordan Bell', time: '20:00', duration: '45 min', level: 'Intermediate', spots: 8, color: 'cyan' },
  ],
  Tuesday: [
    { name: 'Athletic HIIT', category: 'HIIT', coach: 'Nina Ford', time: '06:30', duration: '45 min', level: 'Advanced', spots: 3, color: 'cyan' },
    { name: 'Power Hour', category: 'Strength', coach: 'Noah Williams', time: '17:45', duration: '60 min', level: 'Intermediate', spots: 9, color: 'lime' },
    { name: 'Unwind / Breathe', category: 'Yoga', coach: 'Kenji Sato', time: '19:30', duration: '45 min', level: 'All levels', spots: 15, color: 'violet' },
    { name: 'CrossFit Engine', category: 'Crossfit', coach: 'Nina Ford', time: '19:00', duration: '60 min', level: 'Advanced', spots: 6, color: 'cyan' },
  ],
  Wednesday: [
    { name: 'Forge Strength', category: 'Strength', coach: 'Maya Chen', time: '06:00', duration: '45 min', level: 'All levels', spots: 5, color: 'lime' },
    { name: 'Track & Field', category: 'HIIT', coach: 'Jordan Bell', time: '12:00', duration: '50 min', level: 'Advanced', spots: 7, color: 'cyan' },
    { name: 'Core Architecture', category: 'Strength', coach: 'Noah Williams', time: '18:15', duration: '35 min', level: 'All levels', spots: 10, color: 'lime' },
  ],
  Thursday: [
    { name: 'Engine Room', category: 'HIIT', coach: 'Nina Ford', time: '06:30', duration: '50 min', level: 'Intermediate', spots: 6, color: 'cyan' },
    { name: 'Lower Body Lab', category: 'Strength', coach: 'Maya Chen', time: '17:30', duration: '45 min', level: 'All levels', spots: 2, color: 'lime' },
    { name: 'Mobility Reset', category: 'Yoga', coach: 'Kenji Sato', time: '19:15', duration: '40 min', level: 'All levels', spots: 14, color: 'violet' },
  ],
  Friday: [
    { name: 'Power Hour', category: 'Strength', coach: 'Noah Williams', time: '06:00', duration: '60 min', level: 'Intermediate', spots: 11, color: 'lime' },
    { name: 'Athletic HIIT', category: 'HIIT', coach: 'Jordan Bell', time: '12:15', duration: '45 min', level: 'Advanced', spots: 5, color: 'cyan' },
    { name: 'Friday Flight', category: 'HIIT', coach: 'Nina Ford', time: '18:30', duration: '55 min', level: 'All levels', spots: 8, color: 'cyan' },
  ],
  Saturday: [
    { name: 'The Long Game', category: 'HIIT', coach: 'Jordan Bell', time: '08:00', duration: '75 min', level: 'All levels', spots: 18, color: 'cyan' },
    { name: 'Forge Strength', category: 'Strength', coach: 'Maya Chen', time: '10:00', duration: '45 min', level: 'All levels', spots: 9, color: 'lime' },
  ],
  Sunday: [
    { name: 'Sunday Reset', category: 'Yoga', coach: 'Kenji Sato', time: '09:30', duration: '60 min', level: 'All levels', spots: 16, color: 'violet' },
    { name: 'Open Gym Floor', category: 'Strength', coach: 'Pulse Team', time: '11:00', duration: '90 min', level: 'All levels', spots: 23, color: 'lime' },
  ],
};

const trainers = [
  { name: 'Maya Chen', role: 'Strength & Performance', image: 'https://images.pexels.com/photos/6456301/pexels-photo-6456301.jpeg?auto=compress&cs=tinysrgb&w=900', credential: 'CSCS · 12 yrs' },
  { name: 'Nina Ford', role: 'Nutrition & Lifestyle', image: 'https://images.pexels.com/photos/6551415/pexels-photo-6551415.jpeg?auto=compress&cs=tinysrgb&w=900', credential: 'Precision Nutrition · 9 yrs' },
  { name: 'Kenji Sato', role: 'Mobility & Recovery', image: 'https://images.pexels.com/photos/4325478/pexels-photo-4325478.jpeg?auto=compress&cs=tinysrgb&w=900', credential: 'RYT-500 · 8 yrs' },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scheduleDay, setScheduleDay] = useState('Monday');
  const [scheduleCategory, setScheduleCategory] = useState('All');
  const [booked, setBooked] = useState<string[]>([]);
  const [activeModal, setActiveModal] = useState<'tour' | 'book' | 'plan' | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [contactSent, setContactSent] = useState(false);
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [bmi, setBmi] = useState({ height: '', weight: '', age: '', gender: 'female', result: '', calories: '' });

  const shownClasses = useMemo(() => {
    const dayClasses = classData[scheduleDay] || [];
    return scheduleCategory === 'All' ? dayClasses : dayClasses.filter((item) => item.category === scheduleCategory);
  }, [scheduleDay, scheduleCategory]);

  const openBook = (item: ClassItem) => { setSelectedClass(item); setActiveModal('book'); };
  const confirmBooking = () => {
    if (!selectedClass) return;
    setBooked((current) => current.includes(selectedClass.name) ? current : [...current, selectedClass.name]);
    setActiveModal(null);
  };
  const calculateBmi = () => {
    const height = Number(bmi.height) / 100;
    const weight = Number(bmi.weight);
    const age = Number(bmi.age);
    if (height > 0 && weight > 0 && age > 0) {
      const result = weight / (height * height);
      const bmr = bmi.gender === 'male'
        ? (10 * weight) + (6.25 * Number(bmi.height)) - (5 * age) + 5
        : (10 * weight) + (6.25 * Number(bmi.height)) - (5 * age) - 161;
      setBmi((current) => ({ ...current, result: result.toFixed(1), calories: Math.round(bmr * 1.45).toLocaleString() }));
    }
  };

  return (
    <div className="noise min-h-[100dvh] bg-background">
      <div className="fixed left-0 top-0 z-40 h-0.5 w-full origin-left bg-primary animate-pulse-line" />
      <header className="fixed inset-x-0 top-0 z-30 border-b border-white/[.08] bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] max-w-[1320px] items-center justify-between px-5 lg:px-8">
          <button data-testid="button-logo" onClick={() => scrollToId('top')} className="group flex items-center gap-2.5 text-left">
            <span className="flex h-8 w-8 items-center justify-center bg-primary text-background"><Zap size={18} strokeWidth={3} /></span>
            <span className="font-display text-2xl font-bold tracking-[.04em] text-foreground">PULSE<span className="text-primary">FORGE</span></span>
          </button>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
            {['Programs', 'Schedule', 'Coaches', 'Membership'].map((item) => <button key={item} data-testid={`link-${item.toLowerCase()}`} onClick={() => scrollToId(item.toLowerCase())} className="text-[11px] font-bold uppercase tracking-[.2em] text-muted-foreground hover:text-primary">{item}</button>)}
          </nav>
          <div className="hidden items-center gap-4 lg:flex">
            <button data-testid="button-login" onClick={() => setActiveModal('plan')} className="text-xs font-bold uppercase tracking-[.18em] text-muted-foreground hover:text-foreground">Member login</button>
            <button data-testid="button-nav-tour" onClick={() => setActiveModal('tour')} className="bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-[.16em] text-background hover:-translate-y-0.5 hover:shadow-[0_8px_30px_hsl(74_100%_61%/.2)]">Book a tour <ArrowRight className="ml-1 inline" size={14} /></button>
          </div>
          <button data-testid="button-mobile-menu" aria-label="Toggle navigation" onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-foreground lg:hidden">{mobileOpen ? <X /> : <Menu />}</button>
        </div>
        <AnimatePresence>
          {mobileOpen && <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-white/[.08] bg-card px-5 py-5 lg:hidden">
            {['Programs', 'Schedule', 'Coaches', 'Membership'].map((item) => <button key={item} data-testid={`mobile-link-${item.toLowerCase()}`} onClick={() => { scrollToId(item.toLowerCase()); setMobileOpen(false); }} className="block w-full border-b border-white/[.06] py-3 text-left text-sm font-bold uppercase tracking-[.16em] text-muted-foreground">{item}</button>)}
            <button data-testid="button-mobile-tour" onClick={() => { setActiveModal('tour'); setMobileOpen(false); }} className="mt-4 w-full bg-primary py-3 text-xs font-bold uppercase tracking-[.16em] text-background">Book a tour</button>
          </motion.nav>}
        </AnimatePresence>
      </header>

      <main id="top">
        <section className="relative min-h-[720px] overflow-hidden border-b border-white/[.08] pt-[74px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_34%,hsl(188_95%_58%/.16),transparent_27%),radial-gradient(circle_at_20%_55%,hsl(74_100%_61%/.08),transparent_24%)]" />
          <div className="absolute inset-0 opacity-30 grid-lines" />
          <div className="absolute right-[-14vw] top-[11%] h-[560px] w-[560px] rounded-full border border-primary/20 shadow-[0_0_100px_hsl(74_100%_61%/.12)] lg:right-[2vw]"><div className="absolute inset-10 rounded-full border border-cyan/20" /><div className="absolute inset-[26%] rounded-full border border-primary/30" /></div>
          <div className="relative mx-auto grid max-w-[1320px] items-center gap-10 px-5 pb-16 pt-20 lg:min-h-[650px] lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pt-12">
            <div className="reveal">
              <div className="mb-6 inline-flex items-center gap-2 border border-primary/30 bg-primary/[.07] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[.22em] text-primary"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> Open daily · 05:00—23:00</div>
              <h1 className="max-w-3xl font-display text-[clamp(4rem,9vw,8.6rem)] font-bold uppercase leading-[.84] tracking-[-.04em] text-foreground">Transform<br /><motion.span animate={{ opacity: [0.74, 1, 0.74] }} transition={{ duration: 3.2, repeat: Infinity }}>your <span className="text-primary">body.</span></motion.span><br /><span className="text-primary">Unleash your potential.</span></h1>
              <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground">A focused training facility for people who are done waiting for motivation. Expert coaching, serious equipment, and progress you can see.</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button data-testid="button-hero-start" onClick={() => scrollToId('membership')} className="group flex items-center gap-3 bg-primary px-5 py-3.5 text-xs font-bold uppercase tracking-[.16em] text-background hover:-translate-y-1 hover:shadow-[0_12px_36px_hsl(74_100%_61%/.24)]">Start your run <ArrowDownRight size={16} className="transition-transform group-hover:rotate-[-45deg]" /></button>
                <button data-testid="button-hero-watch" onClick={() => setActiveModal('tour')} className="flex items-center gap-2 border border-white/20 px-5 py-3.5 text-xs font-bold uppercase tracking-[.16em] text-foreground hover:border-primary hover:text-primary"><Play size={14} fill="currentColor" /> See the facility</button>
              </div>
              <div className="mt-12 flex items-center gap-4"><div className="flex -space-x-2">{['MK', 'JP', 'RS', 'AL'].map((v, i) => <span key={v} className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-background text-[10px] font-bold ${i % 2 ? 'bg-cyan text-background' : 'bg-primary text-background'}`}>{v}</span>)}</div><p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">2,400+</span> people training with intent</p></div>
            </div>
            <div className="relative hidden min-h-[520px] lg:block">
              <div className="absolute bottom-0 right-0 top-0 w-[78%] overflow-hidden border border-white/10 bg-card bracket">
                <img src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Athlete training with a barbell in a dark gym" className="h-full w-full object-cover opacity-75 mix-blend-luminosity" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-cyan/10" />
                <div className="absolute bottom-7 left-7"><p className="font-mono text-[10px] uppercase tracking-[.22em] text-primary">Session 01 / 06</p><p className="mt-1 font-display text-3xl font-bold uppercase">The work speaks.</p></div>
              </div>
              <div className="absolute right-[-14px] top-12 z-10 flex items-center gap-2 bg-primary px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[.14em] text-background"><Radio size={13} /> Live floor energy</div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
        </section>

        <section className="border-b border-white/[.08] bg-card/60">
          <div className="mx-auto grid max-w-[1320px] grid-cols-2 divide-x divide-white/[.08] px-5 lg:grid-cols-4 lg:px-8">
            {[['01', '2.5k', 'active members'], ['02', '50+', 'certified coaches'], ['03', '100+', 'weekly classes'], ['04', '24/7', 'member access']].map(([num, value, label]) => <div key={num} className="flex items-center gap-3 py-6 lg:gap-5"><span className="font-mono text-[10px] text-primary">{num}</span><div><p data-testid={`stat-${label.replace(' ', '-')}`} className="font-display text-3xl font-bold leading-none text-foreground lg:text-4xl">{value}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">{label}</p></div></div>)}
          </div>
        </section>

        <section id="programs" className="mx-auto max-w-[1320px] scroll-mt-24 px-5 py-24 lg:px-8 lg:py-32">
          <SectionIntro eyebrow="02 / The method" title={<>No wasted reps.<br /><span className="text-primary">No generic plans.</span></>} copy="Every part of PulseForge is designed to make your next month measurably better than your last. Pick your lane. We build the map." />
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {[{ no: '01', title: 'Strength', body: 'Build the kind of strength that carries into every room. Progressive programming, quality equipment, precise coaching.', icon: Dumbbell, stat: '+31% avg. lift' }, { no: '02', title: 'Conditioning', body: 'Raise your ceiling. Intervals, circuits, and athletic work that leave you sharper, not just sweatier.', icon: Flame, stat: '−4.2 min 5K' }, { no: '03', title: 'Recovery', body: 'Train hard. Recover like it matters. Mobility, breathwork, and smart volume keep the engine online.', icon: Target, stat: '−18% soreness' }].map((item, i) => <motion.article key={item.title} whileHover={{ y: -6 }} className={`group relative overflow-hidden border border-white/10 p-7 ${i === 1 ? 'bg-primary text-background' : 'bg-card'} bracket`}>
              <div className="flex items-start justify-between"><item.icon size={27} className={i === 1 ? 'text-background' : 'text-primary'} /><span className={`font-mono text-[10px] ${i === 1 ? 'text-background/60' : 'text-muted-foreground'}`}>{item.no}</span></div>
              <h3 className="mt-20 font-display text-5xl font-bold uppercase">{item.title}</h3><p className={`mt-4 text-sm leading-relaxed ${i === 1 ? 'text-background/70' : 'text-muted-foreground'}`}>{item.body}</p>
              <div className={`mt-8 flex items-center gap-2 border-t pt-4 font-mono text-xs font-bold uppercase tracking-[.12em] ${i === 1 ? 'border-background/25 text-background' : 'border-white/10 text-primary'}`}>{item.stat}<ArrowUpRightIcon /></div>
              <div className={`absolute -bottom-14 -right-10 h-36 w-36 rounded-full border ${i === 1 ? 'border-background/20' : 'border-primary/15'}`} />
            </motion.article>)}
          </div>
        </section>

        <section id="schedule" className="scroll-mt-24 border-y border-white/[.08] bg-[#0b1014]">
          <div className="mx-auto max-w-[1320px] px-5 py-24 lg:px-8 lg:py-32">
            <SectionIntro eyebrow="03 / The floor" title={<>Show up.<br /><span className="text-cyan">Put in work.</span></>} copy="37 coached sessions every week. Find the one that makes you slightly nervous and put it on the calendar." />
            <div className="mt-12 flex flex-col gap-3 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex max-w-full gap-1 overflow-x-auto pb-1">{Object.keys(classData).map((day) => <button key={day} data-testid={`schedule-day-${day.toLowerCase()}`} onClick={() => setScheduleDay(day)} className={`shrink-0 border-b-2 px-3 py-3 text-xs font-bold uppercase tracking-[.14em] ${scheduleDay === day ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>{day.slice(0, 3)}</button>)}</div>
              <div className="flex flex-wrap gap-2">{['All', 'Yoga', 'Crossfit', 'Boxing', 'HIIT', 'Strength'].map((cat) => <button key={cat} data-testid={`filter-${cat.toLowerCase()}`} onClick={() => setScheduleCategory(cat)} className={`border px-3 py-2 text-[10px] font-bold uppercase tracking-[.12em] ${scheduleCategory === cat ? 'border-cyan bg-cyan/10 text-cyan' : 'border-white/10 text-muted-foreground hover:border-cyan/50'}`}>{cat}</button>)}</div>
            </div>
            <div className="mt-5 grid gap-2">
              {shownClasses.map((item, index) => <motion.div layout key={`${scheduleDay}-${item.name}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .06 }} className="group grid items-center gap-4 border border-white/[.08] bg-card/60 px-4 py-4 hover:border-primary/50 md:grid-cols-[80px_1fr_130px_150px] lg:px-6">
                <div><p className="font-display text-2xl font-bold text-foreground">{item.time}</p><p className="font-mono text-[9px] uppercase text-muted-foreground">{item.duration}</p></div>
                <div className="flex items-center gap-3"><span className={`h-2 w-2 rounded-full ${item.color === 'lime' ? 'bg-primary' : item.color === 'cyan' ? 'bg-cyan' : 'bg-violet-400'}`} /><div><p data-testid={`class-${item.name.replaceAll(' ', '-').toLowerCase()}`} className="font-display text-2xl font-bold uppercase">{item.name}</p><p className="text-xs text-muted-foreground">{item.coach} <span className="mx-1 text-white/20">/</span> {item.level}</p></div></div>
                <div className="hidden text-right md:block"><p className={`font-mono text-xs ${item.spots < 5 ? 'text-orange-300' : 'text-muted-foreground'}`}>{item.spots} spots left</p><div className="mt-2 ml-auto h-1 w-20 bg-muted"><div className={`h-full ${item.color === 'lime' ? 'bg-primary' : item.color === 'cyan' ? 'bg-cyan' : 'bg-violet-400'}`} style={{ width: `${Math.max(20, 100 - item.spots * 3)}%` }} /></div></div>
                <button data-testid={`button-book-${item.name.replaceAll(' ', '-').toLowerCase()}`} onClick={() => openBook(item)} className={`justify-self-start border px-4 py-2.5 text-[10px] font-bold uppercase tracking-[.14em] ${booked.includes(item.name) ? 'border-primary bg-primary/10 text-primary' : 'border-white/20 text-foreground hover:border-primary hover:text-primary'}`}>{booked.includes(item.name) ? <><Check size={13} className="mr-1 inline" /> On your list</> : <>Book a seat <ArrowRight size={13} className="ml-1 inline" /></>}</button>
              </motion.div>)}
            </div>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[.15em] text-muted-foreground"><Clock3 size={12} className="mr-1 inline text-primary" /> Times shown in local time · Class spots refresh daily</p>
          </div>
        </section>

        <section id="coaches" className="mx-auto max-w-[1320px] scroll-mt-24 px-5 py-24 lg:px-8 lg:py-32">
          <SectionIntro eyebrow="04 / People in your corner" title={<>Coaches who<br /><span className="text-primary">notice everything.</span></>} copy="You bring the effort. Our coaches bring the eyes, the experience, and a plan that evolves with you." />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {trainers.map((trainer, i) => <motion.article key={trainer.name} whileHover={{ y: -5 }} className="group relative overflow-hidden bg-card">
              <div className="aspect-[4/5] overflow-hidden"><img src={trainer.image} alt={`${trainer.name}, ${trainer.role}`} className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" /><div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" /><span className="absolute left-5 top-5 border border-primary/40 bg-background/70 px-2 py-1 font-mono text-[9px] uppercase tracking-[.16em] text-primary">0{i + 1} / coach</span><div className="absolute bottom-5 left-5"><p className="font-display text-4xl font-bold uppercase">{trainer.name}</p><p className="mt-1 text-xs text-cyan">{trainer.role}</p><p className="mt-3 font-mono text-[10px] uppercase tracking-[.1em] text-muted-foreground">{trainer.credential}</p></div></div>
            </motion.article>)}
          </div>
        </section>

        <section className="border-y border-white/[.08] bg-primary text-background">
          <div className="mx-auto grid max-w-[1320px] items-center gap-8 px-5 py-12 lg:grid-cols-[1fr_auto] lg:px-8">
            <div><p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] opacity-60">A better baseline starts here</p><h2 className="mt-2 font-display text-5xl font-bold uppercase leading-none md:text-6xl">Your future self<br />is already watching.</h2></div>
            <button data-testid="button-cta-tour" onClick={() => setActiveModal('tour')} className="flex items-center justify-center gap-3 border border-background/40 px-6 py-4 text-xs font-bold uppercase tracking-[.16em] hover:bg-background hover:text-primary">Book a first session <ArrowRight size={17} /></button>
          </div>
        </section>

        <section id="membership" className="scroll-mt-24 mx-auto max-w-[1320px] px-5 py-24 lg:px-8 lg:py-32">
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end"><SectionIntro eyebrow="05 / Membership" title={<>Choose your<br /><span className="text-cyan">training mode.</span></>} copy="No contracts hidden in the footnotes. Pick the rhythm that fits your life, then change gears when you are ready." /><div className="flex self-start border border-white/15 p-1"><button data-testid="toggle-monthly" onClick={() => setBilling('monthly')} className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[.15em] ${billing === 'monthly' ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>Monthly</button><button data-testid="toggle-yearly" onClick={() => setBilling('yearly')} className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[.15em] ${billing === 'yearly' ? 'bg-cyan text-background' : 'text-muted-foreground'}`}>Yearly <span className="ml-1 text-primary">−20%</span></button></div></div>
          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {[{ name: 'Base', desc: 'Your own pace, your own floor.', monthly: 89, yearly: 71, features: ['24/7 facility access', 'Open gym floor', 'App-based tracking', 'Locker + towel service'] }, { name: 'Built', desc: 'The structure that changes things.', monthly: 149, yearly: 119, features: ['Everything in Base', '4 coached classes / month', 'Monthly progress review', 'Recovery lounge access'], popular: true }, { name: 'Unstoppable', desc: 'Full support. Serious results.', monthly: 239, yearly: 191, features: ['Everything in Built', 'Unlimited coached classes', 'Weekly 1:1 coaching', 'Nutrition strategy'] }].map((plan) => <div key={plan.name} className={`relative border p-7 ${plan.popular ? 'border-primary bg-primary/[.08]' : 'border-white/10 bg-card'}`}>{plan.popular && <div className="absolute right-0 top-0 bg-primary px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-[.16em] text-background">Most chosen</div>}<p className="font-mono text-[10px] uppercase tracking-[.2em] text-primary">0{['Base', 'Built', 'Unstoppable'].indexOf(plan.name) + 1} / plan</p><h3 className="mt-10 font-display text-5xl font-bold uppercase">{plan.name}</h3><p className="mt-2 text-sm text-muted-foreground">{plan.desc}</p><div className="mt-8 flex items-baseline gap-1"><span data-testid={`price-${plan.name.toLowerCase()}`} className="font-display text-6xl font-bold">${billing === 'monthly' ? plan.monthly : plan.yearly}</span><span className="text-xs text-muted-foreground">/ mo</span></div><div className="my-7 h-px bg-white/10" /><ul className="space-y-3">{plan.features.map((feature) => <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground"><Check size={14} className="text-primary" />{feature}</li>)}</ul><button data-testid={`button-plan-${plan.name.toLowerCase()}`} onClick={() => { setSelectedPlan(plan.name); setActiveModal('plan'); }} className={`mt-9 w-full py-3 text-xs font-bold uppercase tracking-[.16em] ${plan.popular ? 'bg-primary text-background hover:shadow-[0_8px_25px_hsl(74_100%_61%/.2)]' : 'border border-white/20 hover:border-primary hover:text-primary'}`}>Choose {plan.name} <ArrowRight className="ml-1 inline" size={14} /></button></div>)}
          </div>
        </section>

        <section className="border-y border-white/[.08] bg-[#0b1014]">
          <div className="mx-auto grid max-w-[1320px] gap-12 px-5 py-24 lg:grid-cols-[.85fr_1.15fr] lg:px-8 lg:py-32">
            <div><SectionIntro eyebrow="06 / Know your numbers" title={<>The data<br /><span className="text-primary">doesn't lie.</span></>} copy="A quick baseline is not a diagnosis. It is a starting line. Run the numbers, then let a coach help you read the story." /><div className="mt-8 flex gap-3 font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground"><span className="border border-white/10 px-3 py-2">No account needed</span><span className="border border-white/10 px-3 py-2">Private by default</span></div></div>
            <div className="border border-white/10 bg-card p-6 md:p-8"><div className="flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan">Quick assessment / 01</p><h3 className="mt-2 font-display text-4xl font-bold uppercase">BMI + calorie baseline</h3></div><span className="flex h-10 w-10 items-center justify-center bg-cyan/10 text-cyan"><ActivityIcon /></span></div><div className="mt-8 grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold uppercase tracking-[.12em] text-muted-foreground">Height (cm)<input data-testid="input-height" value={bmi.height} onChange={(e) => setBmi({ ...bmi, height: e.target.value })} type="number" placeholder="178" className="mt-2 block w-full border border-white/15 bg-background px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50" /></label><label className="text-xs font-bold uppercase tracking-[.12em] text-muted-foreground">Weight (kg)<input data-testid="input-weight" value={bmi.weight} onChange={(e) => setBmi({ ...bmi, weight: e.target.value })} type="number" placeholder="78" className="mt-2 block w-full border border-white/15 bg-background px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50" /></label><label className="text-xs font-bold uppercase tracking-[.12em] text-muted-foreground">Age<input data-testid="input-age" value={bmi.age} onChange={(e) => setBmi({ ...bmi, age: e.target.value })} type="number" placeholder="30" className="mt-2 block w-full border border-white/15 bg-background px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50" /></label><label className="text-xs font-bold uppercase tracking-[.12em] text-muted-foreground">Gender<select data-testid="select-gender" value={bmi.gender} onChange={(e) => setBmi({ ...bmi, gender: e.target.value })} className="mt-2 block w-full border border-white/15 bg-background px-4 py-3 font-mono text-sm text-foreground"><option value="female">Female</option><option value="male">Male</option></select></label></div><button data-testid="button-calculate-bmi" onClick={calculateBmi} className="mt-5 w-full bg-cyan py-3 text-xs font-bold uppercase tracking-[.16em] text-background hover:bg-primary">Calculate my baseline <ArrowRight className="ml-1 inline" size={14} /></button>{bmi.result && <div data-testid="status-bmi-result" className="mt-6 grid gap-5 border-t border-white/10 pt-5 sm:grid-cols-2"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">Your estimated BMI</p><p className="font-display text-5xl font-bold text-cyan">{bmi.result}</p></div><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">Daily calorie estimate</p><p className="font-display text-4xl font-bold text-primary">{bmi.calories}</p><p className="mt-1 text-xs text-muted-foreground">maintenance calories</p></div><p className="text-xs leading-relaxed text-muted-foreground sm:col-span-2">Use this as context, not a verdict. Our coaches look at the whole picture.</p></div>}</div>
          </div>
        </section>

        <section className="mx-auto max-w-[1320px] px-5 py-24 lg:px-8 lg:py-32">
          <SectionIntro eyebrow="07 / Proof of work" title={<>Different bodies.<br /><span className="text-primary">Same commitment.</span></>} copy="Progress is not one shape. It is a faster mile, a heavier bar, a morning you did not negotiate with." />
          <div className="mt-14 grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
            <article className="relative min-h-[350px] overflow-hidden border border-white/10 bg-card p-7 md:p-10"><div className="absolute right-0 top-0 h-full w-1/2 opacity-25"><img src="https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=900" alt="" className="h-full w-full object-cover grayscale" /></div><div className="relative max-w-lg"><div className="flex gap-1 text-primary">{[1, 2, 3, 4, 5].map((n) => <Star key={n} size={15} fill="currentColor" />)}</div><blockquote className="mt-8 font-display text-4xl font-semibold uppercase leading-[.98] md:text-5xl">“I stopped treating training like punishment. Now it is the most honest hour of my day.”</blockquote><div className="mt-8 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan font-mono text-xs font-bold text-background">JP</span><div><p className="text-sm font-bold">Jules Parker</p><p className="font-mono text-[10px] uppercase text-muted-foreground">Built member · 14 month streak</p></div></div></div></article>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">{[['−21%', 'resting heart rate', 'after 12 weeks'], ['+42kg', 'deadlift PR', 'since joining'], ['06:18', 'new 5K time', 'personal best']].map(([value, label, note]) => <div key={label} className="border border-white/10 bg-card p-6"><p className="font-display text-5xl font-bold text-primary">{value}</p><p className="mt-3 text-sm font-bold uppercase tracking-[.08em]">{label}</p><p className="mt-1 font-mono text-[10px] uppercase text-muted-foreground">{note}</p></div>)}</div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 border-y border-white/[.08] bg-[#0b1014]">
          <div className="mx-auto grid max-w-[1320px] gap-12 px-5 py-24 lg:grid-cols-[.8fr_1.2fr] lg:px-8 lg:py-32">
            <div><SectionIntro eyebrow="08 / Find your floor" title={<>Come see<br /><span className="text-cyan">what's possible.</span></>} copy="We are in the warehouse district, two blocks from the river. Drop by for a look, a question, or your first good decision of the day." /><div className="mt-9 space-y-5 text-sm text-muted-foreground"><p className="flex gap-3"><MapPin size={18} className="shrink-0 text-primary" /> 418 Foundry Street, Eastside<br />Portland, OR 97209</p><p className="flex gap-3"><Phone size={18} className="shrink-0 text-primary" /> (503) 555-0148</p><p className="flex gap-3"><Clock3 size={18} className="shrink-0 text-primary" /> Mon—Fri 05:00—23:00<br />Sat—Sun 07:00—21:00</p></div></div>
            <form onSubmit={(e) => { e.preventDefault(); setContactSent(true); }} className="border border-white/10 bg-card p-6 md:p-8"><div className="grid gap-5 sm:grid-cols-2"><label className="text-xs font-bold uppercase tracking-[.12em] text-muted-foreground">Your name<input data-testid="input-contact-name" required className="mt-2 block w-full border border-white/15 bg-background px-4 py-3 text-sm text-foreground" placeholder="Alex Morgan" /></label><label className="text-xs font-bold uppercase tracking-[.12em] text-muted-foreground">Email address<input data-testid="input-contact-email" required type="email" className="mt-2 block w-full border border-white/15 bg-background px-4 py-3 text-sm text-foreground" placeholder="alex@email.com" /></label></div><label className="mt-5 block text-xs font-bold uppercase tracking-[.12em] text-muted-foreground">What are you looking for?<select data-testid="select-contact-interest" className="mt-2 block w-full border border-white/15 bg-background px-4 py-3 text-sm text-foreground"><option>Book a facility tour</option><option>Membership options</option><option>Personal coaching</option><option>Something else</option></select></label><label className="mt-5 block text-xs font-bold uppercase tracking-[.12em] text-muted-foreground">Message<textarea data-testid="textarea-contact-message" required rows={4} className="mt-2 block w-full resize-none border border-white/15 bg-background px-4 py-3 text-sm text-foreground" placeholder="Tell us what you want to work on..." /></label><button data-testid="button-contact-submit" type="submit" className="mt-5 w-full bg-primary py-3.5 text-xs font-bold uppercase tracking-[.16em] text-background hover:bg-cyan">{contactSent ? <><Check size={14} className="mr-1 inline" /> Message received</> : <>Send it through <Send size={14} className="ml-1 inline" /></>}</button></form>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-[1320px] px-5 pb-8 pt-16 lg:px-8">
        <div className="grid gap-10 border-b border-white/10 pb-14 lg:grid-cols-[1.2fr_.8fr_.8fr_1.2fr]"><div><div className="flex items-center gap-2.5"><span className="flex h-8 w-8 items-center justify-center bg-primary text-background"><Zap size={18} strokeWidth={3} /></span><span className="font-display text-2xl font-bold tracking-[.04em]">PULSE<span className="text-primary">FORGE</span></span></div><p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">Train with intent. A serious facility for the work that changes you.</p><div className="mt-6 flex gap-3"><a data-testid="link-instagram" href="https://instagram.com" aria-label="Instagram" className="border border-white/10 p-2.5 text-muted-foreground hover:border-primary hover:text-primary"><Instagram size={16} /></a><a data-testid="link-facebook" href="https://facebook.com" aria-label="Facebook" className="border border-white/10 p-2.5 text-muted-foreground hover:border-primary hover:text-primary"><Facebook size={16} /></a><a data-testid="link-youtube" href="https://youtube.com" aria-label="Youtube" className="border border-white/10 p-2.5 text-muted-foreground hover:border-primary hover:text-primary"><Youtube size={16} /></a></div></div><FooterColumn title="Explore" links={['Programs', 'Schedule', 'Coaches', 'Membership']} /><FooterColumn title="The facility" links={['Our approach', 'Recovery lounge', 'Open gym floor', 'Contact']} /><div><p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-primary">Pulse check / monthly</p><p className="mt-4 text-sm leading-relaxed text-muted-foreground">One useful note on training, recovery, and showing up.</p><form onSubmit={(e) => { e.preventDefault(); setNewsletterSent(true); }} className="mt-5 flex border border-white/15"><input data-testid="input-newsletter" required type="email" placeholder="you@email.com" className="min-w-0 flex-1 bg-transparent px-3 py-3 text-xs text-foreground placeholder:text-muted-foreground" /><button data-testid="button-newsletter-submit" aria-label="Subscribe to newsletter" type="submit" className="bg-primary px-3 text-background"><ArrowRight size={16} /></button></form>{newsletterSent && <p data-testid="status-newsletter" className="mt-2 text-xs text-primary"><Check size={12} className="mr-1 inline" /> You are on the list.</p>}</div></div>
        <div className="flex flex-col justify-between gap-3 pt-7 font-mono text-[10px] uppercase tracking-[.12em] text-muted-foreground md:flex-row"><p>© 2025 PulseForge Fitness</p><p>Built for the next rep <span className="mx-2 text-primary">●</span> Portland, Oregon</p></div>
      </footer>

      <AnimatePresence>{activeModal && <Modal type={activeModal} selectedClass={selectedClass} selectedPlan={selectedPlan} onClose={() => setActiveModal(null)} onConfirmBooking={confirmBooking} />}</AnimatePresence>
    </div>
  );
}

function SectionIntro({ eyebrow, title, copy }: { eyebrow: string; title: ReactNode; copy: string }) {
  return <div className="max-w-2xl"><p className="font-mono text-[10px] font-bold uppercase tracking-[.22em] text-primary">{eyebrow}</p><h2 className="mt-4 font-display text-6xl font-bold uppercase leading-[.84] tracking-[-.02em] text-foreground md:text-7xl">{title}</h2><p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">{copy}</p></div>;
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  const destinations: Record<string, string> = { Programs: 'programs', Schedule: 'schedule', Coaches: 'coaches', Membership: 'membership', Contact: 'contact', 'Our approach': 'programs', 'Recovery lounge': 'programs', 'Open gym floor': 'schedule' };
  return <div><p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-primary">{title}</p><ul className="mt-5 space-y-3">{links.map((link) => <li key={link}><button data-testid={`footer-link-${link.toLowerCase().replaceAll(' ', '-')}`} onClick={() => scrollToId(destinations[link] ?? 'top')} className="text-sm text-muted-foreground hover:text-foreground">{link}</button></li>)}</ul></div>;
}

function Modal({ type, selectedClass, selectedPlan, onClose, onConfirmBooking }: { type: 'tour' | 'book' | 'plan'; selectedClass: ClassItem | null; selectedPlan: string; onClose: () => void; onConfirmBooking: () => void }) {
  const isBook = type === 'book';
  const isPlan = type === 'plan';
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-5 backdrop-blur-md" onClick={onClose}><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-lg border border-primary/30 bg-card p-7 shadow-[0_0_60px_hsl(74_100%_61%/.12)] md:p-9"><button data-testid="button-close-modal" onClick={onClose} aria-label="Close dialog" className="absolute right-5 top-5 p-1 text-muted-foreground hover:text-foreground"><X size={19} /></button>{isBook ? <><p className="font-mono text-[10px] uppercase tracking-[.2em] text-primary">Reserve your spot</p><h3 className="mt-4 font-display text-5xl font-bold uppercase">{selectedClass?.name}</h3><p className="mt-3 text-sm text-muted-foreground">{selectedClass?.time} · {selectedClass?.duration} · coached by {selectedClass?.coach}</p><label className="mt-8 block text-xs font-bold uppercase tracking-[.12em] text-muted-foreground">Email to confirm<input data-testid="input-book-email" type="email" required placeholder="you@email.com" className="mt-2 block w-full border border-white/15 bg-background px-4 py-3 text-sm" /></label><button data-testid="button-confirm-booking" onClick={onConfirmBooking} className="mt-5 w-full bg-primary py-3.5 text-xs font-bold uppercase tracking-[.16em] text-background">Confirm reservation <Check size={14} className="ml-1 inline" /></button></> : isPlan ? <><p className="font-mono text-[10px] uppercase tracking-[.2em] text-cyan">Member access</p><h3 className="mt-4 font-display text-5xl font-bold uppercase">{selectedPlan ? `Start ${selectedPlan}` : 'Welcome back'}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{selectedPlan ? 'Good choice. Leave your details and our team will get your first week moving.' : 'Member login is coming soon. Want to skip the queue and tour the floor instead?'}</p><input data-testid="input-plan-email" type="email" placeholder="Email address" className="mt-7 block w-full border border-white/15 bg-background px-4 py-3 text-sm" /><button data-testid="button-plan-confirm" onClick={onClose} className="mt-4 w-full bg-cyan py-3.5 text-xs font-bold uppercase tracking-[.16em] text-background">{selectedPlan ? 'Request my start date' : 'Got it'}</button></> : <><p className="font-mono text-[10px] uppercase tracking-[.2em] text-primary">First visit</p><h3 className="mt-4 font-display text-5xl font-bold uppercase">See the floor.<br /><span className="text-primary">Feel the difference.</span></h3><p className="mt-4 text-sm leading-relaxed text-muted-foreground">Leave your email and we will line up a 20-minute walk-through with a coach. No pressure, just a clear look at how we work.</p><input data-testid="input-tour-email" type="email" placeholder="Email address" className="mt-7 block w-full border border-white/15 bg-background px-4 py-3 text-sm" /><button data-testid="button-tour-confirm" onClick={onClose} className="mt-4 w-full bg-primary py-3.5 text-xs font-bold uppercase tracking-[.16em] text-background">Book my tour <ArrowRight size={14} className="ml-1 inline" /></button></>}</motion.div></motion.div>;
}

function ArrowUpRightIcon() { return <ArrowRight size={14} className="-rotate-45" />; }
function ActivityIcon() { return <span className="relative block h-5 w-5"><span className="absolute bottom-0 left-0 h-2 w-1 bg-cyan" /><span className="absolute bottom-0 left-2 h-4 w-1 bg-cyan" /><span className="absolute bottom-0 left-4 h-5 w-1 bg-cyan" /></span>; }

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}
function RoutedErrorBoundary({ children }: { children: ReactNode }) { const [location] = useLocation(); return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>; }
function App() { return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>; }
export default App;