import React, { useState } from 'react';
import { Menu, Globe, Users, MapPin, Grid3X3, ListFilter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { useLocation, Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

interface AdminLayoutProps {
  children: React.ReactNode;
  loading: boolean;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, loading }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { language, setLanguage, t, isRTL } = useLanguage();
  const location = useLocation();

  const menuItems = [
    { icon: Grid3X3, label: t('dashboard'), href: '/' },
    { icon: Users, label: t('users'), href: '/users' },
    { icon: MapPin, label: t('regions'), href: '/regions' },
    { icon: Grid3X3, label: t('categories'), href: '/categories' },
    { icon: Grid3X3, label: t('sliders'), href: '/sliders' },
    // { icon: ListFilter, label: t('dynamicAttributes'), href: '/dynamic-attributes' },
  ];

  return (
    <div className={cn("min-h-screen bg-background", isRTL ? "rtl" : "ltr")}>
      {/* Navbar */}
      <nav className="bg-card border-b border-border px-4 py-3 fixed w-full top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-primary hover:bg-accent"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">س</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{t('mazad')}</h1>
                <p className="text-sm text-muted-foreground">{t('adminPanel')}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="text-foreground border-border hover:bg-accent"
            >
              <Globe className="h-4 w-4 me-2" />
              {language === 'ar' ? 'English' : 'العربية'}
            </Button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 h-screen pt-20 transition-transform bg-card border-e border-border shadow-lg",
        isRTL && "left-auto right-0 border-e-0 border-s",
        sidebarOpen ? "translate-x-0" : (isRTL ? "translate-x-full" : "-translate-x-full"),
        "w-64"
      )}>
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center p-3 rounded-lg transition-colors",
                    location.pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground hover:bg-accent/50"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isRTL ? "ml-3" : "mr-3")} />
                  <span className="flex-1">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "pt-20 transition-all duration-300",
        sidebarOpen ? (isRTL ? "mr-64" : "ml-64") : "ml-0"
      )}>
        <div className="p-6">
          {children}
        </div>
        {loading && (
          <div className="fixed inset-0 top-16 bg-background/75 flex items-center justify-center" style={{ zIndex: 1000 }}>
            <div className="flex items-center justify-center p-4 rounded-lg shadow-lg bg-card">
              <span className="text-foreground font-medium mr-1">{t('loading')}...</span>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        )}
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
