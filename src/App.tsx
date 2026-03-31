/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layout, 
  Video, 
  Palette, 
  Megaphone, 
  ArrowRight, 
  CheckCircle2, 
  Mail, 
  Phone, 
  Loader2,
  ChevronLeft,
  MessageSquare
} from 'lucide-react';
import { cn } from './lib/utils';
import { ServiceType, WebDevFormData, PackageProposal, AppState } from './types';
import { generateProposals } from './services/geminiService';

const CONTACT_EMAIL = "Bismahsoftbd@gmail.com";
const WHATSAPP_NUMBER = "+8801345417317";

function generateProjectSummary(formData: WebDevFormData, selectedPackage: PackageProposal | 'custom' | null, customBudget?: number): string {
  if (!formData) return "";
  
  const packageName = selectedPackage === 'custom' ? 'Custom Package' : selectedPackage?.name;
  const packagePrice = selectedPackage === 'custom' 
    ? (customBudget ? `৳${Number(customBudget).toLocaleString()}` : 'Custom Budget') 
    : `৳${selectedPackage?.price.toLocaleString()}`;

  return `
*BismahSoft BD - Project Details*
--------------------------------
• *Project:* ${formData.projectName}
• *Client:* ${formData.clientName}
• *Contact:* ${formData.contactInfo}
• *Selected Package:* ${packageName}
• *Budget:* ${packagePrice}

*Project Requirements:*
• Goal: ${formData.goal}
• Audience: ${formData.targetAudience}
• Style: ${formData.stylePreference}
• Branding: ${formData.brandingGuideline}
• Content: ${formData.contentTypes}
• Sections: ${formData.sectionCount}
• Dashboard: ${formData.adminDashboard}
• Features: ${formData.specialFeatures}
• Hosting: ${formData.hostingStatus}
• Management: ${formData.management}
`.trim();
}

export default function App() {
  const [state, setState] = useState<AppState>({
    step: 'service_selection',
    selectedService: null,
    formData: null,
    proposals: null,
    selectedPackage: null,
  });

  const [loading, setLoading] = useState(false);

  const handleServiceSelect = (service: ServiceType) => {
    if (service === ServiceType.WEB_DEVELOPMENT) {
      setState(prev => ({ ...prev, selectedService: service, step: 'web_dev_form' }));
    } else {
      // For other services, we could have different forms, but for now we'll show a message
      // or just use the same form but with a note. 
      // The prompt specifically provided questions for Web Dev.
      alert(`${service} service flow is coming soon. Please select Web Development for now.`);
    }
  };

  const handleFormSubmit = async (data: WebDevFormData) => {
    setLoading(true);
    setState(prev => ({ ...prev, formData: data, step: 'ai_analysis' }));
    try {
      const proposals = await generateProposals(data);
      setState(prev => ({ ...prev, proposals, step: 'package_selection' }));
    } catch (error) {
      console.error(error);
      alert("AI analysis failed. Please try again.");
      setState(prev => ({ ...prev, step: 'web_dev_form' }));
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSelect = (pkg: PackageProposal | 'custom', customBudget?: number) => {
    setState(prev => ({ ...prev, selectedPackage: pkg, customBudget, step: 'contact_info' }));
  };

  const reset = () => {
    setState({
      step: 'service_selection',
      selectedService: null,
      formData: null,
      proposals: null,
      selectedPackage: null,
    });
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-[#1C1C1E] font-sans selection:bg-blue-500 selection:text-white relative overflow-hidden">
      {/* Background Accents - Floating Shapes for Glass Effect */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[30%] right-[-10%] w-[300px] h-[300px] bg-blue-300/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-3xl border-b border-white/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={reset}>
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-2xl">P</span>
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-2xl font-black tracking-tight text-blue-950">BismahSoft BD</span>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Project Portal</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-black text-gray-400">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">সার্ভিসসমূহ</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">পোর্টফোলিও</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">যোগাযোগ</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20 relative z-10">
        <AnimatePresence mode="wait">
          {state.step === 'service_selection' && (
            <ServiceSelection key="selection" onSelect={handleServiceSelect} />
          )}

          {state.step === 'web_dev_form' && (
            <WebDevForm 
              key="form" 
              onBack={() => setState(prev => ({ ...prev, step: 'service_selection' }))}
              onSubmit={handleFormSubmit} 
            />
          )}

          {state.step === 'ai_analysis' && (
            <AIAnalysis key="analysis" />
          )}

          {state.step === 'package_selection' && state.proposals && (
            <PackageSelection 
              key="packages" 
              proposals={state.proposals} 
              onSelect={handlePackageSelect}
              onBack={() => setState(prev => ({ ...prev, step: 'web_dev_form' }))}
            />
          )}

          {state.step === 'contact_info' && (
            <ContactInfo 
              key="contact" 
              selectedPackage={state.selectedPackage}
              formData={state.formData}
              customBudget={state.customBudget}
              onBack={() => setState(prev => ({ ...prev, step: 'package_selection' }))}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/20 py-12 bg-white/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">© 2026 BismahSoft BD. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const ServiceSelection: React.FC<{ onSelect: (s: ServiceType) => void }> = ({ onSelect }) => {
  const services = [
    { type: ServiceType.GRAPHIC_DESIGN, icon: Palette, color: "bg-blue-50 text-blue-600" },
    { type: ServiceType.VIDEO_EDITING, icon: Video, color: "bg-blue-50 text-blue-600" },
    { type: ServiceType.WEB_DEVELOPMENT, icon: Layout, color: "bg-blue-600 text-white" },
    { type: ServiceType.META_MARKETING, icon: Megaphone, color: "bg-blue-50 text-blue-600" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-12"
    >
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-blue-950">আপনার প্রজেক্ট শুরু করুন</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
          BismahSoft BD-এর সাথে আপনার ডিজিটাল যাত্রা শুরু করতে নিচের যেকোনো একটি সার্ভিস বেছে নিন।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service) => (
          <motion.div
            key={service.type}
            whileHover={{ scale: 1.02, y: -8 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(service.type)}
            className="group p-10 glass rounded-[3rem] cursor-pointer hover:border-blue-500/50 transition-all shadow-2xl shadow-blue-900/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-blue-500/10 transition-colors" />
            <div className="flex items-start justify-between relative z-10">
              <div className={cn("p-6 rounded-[1.5rem] shadow-xl", service.color)}>
                <service.icon size={40} />
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                <ArrowRight size={24} />
              </div>
            </div>
            <div className="mt-12 relative z-10">
              <h3 className="text-3xl font-black tracking-tight text-blue-950">{service.type}</h3>
              <p className="text-gray-500 mt-4 font-bold text-lg leading-relaxed">প্রফেশনাল কোয়ালিটি এবং দ্রুত ডেলিভারি নিশ্চিত করছি।</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const WebDevForm: React.FC<{ onSubmit: (data: WebDevFormData) => void, onBack: () => void }> = ({ onSubmit, onBack }) => {
  const [formData, setFormData] = useState<WebDevFormData>({
    projectName: '',
    clientName: '',
    contactInfo: '',
    goal: '',
    targetAudience: '',
    stylePreference: '',
    brandingGuideline: '',
    contentTypes: '',
    sectionCount: '',
    adminDashboard: '',
    specialFeatures: '',
    hostingStatus: '',
    management: '',
  });

  const questions = [
    { id: 'projectName', label: '১. প্রজেক্টের নাম:', placeholder: 'আপনার প্রজেক্টের নাম লিখুন' },
    { id: 'clientName', label: '২. ক্লায়েন্টের নাম (বা প্রতিষ্ঠানের নাম):', placeholder: 'আপনার নাম বা প্রতিষ্ঠানের নাম' },
    { id: 'contactInfo', label: '৩. যোগাযোগের তথ্য (ইমেইল/ফোন):', placeholder: 'ইমেইল বা ফোন নম্বর' },
    { id: 'goal', label: '৪. এই ওয়েবসাইটের মূল লক্ষ্য কী? (যেমন—নতুন কাজ পাওয়া, নিজের কাজ প্রদর্শন করা ইত্যাদি)', placeholder: 'আপনার লক্ষ্য বর্ণনা করুন' },
    { id: 'targetAudience', label: '৫. আপনার টার্গেট দর্শকরা কারা? (যেমন—সম্ভাব্য ক্লায়েন্ট, নিয়োগকর্তা ইত্যাদি)', placeholder: 'আপনার টার্গেট দর্শক কারা?' },
    { id: 'stylePreference', label: '৬. আপনার পছন্দের কোনো ডিজাইন, স্টাইল বা কালার থিম আছে কি?', placeholder: 'ডিজাইন বা কালার থিম' },
    { id: 'brandingGuideline', label: '৭. আপনার কোনো বিদ্যমান লোগো বা ব্র্যান্ডিং গাইডলাইন আছে?', placeholder: 'লোগো বা ব্র্যান্ডিং তথ্য' },
    { id: 'contentTypes', label: '৮. ওয়েবসাইটে কী ধরণের কন্টেন্ট থাকবে? (যেমন—ছবি, ভিডিও, টেক্সট, প্রজেক্ট বিবরণ)', placeholder: 'কন্টেন্ট এর ধরণ' },
    { id: 'sectionCount', label: '৯. আনুমানিক কয়টি পেজ বা সেকশন প্রয়োজন? (যেমন—Home, About, Portfolio, Contact)', placeholder: 'পেজ বা সেকশন সংখ্যা' },
    { id: 'adminDashboard', label: '১০. এডমিন ড্যাশবোর্ড কি প্রয়োজন? (এখান থেকে আপনি নিজে কন্টেন্ট ম্যানেজ করতে পারবেন)', placeholder: 'হ্যাঁ/না এবং কেন?' },
    { id: 'specialFeatures', label: '১১. কন্টাক্ট ফর্ম বা অন্য কোনো বিশেষ ফিচারের প্রয়োজন আছে কি?', placeholder: 'বিশেষ ফিচারসমূহ' },
    { id: 'hostingStatus', label: '১২. আপনার কি ডোমেইন এবং ভার্সেল হোস্টিং কেনা আছে?', placeholder: 'হ্যাঁ/না' },
    { id: 'management', label: '১৩. ওয়েবসাইটটি পরবর্তীতে কে ম্যানেজ করবে, আপনি নাকি আমি?', placeholder: 'ম্যানেজমেন্ট এর ধরণ' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-8"
      >
        <ChevronLeft size={20} />
        <span>ফিরে যান</span>
      </button>

      <div className="space-y-2">
        <h2 className="text-3xl font-bold">প্রজেক্টের বিবরণ দিন</h2>
        <p className="text-gray-500">নিচের ফর্মটি পূরণ করুন যাতে আমরা আপনার জন্য সেরা প্যাকেজটি তৈরি করতে পারি।</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 glass p-12 rounded-[3.5rem] shadow-2xl shadow-blue-900/5 border border-white/60">
        {questions.map((q) => (
          <div key={q.id} className="space-y-3">
            <label className="block text-sm font-black text-blue-950 ml-3 uppercase tracking-wider opacity-60">{q.label}</label>
            <input
              required
              type="text"
              placeholder={q.placeholder}
              value={(formData as any)[q.id]}
              onChange={(e) => setFormData({ ...formData, [q.id]: e.target.value })}
              className="w-full px-8 py-6 rounded-3xl bg-white/50 border border-white/60 focus:bg-white focus:border-blue-500 focus:ring-[12px] focus:ring-blue-500/5 outline-none transition-all placeholder:text-gray-300 font-bold text-lg text-blue-950 shadow-inner"
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full ios-button-primary py-7 rounded-3xl font-black text-2xl flex items-center justify-center gap-4 mt-12"
        >
          বিশ্লেষণ শুরু করুন <ArrowRight size={28} />
        </button>
      </form>
    </motion.div>
  );
};

const AIAnalysis: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-24 space-y-10 glass rounded-[3.5rem] shadow-2xl"
    >
      <div className="relative">
        <div className="w-28 h-28 border-[6px] border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center animate-pulse">
            <Loader2 className="text-blue-600" size={32} />
          </div>
        </div>
      </div>
      <div className="text-center space-y-4 px-8">
        <h2 className="text-4xl font-black tracking-tight text-blue-950">Project Manager Nabina is analyzing your Project.</h2>
        <p className="text-xl text-blue-600/60 font-bold">প্রজেক্ট ম্যানেজার নবীনা আপনার প্রজেক্ট বিশ্লেষণ করছেন...</p>
      </div>
    </motion.div>
  );
};

const PackageSelection: React.FC<{ 
  proposals: PackageProposal[], 
  onSelect: (p: PackageProposal | 'custom', budget?: number) => void,
  onBack: () => void
}> = ({ proposals, onSelect, onBack }) => {
  const [customBudget, setCustomBudget] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-12"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors"
      >
        <ChevronLeft size={20} />
        <span>ফিরে যান</span>
      </button>

      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold">আপনার জন্য প্রস্তাবিত প্যাকেজসমূহ</h2>
        <p className="text-gray-500">আপনার প্রয়োজন অনুযায়ী নিচের প্যাকেজগুলো থেকে একটি বেছে নিন।</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {proposals.map((pkg, idx) => (
          <div 
            key={idx}
            className={cn(
              "relative p-12 rounded-[3.5rem] glass flex flex-col h-full transition-all hover:shadow-2xl hover:scale-[1.03] border border-white/60",
              idx === 1 ? "ring-[12px] ring-blue-500/10 scale-105 z-10 bg-white/90" : ""
            )}
          >
            {idx === 1 && (
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-8 py-3 rounded-full text-[12px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-500/40">
                Most Popular
              </span>
            )}
            <div className="space-y-6 flex-grow">
              <h3 className="text-4xl font-black tracking-tight text-blue-950">{pkg.name}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black tracking-tighter text-blue-600">৳{pkg.price.toLocaleString()}</span>
                <span className="text-blue-900/30 text-sm font-black uppercase tracking-widest">/প্রজেক্ট</span>
              </div>
              <p className="text-lg text-gray-500 leading-relaxed font-bold">{pkg.description}</p>
              <div className="h-px bg-blue-900/10 my-10" />
              <ul className="space-y-6">
                {pkg.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-4 text-base font-black text-blue-950/70">
                    <div className="mt-1 bg-blue-600/10 p-1.5 rounded-full">
                      <CheckCircle2 size={18} className="text-blue-600 flex-shrink-0" />
                    </div>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => onSelect(pkg)}
              className={cn(
                "w-full mt-14 py-6 rounded-3xl font-black text-xl transition-all shadow-xl active:scale-[0.98]",
                idx === 1 ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/30" : "bg-blue-50 text-blue-600 hover:bg-blue-100 shadow-blue-900/5"
              )}
            >
              বেছে নিন
            </button>
          </div>
        ))}
      </div>

      <div className="glass p-12 rounded-[3.5rem] shadow-2xl shadow-blue-900/5 space-y-10 border border-white/40">
        <div className="space-y-3">
          <h3 className="text-3xl font-black tracking-tight text-blue-950">কাস্টম প্যাকেজ প্রয়োজন?</h3>
          <p className="text-gray-500 font-bold text-lg">আপনার যদি নির্দিষ্ট কোনো বাজেট থাকে, তবে এখানে উল্লেখ করুন।</p>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <input
            type="number"
            placeholder="আপনার বাজেট লিখুন (৳)"
            value={customBudget}
            onChange={(e) => setCustomBudget(e.target.value)}
            className="flex-grow px-8 py-5 rounded-2xl bg-white/60 border border-white/50 focus:bg-white focus:border-blue-500/50 outline-none transition-all font-black text-xl text-blue-600"
          />
          <button
            onClick={() => onSelect('custom', Number(customBudget))}
            disabled={!customBudget}
            className="px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-2xl shadow-blue-500/30"
          >
            কাস্টম প্যাকেজ পাঠান
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ContactInfo: React.FC<{ 
  selectedPackage: PackageProposal | 'custom' | null,
  formData: WebDevFormData | null,
  customBudget?: number,
  onBack: () => void
}> = ({ selectedPackage, formData, customBudget, onBack }) => {
  const packageName = selectedPackage === 'custom' ? 'Custom Package' : selectedPackage?.name;
  const packagePrice = selectedPackage === 'custom' 
    ? (customBudget ? `৳${Number(customBudget).toLocaleString()}` : 'Custom Budget') 
    : `৳${selectedPackage?.price.toLocaleString()}`;

  const summary = formData ? generateProjectSummary(formData, selectedPackage, customBudget) : "";
  const encodedSummary = encodeURIComponent(summary);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto space-y-12"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold transition-colors"
      >
        <ChevronLeft size={20} />
        <span>ফিরে যান</span>
      </button>

      <div className="text-center space-y-6">
        <div className="w-28 h-28 bg-blue-500/10 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 size={56} />
        </div>
        <div className="space-y-3">
          <h2 className="text-6xl font-black tracking-tighter text-blue-950">অভিনন্দন!</h2>
          <p className="text-2xl text-gray-500 font-bold">আপনি সফলভাবে <span className="text-blue-600 font-black">{packageName}</span> নির্বাচন করেছেন।</p>
          <p className="text-xl text-blue-600 font-black">বাজেট: {packagePrice}</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* WhatsApp Section */}
        <div className="glass p-10 rounded-[3.5rem] border border-white/50 shadow-2xl shadow-blue-900/5 space-y-8">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-emerald-500 rounded-3xl shadow-xl shadow-emerald-500/20">
              <MessageSquare className="text-white" size={32} />
            </div>
            <div>
              <h3 className="text-3xl font-black text-blue-950">WhatsApp Chat</h3>
              <p className="text-gray-500 font-bold">প্রজেক্ট ম্যানেজারকে সরাসরি মেসেজ পাঠান</p>
            </div>
          </div>
          
          <div className="bg-blue-50/50 p-8 rounded-3xl space-y-4">
            <h4 className="font-black text-blue-900 uppercase tracking-widest text-xs">প্রেরিতব্য তথ্য:</h4>
            <div className="text-sm text-blue-900/70 font-bold space-y-2 whitespace-pre-wrap">
              {summary}
            </div>
          </div>

          <a 
            href={`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodedSummary}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full bg-emerald-500 text-white py-6 rounded-2xl font-black text-xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 active:scale-[0.98]"
          >
            মেসেজ পাঠান <ArrowRight size={24} />
          </a>
        </div>

        {/* Email Section */}
        <div className="glass p-10 rounded-[3.5rem] border border-white/50 shadow-2xl shadow-blue-900/5 space-y-8">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-blue-600 rounded-3xl shadow-xl shadow-blue-600/20">
              <Mail className="text-white" size={32} />
            </div>
            <div>
              <h3 className="text-3xl font-black text-blue-950">Email Support</h3>
              <p className="text-gray-500 font-bold">অফিসিয়াল ইমেইল এর মাধ্যমে যোগাযোগ করুন</p>
            </div>
          </div>

          <a 
            href={`mailto:${CONTACT_EMAIL}?subject=Project Approval - ${formData?.projectName || 'New Project'}&body=${encodedSummary}`}
            className="flex items-center justify-center gap-3 w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98]"
          >
            ইমেইল পাঠান <ArrowRight size={24} />
          </a>
        </div>
      </div>

      <div className="text-center pt-8">
        <button 
          onClick={() => window.location.reload()}
          className="text-blue-600/50 hover:text-blue-600 text-lg font-black transition-all"
        >
          হোম পেজে ফিরে যান
        </button>
      </div>
    </motion.div>
  );
};
