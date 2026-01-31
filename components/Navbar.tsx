
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (page: PageId) => {
    setIsMenuOpen(false);
    navigate(page);
  };

  const transparent = !isScrolled && currentPath === 'home';
  const activeStyle = isEditingImage ? 'opacity-40' : 'opacity-100';
  
  // 背景がヒーロー画像（透明）の時は「白」
  // スクロール後や背景が白の時は、要望通り「グレー（Gray-500）」を採用
  // !重要度フラグを使用して、他のスタイルに上書きされないようにします
  const textColor = (transparent && !isMenuOpen) ? 'text-white' : 'text-gray-500';
  
  // 透明背景の時（白文字）のみ、視認性を高めるための影を付与
  const shadowStyle = (transparent && !isMenuOpen) ? 'drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]' : '';

  return (
    <>
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 ${!transparent || isMenuOpen ? 'glass-morphism corporate-shadow py-2' : 'bg-transparent py-4 md:py-10'} ${activeStyle}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 md:gap-8 cursor-pointer group/logo" onClick={() => !isEditingImage && handleNavigate('home')}>
            <div className="w-10 h-10 md:w-20 md:h-20 overflow-hidden rounded-full border border-slate-100/20 shadow-xl relative z-30 transition-all duration-500 group-hover/logo:scale-110 bg-white/5 backdrop-blur-md flex-shrink-0">
              <EditableImage path="logoUrl" className="w-full h-full object-cover" alt="Logo" />
            </div>
            <div className="flex flex-col justify-center overflow-hidden max-w-[140px] sm:max-w-none">
              {isAdmin ? (
                <input 
                  value={data.companyName} 
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => updateData('companyName', e.target.value)}
                  disabled={isEditingImage}
                  className={`text-xs sm:text-lg md:text-3xl font-bold tracking-[0.1em] md:tracking-[0.2em] bg-transparent border-b border-dashed border-slate-300 outline-none luxury-serif whitespace-nowrap overflow-hidden text-ellipsis transition-colors duration-500 ${textColor} ${shadowStyle}`}
                />
              ) : (
                <span className={`text-xs sm:text-lg md:text-3xl font-bold tracking-[0.1em] md:tracking-[0.2em] luxury-serif uppercase transition-colors duration-500 whitespace-nowrap overflow-hidden text-ellipsis ${textColor} ${shadowStyle}`}>
                  {data.companyName}
                </span>
              )}
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_ITEMS.map((item) => (
              <button 
                key={item.href} onClick={() => !isEditingImage && handleNavigate(item.href)}
                disabled={isEditingImage}
                className={`text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-500 hover:opacity-100 ${textColor} ${shadowStyle} ${
                  currentPath === item.href ? 'border-b border-current opacity-100' : 'opacity-70'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          
          {/* Mobile Toggle */}
          <button 
            className="md:hidden z-[110] p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-xl sm:text-2xl transition-colors duration-500 ${textColor} ${shadowStyle}`}></i>
          </button>
        </div>
      </nav>

      {/* Fullscreen Mobile Menu */}
      <div className={`fixed inset-0 bg-white z-[90] transition-transform duration-500 md:hidden ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
          {NAV_ITEMS.map((item) => (
            <button 
              key={item.href} 
              onClick={() => handleNavigate(item.href)}
              className={`text-xl font-bold tracking-[0.2em] uppercase transition-all ${
                currentPath === item.href ? 'text-gray-800 border-b-2 border-gray-800' : 'text-gray-400'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="mt-12 text-[10px] tracking-[0.4em] text-gray-300 font-bold uppercase">
            © {data.companyName}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
