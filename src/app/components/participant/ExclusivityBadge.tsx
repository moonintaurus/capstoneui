import { Shield, Users, BookOpen, Building2 } from 'lucide-react';
import { C } from './data';

interface ExclusivityBadgeProps {
  exclusivity: string;
  exclusivityDetails?: {
    type?: 'open' | 'studentsOnly' | 'facultyOnly' | 'specificOffices';
    offices?: string[];
  };
  className?: string;
}

export function ExclusivityBadge({
  exclusivity,
  exclusivityDetails,
  className = ''
}: ExclusivityBadgeProps) {
  // Don't show badge for open events
  if (exclusivity === 'Open to All' || !exclusivity) {
    return null;
  }

  let icon = Shield;
  let label = exclusivity;
  let bgColor = C.maroon + '12';
  let textColor = C.maroon;

  // Determine display based on exclusivity type
  if (exclusivityDetails?.type === 'studentsOnly') {
    icon = Users;
    label = 'Students Only';
    bgColor = C.indigo + '15';
    textColor = C.indigo;
  } else if (exclusivityDetails?.type === 'facultyOnly') {
    icon = BookOpen;
    label = 'Faculty Only';
    bgColor = C.slate + '15';
    textColor = C.slate;
  } else if (exclusivityDetails?.type === 'specificOffices') {
    icon = Building2;
    label = exclusivityDetails.offices?.length === 1
      ? `${exclusivityDetails.offices[0]} Only`
      : `Specific Offices (${exclusivityDetails.offices?.length || 0})`;
    bgColor = C.goldenrod + '15';
    textColor = C.goldenrod;
  } else if (exclusivity === 'Student' || exclusivity.includes('Student')) {
    icon = Users;
    label = 'Students Only';
    bgColor = C.indigo + '15';
    textColor = C.indigo;
  } else if (exclusivity === 'Faculty' || exclusivity.includes('Faculty')) {
    icon = BookOpen;
    label = 'Faculty Only';
    bgColor = C.slate + '15';
    textColor = C.slate;
  }

  const Icon = icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${className}`}
      style={{ backgroundColor: bgColor, color: textColor }}
      title={exclusivityDetails?.offices?.join(', ') || exclusivity}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}
