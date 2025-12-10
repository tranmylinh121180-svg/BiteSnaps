import React from 'react';

export const Logo = () => (
  <div className="flex flex-col items-center">
    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center transform rotate-3 shadow-lg mb-2">
      <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </div>
    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">BiteSnaps</h1>
  </div>
);

export const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button' }: { children?: React.ReactNode, onClick?: () => void, variant?: 'primary' | 'secondary' | 'ghost', className?: string, type?: 'button' | 'submit' }) => {
  const baseStyle = "w-full py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 active:scale-95",
    ghost: "text-gray-500 hover:text-gray-700"
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export const Input = ({ label, type = "text", value, onChange, placeholder }: { label: string, type?: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-600 mb-1.5 ml-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
    />
  </div>
);

export const TabIcon = ({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center w-full py-1 transition-colors ${active ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}>
    <div className={`transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
      {icon}
    </div>
    <span className="text-[10px] font-medium mt-1">{label}</span>
  </button>
);