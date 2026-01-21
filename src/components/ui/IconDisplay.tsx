

interface IconDisplayProps {
  icon: string;
  className?: string; // Applied to span (emoji) or img
  imageClassName?: string; // Applied only to img, useful for sizing
}

export function IconDisplay({ icon, className = '', imageClassName = 'w-6 h-6' }: IconDisplayProps) {
  const isImage = icon.includes('/') || icon.startsWith('http');

  if (isImage) {
    return (
      <img
        src={icon.startsWith("pixels/") ? `/${icon}` : icon}
        alt=""
        className={`object-contain ${imageClassName} ${className}`}
      />
    );
  }

  return <span className={className}>{icon}</span>;
}
