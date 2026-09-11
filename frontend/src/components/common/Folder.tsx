import { useState, type CSSProperties, type ReactNode } from "react";
import "./Folder.css";

type FolderProps = {
  color?: string;
  size?: number;
  items?: ReactNode[];
  className?: string;
};

const darkenColor = (hex: string, percent: number) => {
  let color = hex.replace("#", "");
  if (color.length === 3) color = color.split("").map((value) => value + value).join("");
  const number = parseInt(color.slice(0, 6), 16);
  const red = Math.max(0, Math.floor(((number >> 16) & 255) * (1 - percent)));
  const green = Math.max(0, Math.floor(((number >> 8) & 255) * (1 - percent)));
  const blue = Math.max(0, Math.floor((number & 255) * (1 - percent)));
  return `#${[red, green, blue].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
};

export default function Folder({ color = "#087ea4", size = 1, items = [], className = "" }: FolderProps) {
  const papers = [...items.slice(0, 3), null, null, null].slice(0, 3);
  const [open, setOpen] = useState(false);
  const [offsets, setOffsets] = useState(() => Array.from({ length: 3 }, () => ({ x: 0, y: 0 })));
  const folderStyle = {
    "--folder-color": color,
    "--folder-back-color": darkenColor(color, 0.12),
    "--paper-1": "#dbeafe",
    "--paper-2": "#e0f2fe",
    "--paper-3": "#ffffff"
  } as CSSProperties;

  const resetOffsets = () => setOffsets(Array.from({ length: 3 }, () => ({ x: 0, y: 0 })));
  const toggle = () => { setOpen((value) => !value); if (open) resetOffsets(); };

  return <div className={`folder-scale ${className}`.trim()} style={{ transform: `scale(${size})` }}>
    <div className={`folder ${open ? "open" : ""}`} style={folderStyle} onClick={toggle} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggle(); } }} tabIndex={0} role="button" aria-expanded={open} aria-label={open ? "Close AI and Data Science resources" : "Open AI and Data Science resources"}>
      <div className="folder__back">
        {papers.map((item, index) => <div key={index} className={`paper paper-${index + 1}`} onMouseMove={(event) => { if (!open) return; const rect = event.currentTarget.getBoundingClientRect(); setOffsets((current) => current.map((value, itemIndex) => itemIndex === index ? { x: (event.clientX - (rect.left + rect.width / 2)) * 0.15, y: (event.clientY - (rect.top + rect.height / 2)) * 0.15 } : value)); }} onMouseLeave={() => setOffsets((current) => current.map((value, itemIndex) => itemIndex === index ? { x: 0, y: 0 } : value))} style={open ? { "--magnet-x": `${offsets[index].x}px`, "--magnet-y": `${offsets[index].y}px` } as CSSProperties : undefined}>{item}</div>)}
        <div className="folder__front" /><div className="folder__front right" />
      </div>
    </div>
  </div>;
}
