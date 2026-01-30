
import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants';
import { PageId, CompanyData } from '../types';

interface NavbarProps {
  navigate: (page: PageId) => void;
  currentPath: PageId;
  data: CompanyData;
  isAdmin: boolean;
  updateData: (path: string, val: any) => void;
  EditableImage: any;
  isEditingImage?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ navigate, currentPath, data, isAdmin, updateData, EditableImage, isEditingImage }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const transparent = !isScrolled && currentPath === 'home';
  
  const activeStyle = isEditingImage ? 'opacity-40' : 'opacity-100';

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 ${!transparent ? 'glass-morphism corporate-shadow py-2' : 'bg-transparent py-10'} ${activeStyle}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-8 cursor-pointer group/logo" onClick={() => !isEditingImage && navigate('home')}>
          {/* ロゴサイズを w-16 -> w-24 に拡大 */}
          <div className="w-20 h-20 md:w-24 md:h-24 overflow-hidden rounded-full border border-slate-100/20 shadow-xl relative z-30 transition-all duration-500 group-hover/logo:scale-110 bg-white/5 backdrop-blur-md flex-shrink-0">
            <EditableImage path="logoUrl" className="w-full h-full object-cover" alt="Logo" />
          </div>
          <div className="flex flex-col justify-center">
            {isAdmin ? (
              <input 
                value={data.companyName} 
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => updateData('companyName', e.target.value)}
                disabled={isEditingImage}
                className={`text-2xl md:text-3xl font-bold tracking-[0.2em] bg-transparent border-b border-dashed border-slate-300 outline-none luxury-serif ${!transparent ? 'text-slate-900' : 'text-white'}`}
              />
            ) : (
              <span className={`text-2xl md:text-3xl font-bold tracking-[0.2em] luxury-serif uppercase transition-colors duration-500 ${!transparent ? 'text-slate-900' : 'text-white'}`}>
                {data.companyName}
              </span>
            )}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {NAV_ITEMS.map((item) => (
            <button 
              key={item.href} onClick={() => !isEditingImage && navigate(item.href)}
              disabled={isEditingImage}
              className={`text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-300 hover:opacity-100 ${
                currentPath === item.href ? 'text-slate-900 border-b border-slate-900 opacity-100' : 'opacity-60'
              } ${!transparent ? 'text-slate-900' : 'text-white'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        
        <div className="md:hidden">
            <i className={`fa-solid fa-bars-staggered text-xl ${!transparent ? 'text-slate-900' : 'text-white'}`}></i>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
