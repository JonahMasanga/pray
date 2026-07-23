import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Heart, BookOpen, Sparkles, Bot, Gift, Church, Users } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home', icon: Home, short: 'Home' },
  { to: '/requests', label: 'Prayer Requests', icon: Heart, short: 'Prayer' },
  { to: '/devotion', label: 'Daily Devotion', icon: BookOpen, short: 'Devotion' },
  { to: '/testimonies', label: 'Testimonies', icon: Sparkles, short: 'Stories' },
  { to: '/community', label: 'Community', icon: Users, short: 'Community' },
  { to: '/assistant', label: 'AI Assistant', icon: Bot, short: 'AI' },
  { to: '/donate', label: 'Support', icon: Gift, short: 'Give' },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col bg-[#1A1830] text-white z-40">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2.5">
            <Church className="w-7 h-7 text-[#C9A961]" />
            <span className="font-display text-2xl font-semibold tracking-tight">PrayerHub</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white/10 text-[#C9A961]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-6 border-t border-white/5">
          <p className="text-white/30 text-xs italic leading-relaxed">
            "Devote yourselves to prayer, being watchful and thankful."
          </p>
          <p className="text-[#C9A961]/60 text-xs mt-1.5">— Colossians 4:2</p>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#1A1830] text-white px-4 py-3 flex items-center gap-2">
        <Church className="w-6 h-6 text-[#C9A961]" />
        <span className="font-display text-xl font-semibold">PrayerHub</span>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-[#1A1830] border-t border-white/10 z-40">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-0.5 py-2.5 px-1 flex-1 transition-colors ${
                  isActive ? 'text-[#C9A961]' : 'text-white/40'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-medium">{item.short}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="lg:ml-64 pb-16 lg:pb-0">
        <Outlet />
      </main>
    </div>
  );
}
