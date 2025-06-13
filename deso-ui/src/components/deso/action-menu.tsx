import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionMenuItemProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  onClick?: () => void;
  variant?: 'default' | 'destructive';
  className?: string;
  disabled?: boolean;
}

export function ActionMenuItem({
  children,
  icon: Icon,
  onClick,
  variant,
  className,
  disabled,
}: ActionMenuItemProps) {
  return (
    <DropdownMenuItem
      onClick={onClick}
      variant={variant}
      disabled={disabled}
      className={cn('flex cursor-pointer items-center gap-2', className)}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </DropdownMenuItem>
  );
}

interface ActionMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'center' | 'start' | 'end';
}

export function ActionMenu({
  trigger,
  children,
  align = 'end',
}: ActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align}>{children}</DropdownMenuContent>
    </DropdownMenu>
  );
}

export { DropdownMenuSeparator as ActionMenuSeparator }; 