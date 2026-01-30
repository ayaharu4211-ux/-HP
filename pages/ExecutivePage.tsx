
import React from 'react';

const ExecutivePage = ({ data, isAdmin, updateData, EditableText, EditableImage }: any) => {
  return (
    <div className="pt-32 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20 text-center">
          <h2 className="text-blue-600 font-bold tracking-widest uppercase mb-4">Leadership</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-slate-900">役員紹介</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {data.executives.map((exec: any, idx: number) => (
            <div key={idx} className="group">
              <div className="relative mb-8 overflow-hidden rounded-2xl aspect-[4/5] corporate-shadow">
                <EditableImage path={`executives.${idx}.image`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={exec.name} />
              </div>
              <div className="space-y-4">
                <EditableText path={`executives.${idx}.role`} className="text-sm font-bold text-blue-600 uppercase tracking-wider block" />
                <EditableText path={`executives.${idx}.name`} className="text-2xl font-bold text-slate-900 block" element="h4" />
                <EditableText path={`executives.${idx}.bio`} className="text-slate-600 leading-relaxed text-sm block" element="p" />
              </div>
            </div>
          ))}
          {isAdmin && (
            <button 
              className="border-4 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-300 hover:text-blue-400 hover:border-blue-400 transition-all min-h-[400px]"
              onClick={() => {
                const newExec = { name: '新役員名', role: '役職', bio: '経歴', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400' };
                updateData('executives', [...data.executives, newExec]);
              }}
            >
              <i className="fa-solid fa-plus text-4xl"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExecutivePage;
