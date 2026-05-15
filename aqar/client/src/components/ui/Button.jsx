import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({
  children,
  to,
  type = 'button',
  variant = 'primary', // primary, secondary, outline, text, accent
  size = 'md', // sm, md, lg, xl
  className = '',
  icon,
  iconRight,
  isLoading = false,
  disabled = false,
  onClick,
  fullWidth = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold uppercase tracking-widest transition-all duration-200 transform active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none';
  
  const variants = {
    primary: 'bg-[#1b5e20] text-white hover:bg-[#00450d] shadow-sm',
    secondary: 'bg-[#00450d] text-white hover:bg-[#002203] shadow-sm',
    outline: 'bg-transparent border-2 border-[#1b5e20] text-[#1b5e20] hover:bg-[#1b5e20] hover:text-white',
    text: 'bg-transparent text-[#1b5e20] hover:bg-[#1b5e20]/5',
    accent: 'bg-[#fcab28] text-[#694300] hover:bg-[#ffb957] shadow-sm',
    glass: 'bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20',
  };

  const sizes = {
    sm: 'px-4 py-2 text-[10px] rounded-full',
    md: 'px-6 py-3 text-xs rounded-full',
    lg: 'px-8 py-4 text-xs md:text-sm rounded-full',
    xl: 'px-10 py-5 text-sm md:text-base rounded-2xl md:rounded-full',
  };

  const combinedStyles = `
    ${baseStyles}
    ${variants[variant] || variants.primary}
    ${sizes[size] || sizes.md}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  const content = (
    <>
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && <span className="material-symbols-outlined text-[1.2em]">{icon}</span>}
          <span className="truncate">{children}</span>
          {iconRight && <span className="material-symbols-outlined text-[1.2em]">{iconRight}</span>}
        </>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedStyles} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={combinedStyles}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;
