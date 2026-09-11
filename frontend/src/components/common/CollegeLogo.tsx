import klhLogoImg from "../../assets/klh_logo.png";
import kortexLogoImg from "../../assets/kortex_logo.png";

export default function CollegeLogo({ height = 36, className = "" }: { height?: number; className?: string }) {
  return (
    <div className={`flex items-center rounded-xl bg-white/95 px-3 py-1.5 shadow-md border border-white/20 backdrop-blur-md transition-all duration-300 hover:bg-white hover:shadow-lg ${className}`}>
      <img
        src={klhLogoImg}
        alt="KLH University Bachupally Campus"
        style={{ height }}
        className="w-auto object-contain"
      />
    </div>
  );
}

export function KortexLogo({ size = 120, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-full shadow-[0_0_35px_rgba(255,255,255,0.15)] transition-transform duration-300 hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={kortexLogoImg}
        alt="Kortex Main Logo"
        className="w-full h-full object-cover rounded-full"
      />
    </div>
  );
}

