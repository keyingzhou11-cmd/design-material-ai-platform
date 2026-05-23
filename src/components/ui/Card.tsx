import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover, onClick }: CardProps) {
  const classes = cn(
    'rounded-2xl bg-white border border-beige-200/60 shadow-card',
    hover && 'transition-all duration-200 hover:shadow-soft hover:border-beige-300 cursor-pointer',
    onClick && 'text-left w-full',
    className
  );

  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick}>
        {children}
      </button>
    );
  }

  return <div className={classes}>{children}</div>;
}
