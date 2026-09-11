import { useEffect } from "react";
import type { ReactNode } from "react";
import MoltenMetal from "../common/MoltenMetal";
import WarpText from "../common/WarpText";
import CollegeLogo, { KortexLogo } from "../common/CollegeLogo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("kortex-theme", "dark");
  }, []);

  return (
    <div className="relative grid min-h-screen overflow-hidden bg-[#080808] text-[#f5f5f3] lg:grid-cols-[1.05fr_.95fr]">
      {/* Background shader */}
      <MoltenMetal
        color1="#5227FF"
        color2="#FF9FFC"
        color3="#FFFFFF"
        speed={0.35}
        scale={4}
        detail={3}
        glow={1.6}
        coreSize={0.1}
        swirl={1}
        fold={-0.2}
        blackPoint={0.05}
        brightness={1.3}
        grain
        grainIntensity={0.05}
        mouseInteraction
        mouseStrength={0.3}
        opacity={0.72}
        backgroundColor="#080808"
        className="fixed"
      />

      {/* LEFT PANEL: Clean Futuristic Identity Section */}
      <div className="auth-brand-panel relative z-10 hidden border-r border-[#242424] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        {/* Top Header: Left Branding & Right College Logo (Marked Area) */}
        <div className="flex items-center justify-between">
          {/* Top-Left Branding */}
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f5f3] font-black text-[#080808] text-sm shadow-md">
              K
            </span>
            <span className="text-lg font-bold tracking-tight text-[#f5f5f3]">Kortex</span>
          </div>

          {/* Top-Right: College Logo (Marked Area) */}
          <div className="flex items-center">
            <CollegeLogo height={34} />
          </div>
        </div>

        {/* Vertically Centered Identity Lockup: Main Circular Logo -> AI&DS BRANCH -> KORTEX */}
        <div className="my-auto flex flex-col items-center justify-center text-center px-4">
          {/* 1. Official Main Circular Logo Asset */}
          <div className="mb-8 flex justify-center">
            <KortexLogo size={128} />
          </div>

          {/* 2. Department Identity Label */}
          <div className="mb-4">
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-[#ff9d4d]">
              AI&amp;DS Branch
            </span>
          </div>

          {/* 3. KORTEX Wordmark with React Bits WarpText */}
          <div className="w-full max-w-lg">
            <WarpText
              text="KORTEX"
              color="#f8f5ff"
              warpStrength={0.02}
              warpScale={1.7}
              speed={0.35}
              pointerInfluence={0.35}
              pointerStrength={0.2}
              refraction={0.008}
              ripple={false}
              fontSize="clamp(3.5rem, 7vw, 6rem)"
              fontWeight={800}
              letterSpacing="-0.05em"
              lineHeight={0.9}
              style={{ height: "150px" }}
            />
          </div>
        </div>

        {/* Bottom Footer Tag */}
        <p className="text-xs text-[#70706b]">Secure campus access · Kortex</p>
      </div>

      {/* RIGHT PANEL: Left Completely Untouched */}
      <div className="relative z-10 flex items-center justify-center p-6 sm:p-10">{children}</div>
    </div>
  );
}