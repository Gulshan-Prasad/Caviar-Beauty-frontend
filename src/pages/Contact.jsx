import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';
import PageTransition from '@/components/layout/PageTransition';
import api from '@/utils/api';
import { useSeo } from '@/hooks/useSeo';
import toast from 'react-hot-toast';

const schema = z.object({ name: z.string().min(1), email: z.string().email(), subject: z.string().min(1), message: z.string().min(10) });

export default function Contact() {
  useSeo('Contact', 'Get in touch with Caviar Beauty — we reply within 24 hours.');
  const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await api.post('/contact', data);
      toast.success('Message sent! We will get back to you shortly.');
      reset();
    } catch {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <PageTransition>
      <div className="pt-24 md:pt-32 pb-20 px-4 md:px-8 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <p className="section-subtitle">Get In Touch</p>
            <h1 className="section-title mt-3">Contact Us</h1>
            <div className="w-16 h-[1px] bg-gold-500 mt-6" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs tracking-widest uppercase font-medium mb-2">Name</label>
                    <input {...register('name')} className="input-field" placeholder="Your name" />
                    {errors.name && <p className="text-red-500 text-xs mt-1">Required</p>}
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase font-medium mb-2">Email</label>
                    <input type="email" {...register('email')} className="input-field" placeholder="your@email.com" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">Valid email required</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase font-medium mb-2">Subject</label>
                  <input {...register('subject')} className="input-field" placeholder="How can we help?" />
                  {errors.subject && <p className="text-red-500 text-xs mt-1">Required</p>}
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase font-medium mb-2">Message</label>
                  <textarea {...register('message')} rows={5} className="input-field resize-none" placeholder="Tell us more..." />
                  {errors.message && <p className="text-red-500 text-xs mt-1">Minimum 10 characters</p>}
                </div>
                <button type="submit" className="btn-primary text-xs">Send Message</button>
              </form>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-8">
              {[
                { icon: FiMapPin, title: 'Flagship Store', info: '725 Fifth Avenue, New York, NY 10022', sub: 'Open daily 10AM - 8PM' },
                { icon: FiPhone, title: 'Phone', info: '+1 (555) 123-4567', sub: '24/7 Concierge Service' },
                { icon: FiMail, title: 'Email', info: 'hello@caviarbeauty.com', sub: 'We reply within 24 hours' },
                { icon: FiClock, title: 'Business Hours', info: 'Mon - Sat: 10AM - 8PM', sub: 'Sunday: 12PM - 6PM' },
              ].map((item) => (
                <div key={item.title} className="flex space-x-4">
                  <div className="w-12 h-12 flex items-center justify-center border border-caviar-300 dark:border-caviar-600 flex-shrink-0">
                    <item.icon className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <h3 className="text-sm tracking-widest uppercase font-medium">{item.title}</h3>
                    <p className="text-caviar-600 dark:text-caviar-300 mt-1">{item.info}</p>
                    <p className="text-xs text-caviar-400 mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
