
import React from 'react';

const ContactPage = ({ data, isAdmin, EditableText, EditableImage }: any) => {
  return (
    <div className="pt-48 pb-64 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="mb-20">
          <EditableText path="contact.title" className="luxury-serif text-6xl text-slate-900 mb-8 block text-center" element="h2" />
          <EditableText path="contact.sub" className="text-slate-400 text-[10px] tracking-[0.5em] font-bold mb-12 uppercase block text-center" element="p" />
          <EditableText path="contact.desc" className="text-slate-500 text-xl leading-relaxed max-w-2xl mx-auto font-light block text-center" element="p" />
        </div>
        
        <div className="bg-white p-12 md:p-24 rounded-[4rem] corporate-shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
            
            <div className="space-y-16 text-left border-r border-slate-100 pr-10">
              <div className="flex gap-8">
                <div className="text-slate-200 text-3xl"><i className="fa-solid fa-envelope"></i></div>
                <div>
                  <EditableText path="contact.emailLabel" className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-2 block" element="p" />
                  <EditableText path="contact.email" className="text-xl luxury-serif text-slate-800" />
                </div>
              </div>
              
              <div className="flex gap-8">
                <div className="text-slate-200 text-3xl"><i className="fa-solid fa-phone-volume"></i></div>
                <div>
                  <EditableText path="contact.phoneLabel" className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-2 block" element="p" />
                  <EditableText path="contact.phone" className="text-xl luxury-serif text-slate-800" />
                </div>
              </div>

              <div className="flex gap-8">
                <div className="text-slate-200 text-3xl"><i className="fa-solid fa-location-arrow"></i></div>
                <div>
                  <EditableText path="contact.addressLabel" className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-2 block" element="p" />
                  <EditableText path="contact.address" className="text-sm text-slate-800 font-light leading-relaxed" />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-12">
              <div className="w-full space-y-10">
                <div className="flex flex-col items-center gap-4 group">
                  <div className="flex items-center gap-3">
                    <i className="fa-brands fa-line text-2xl text-green-500"></i>
                    <EditableText path="contact.lineLabel" className="text-[10px] font-bold text-slate-400 tracking-widest uppercase block" element="div" />
                  </div>
                  <div className="w-40 h-40 bg-white p-3 rounded-2xl shadow-lg border border-slate-50 transition-transform group-hover:scale-105">
                    <EditableImage path="contact.lineQr" className="w-full h-full object-contain" alt="LINE QR" />
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4 group">
                  <div className="flex items-center gap-3">
                    <i className="fa-brands fa-instagram text-2xl text-pink-500"></i>
                    <EditableText path="contact.instagramLabel" className="text-[10px] font-bold text-slate-400 tracking-widest uppercase block" element="div" />
                  </div>
                  <div className="w-40 h-40 bg-white p-3 rounded-2xl shadow-lg border border-slate-50 transition-transform group-hover:scale-105">
                    <EditableImage path="contact.instagramQr" className="w-full h-full object-contain" alt="Instagram QR" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
