import DonationForm from '@/components/DonationForm';
import { Heart, Shield, Globe } from 'lucide-react';

export default function Donate() {
  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      <div className="max-w-4xl mx-auto px-4 py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[#C9A961] text-sm font-medium tracking-widest uppercase mb-2">
            Support Our Ministry
          </p>
          <h1 className="font-display text-3xl lg:text-4xl font-semibold text-[#1A1830]">
            Fuel the Mission
          </h1>
          <p className="text-stone-500 mt-2 max-w-xl mx-auto leading-relaxed">
            Your generosity sustains our prayer community, daily devotions, and ministry
            operations. Every gift makes a difference.
          </p>
        </div>

        {/* Donate Form Container */}
        <div className="max-w-xl mx-auto">
          <DonationForm />
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          <div className="flex items-center gap-2 text-sm text-stone-400">
            <Shield className="w-4 h-4" /> Secure Payments
          </div>
          <div className="flex items-center gap-2 text-sm text-stone-400">
            <Heart className="w-4 h-4" /> 100% Goes to Ministry
          </div>
          <div className="flex items-center gap-2 text-sm text-stone-400">
            <Globe className="w-4 h-4" /> Supporting Global Prayer
          </div>
        </div>
      </div>
    </div>
  );
}
