
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { PageId } from '../types';

interface FooterProps {
  onAdminClick: () => void;
  navigate: (page: PageId) => void;
  companyName: string;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick, navigate, companyName }) => {
  return (
    <footer className="bg-slate-900 text-white pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="mb-16">
           <div className="luxury-serif text-5xl tracking-[0.2em] mb-4 uppercase">{companyName}</div>
        </div>

        <div className="flex flex-wrap justify-center gap-12 mb-20">
          {NAV_ITEMS.map(item => (
            <button key={item.href} onClick={() => navigate(item.href)} className="text-[11px] tracking-[0.2em] font-bold text-slate-400 hover:text-white transition-colors uppercase">
              {item.label}
            </button>
          ))}
        </div>

        <div className="border-t border-slate-800/50 pt-16 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] tracking-[0.2em] font-bold text-slate-500">
             © 2024 {companyName} CORP. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-8 items-center text-slate-500">
             <button onClick={onAdminClick} className="hover:text-white transition-colors"><i className="fa-solid fa-lock"></i></button>
             <span className="text-[9px] tracking-[0.2em] font-bold opacity-30">BY RENOSAWA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
