type AvatarProps = {
  src?: string;
  alt: string;
  fallback: string;
  size?: number;
  className?: string;
};

export default function Avatar({ src, alt, fallback, size = 40, className = "" }: AvatarProps) {
  const showImage = Boolean(src);

  return (
    <div
      className={`avatar ${className}`.trim()}
      style={{ width: size, height: size }}
      aria-label={alt}
    >
      {showImage ? (
        <img src={src} alt={alt} className="avatar-image" />
      ) : (
        <span className="avatar-fallback">{fallback}</span>
      )}
    </div>
  );
}
