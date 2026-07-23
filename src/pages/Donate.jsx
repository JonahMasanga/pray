import { useState, useEffect } from 'react';
//import { base44 } from '@/api/base44Client';
import DonationForm from '@/components/DonationForm';
import { Heart, Shield, Globe } from 'lucide-react';

export default function Donate() {
  const [totalRaised, setTotalRaised] = useState(0);
  const [donorCount, setDonorCount] = useState(0);

  useEffect(() => {
    base44.entities.Donation
      .list('-created_date', 500)
      .then((donations) => {
        setTotalRaised(donations.reduce((sum, d) => sum + (d.amount || 0), 0));
        setDonorCount(donations.length);
      })
      .catch(() => {});
  }, []);

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

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-stone-100">
            <p className="font-display text-3xl font-semibold text-[#1A1830]">
              ${totalRaised.toLocaleString()}
            </p>
            <p className="text-sm text-stone-400 mt-1">Total Raised</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-stone-100">
            <p className="font-display text-3xl font-semibold text-[#1A1830]">{donorCount}</p>
            <p className="text-sm text-stone-400 mt-1">Generous Donors</p>
          </div>
        </div>

        {/* Donate */}
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
