import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface ProfileTagProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  children: React.ReactNode;
  asChild?: boolean;
}

export const ProfileTag = ({
  icon,
  children,
  className,
  ...props
}: ProfileTagProps) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        'text-xs font-medium text-muted-foreground gap-1.5',
        className
      )}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </Badge>
  );
}; 