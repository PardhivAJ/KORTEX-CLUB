import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./ProfileCard.css";

type ProfileCardProps = { name: string; title: string; handle: string; status?: string; contactText?: string; avatarUrl: string; enableTilt?: boolean; onContactClick?: () => void; className?: string };

export default function ProfileCard({ name, title, handle, status = "Available", contactText = "View profile", avatarUrl, enableTilt = true, onContactClick, className = "" }: ProfileCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("rotateX(0deg) rotateY(0deg)");
  useEffect(() => () => setTransform("rotateX(0deg) rotateY(0deg)"), []);
  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setTransform(`rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 12).toFixed(2)}deg)`);
  };
  return <article className={`profile-card-wrap ${className}`.trim()} onMouseMove={handleMove} onMouseLeave={() => setTransform("rotateX(0deg) rotateY(0deg)")}>
    <div ref={cardRef} className="profile-card" style={{ transform } as CSSProperties}>
      <div className="profile-card-glow" />
      <img className="profile-card-avatar" src={avatarUrl} alt={`${name} profile`} />
      <div className="profile-card-content"><p className="profile-card-kicker">Hackathon judge</p><h3>{name}</h3><p className="profile-card-title">{title}</p><div className="profile-card-footer"><div><p className="profile-card-handle">@{handle}</p><p className="profile-card-status"><span />{status}</p></div>{onContactClick && <button type="button" onClick={onContactClick}>{contactText}</button>}</div></div>
    </div>
  </article>;
}
