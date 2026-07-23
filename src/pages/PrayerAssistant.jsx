import AIChat from '@/components/AIChat';

export default function PrayerAssistant() {
  return (
    <div className="flex flex-col h-[calc(100vh-56px)] lg:h-screen bg-[#FAF8F3]">
      <div className="px-4 pt-4 pb-2 text-center flex-shrink-0">
        <p className="text-[#C9A961] text-xs font-medium tracking-widest uppercase mb-0.5">
          AI Prayer Assistant
        </p>
        <h1 className="font-display text-xl lg:text-2xl font-semibold text-[#1A1830]">
          Your Spiritual Companion
        </h1>
      </div>
      <div className="flex-1 min-h-0">
        <AIChat />
      </div>
    </div>
  );
}
