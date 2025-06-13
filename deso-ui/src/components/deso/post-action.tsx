import * as React from 'react';
import {
  Heart,
  MessageSquare,
  Repeat2,
  BarChart2,
  LucideIcon,
  Gem,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import NumberFlow, { continuous, type Format } from '@number-flow/react';

type ActionVariant =
  | 'like'
  | 'repost'
  | 'comment'
  | 'diamond'
  | 'view'

interface PostActionProps {
  variant: ActionVariant;
  count: number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  value?: string;
  abbreviate?: boolean;
  decimals?: number;
}

const variantConfig: {
  [key in ActionVariant]: {
    Icon: LucideIcon;
    activeColor?: string;
    fillClass?: string;
    hoverBgClass?: string;
  };
} = {
  comment: {
    Icon: MessageSquare,
    activeColor: 'text-blue-500',
    hoverBgClass: 'before:group-hover:bg-blue-500/10',
  },
  like: {
    Icon: Heart,
    activeColor: 'text-pink-500',
    fillClass: 'fill-pink-500',
    hoverBgClass: 'before:group-hover:bg-pink-500/10',
  },
  repost: {
    Icon: Repeat2,
    activeColor: 'text-green-500',
    hoverBgClass: 'before:group-hover:bg-green-500/10',
  },
  diamond: {
    Icon: Gem,
    activeColor: 'text-blue-400',
    hoverBgClass: 'before:group-hover:bg-blue-400/10',
  },
  view: { Icon: BarChart2 },
};

export function PostAction({
  variant,
  count,
  active = false,
  onClick,
  className,
  value,
  abbreviate = true,
  decimals = 1,
}: PostActionProps) {
  const config = variantConfig[variant];

  const numberFormat: Format = {
    notation: abbreviate ? 'compact' : 'standard',
    compactDisplay: 'short',
    maximumFractionDigits: decimals,
  };

  return (
    <button
      onClick={onClick}
      disabled={!onClick && variant !== 'view'}
      className={cn(
        'group cursor-pointer relative flex items-center gap-1.5 text-sm text-muted-foreground transition-colors',
        'disabled:pointer-events-none disabled:opacity-50',
        onClick && 'hover:text-foreground',
        { [config.activeColor!]: active && config.activeColor },
        className
      )}
    >
      <div
        className={cn(
          "relative rounded-full before:content-[''] before:absolute before:-inset-1.5 before:rounded-full before:transition-colors",
          config.hoverBgClass
        )}
      >
        <config.Icon
          className={cn('h-4 w-4 transition-transform group-active:scale-90', {
            [config.fillClass!]: active && config.fillClass, 
          })}
        />
      </div>

      {(count > 0 || variant === 'view') && (
        <NumberFlow
          value={count}
          format={numberFormat}
          plugins={[continuous]}
        />
      )}
      {value && (
        <span className="text-xs text-muted-foreground/80">{value}</span>
      )}
    </button>
  );
} 