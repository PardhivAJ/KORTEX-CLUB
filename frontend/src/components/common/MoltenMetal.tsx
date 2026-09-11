import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";
import "./MoltenMetal.css";

type ColorMode = "molten" | "ember" | "frost";
type MoltenMetalProps = {
  color1?: string;
  color2?: string;
  color3?: string;
  speed?: number;
  scale?: number;
  detail?: number;
  glow?: number;
  coreSize?: number;
  swirl?: number;
  fold?: number;
  blackPoint?: number;
  brightness?: number;
  colorMode?: ColorMode;
  grain?: boolean;
  grainIntensity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  opacity?: number;
  backgroundColor?: string;
  lightMode?: boolean;
  className?: string;
};

const vertex = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime, uSpeed, uScale, uDetail, uGlow, uCoreSize, uSwirl, uFold, uBlackPoint, uBrightness, uColorMode, uGrain, uGrainIntensity, uOpacity;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform bool uEnableMouse;
uniform vec3 uColor1, uColor2, uColor3, uBackgroundColor;
uniform bool uLightMode;
out vec4 fragColor;
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main() {
  float time = iTime * uSpeed;
  vec2 p = uScale * ((gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y) - 0.5;
  if (uEnableMouse) p += (uMouse - 0.5) * uMouseStrength * 2.0;
  vec2 i = p; float c = 0.0;
  float r = length(p + vec2(sin(time), sin(time * 0.3 + 5.0)) * 0.5);
  float d = length(p); float rot = d + time + p.x * uSwirl;
  float cosRot = cos(rot); mat2 warp = mat2(cos(rot - sin(time / 5.0)), sin(rot), -sin(cosRot - time), cosRot) * uFold;
  float glowCore = uGlow * uCoreSize;
  for (float n = 0.0; n < 8.0; n++) { if (n >= uDetail) break; p *= warp; float t = r - time / (n + 3.0); i -= p + vec2(cos(t - i.x - r) + sin(t + i.y), sin(t - i.y) + cos(t + i.x) + r); c += glowCore / length(vec2(sin(i.x + t), cos(i.y + t))); }
  c /= 6.0; float intensity = max(c - uBlackPoint, 0.0) * uBrightness; float g = clamp(intensity, 0.0, 1.0);
  float mid = uColorMode > 1.5 ? 0.65 : uColorMode > 0.5 ? 0.35 : 0.5;
  vec3 col = mix(uColor1, uColor2, smoothstep(0.0, mid, g)); col = mix(col, uColor3, smoothstep(mid, 1.0, g));
  float a = g; if (uGrain > 0.5) a += (hash(gl_FragCoord.xy + iTime) - 0.5) * uGrainIntensity; a = clamp(a, 0.0, 1.0) * uOpacity;
  if (uLightMode) { float signal = 1.0 - exp(-max(c, 0.0) * 6.5); float body = smoothstep(0.075, 0.68, signal); vec3 lightCol = mix(uColor1, uColor2, smoothstep(0.08, 0.52, signal)); lightCol = mix(lightCol, uColor3, smoothstep(0.52, 0.96, signal)); float coverage = body * mix(0.2, 0.86, signal) * uOpacity; fragColor = vec4(mix(uBackgroundColor, lightCol, clamp(coverage, 0.0, 0.92)), 1.0); } else fragColor = vec4(col * a, a);
}`;

const hexToRgb = (hex: string) => {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return match ? [1, 2, 3].map((index) => parseInt(match[index], 16) / 255) : [1, 1, 1];
};
const modeValue = (mode: ColorMode) => mode === "ember" ? 1 : mode === "frost" ? 2 : 0;

type Context = { renderer: Renderer; program: Program; mesh: Mesh };
const contexts = new WeakMap<HTMLElement, Context>();

export default function MoltenMetal({
  color1 = "#07152b", color2 = "#087ea4", color3 = "#ffb347", speed = 0.2, scale = 4,
  detail = 3, glow = 1.35, coreSize = 0.08, swirl = 1, fold = -0.2, blackPoint = 0.05,
  brightness = 1.35, colorMode = "molten", grain = true, grainIntensity = 0.035,
  mouseInteraction = true, mouseStrength = 0.2, opacity = 0.48, backgroundColor = "#f5f4f1",
  lightMode = false, className = ""
}: MoltenMetalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const renderer = new Renderer({ webgl: 2, alpha: true, antialias: false, dpr: Math.min(window.devicePixelRatio || 1, 2) });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = "100%"; canvas.style.height = "100%"; canvas.style.display = "block";
    container.appendChild(canvas);
    const geometry = new Triangle(gl);
    const program = new Program(gl, { vertex, fragment, uniforms: {
      iTime: { value: 0 }, iResolution: { value: new Float32Array([1, 1]) }, uSpeed: { value: speed }, uScale: { value: scale }, uDetail: { value: detail }, uGlow: { value: glow }, uCoreSize: { value: coreSize }, uSwirl: { value: swirl }, uFold: { value: fold }, uBlackPoint: { value: blackPoint }, uBrightness: { value: brightness }, uColorMode: { value: modeValue(colorMode) }, uGrain: { value: grain ? 1 : 0 }, uGrainIntensity: { value: grainIntensity }, uOpacity: { value: opacity }, uMouse: { value: new Float32Array([0.5, 0.5]) }, uMouseStrength: { value: mouseStrength }, uEnableMouse: { value: mouseInteraction }, uColor1: { value: new Float32Array(hexToRgb(color1)) }, uColor2: { value: new Float32Array(hexToRgb(color2)) }, uColor3: { value: new Float32Array(hexToRgb(color3)) }, uBackgroundColor: { value: new Float32Array(hexToRgb(backgroundColor)) }, uLightMode: { value: lightMode }
    }});
    const mesh = new Mesh(gl, { geometry, program }); contexts.set(container, { renderer, program, mesh });
    const resize = () => { const rect = container.getBoundingClientRect(); renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height)); const resolution = program.uniforms.iResolution.value as Float32Array; resolution[0] = gl.drawingBufferWidth; resolution[1] = gl.drawingBufferHeight; };
    const observer = new ResizeObserver(resize); observer.observe(container); resize();
    const mouse = new Float32Array([0.5, 0.5]); const target = new Float32Array([0.5, 0.5]);
    const move = (event: MouseEvent) => { const rect = canvas.getBoundingClientRect(); target[0] = (event.clientX - rect.left) / rect.width; target[1] = 1 - (event.clientY - rect.top) / rect.height; };
    const leave = () => { target[0] = 0.5; target[1] = 0.5; };
    canvas.addEventListener("mousemove", move); canvas.addEventListener("mouseleave", leave);
    let frame = 0; const start = performance.now();
    const loop = (time: number) => { program.uniforms.iTime.value = (time - start) * 0.001; mouse[0] += (target[0] - mouse[0]) * 0.05; mouse[1] += (target[1] - mouse[1]) * 0.05; (program.uniforms.uMouse.value as Float32Array).set(mouse); renderer.render({ scene: mesh }); frame = requestAnimationFrame(loop); };
    frame = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); canvas.removeEventListener("mousemove", move); canvas.removeEventListener("mouseleave", leave); contexts.delete(container); if (canvas.parentNode === container) container.removeChild(canvas); gl.getExtension("WEBGL_lose_context")?.loseContext(); };
  }, []);

  useEffect(() => {
    const context = containerRef.current && contexts.get(containerRef.current); if (!context) return;
    const uniforms = context.program.uniforms;
    uniforms.uSpeed.value = speed; uniforms.uScale.value = scale; uniforms.uDetail.value = detail; uniforms.uGlow.value = glow; uniforms.uCoreSize.value = coreSize; uniforms.uSwirl.value = swirl; uniforms.uFold.value = fold; uniforms.uBlackPoint.value = blackPoint; uniforms.uBrightness.value = brightness; uniforms.uColorMode.value = modeValue(colorMode); uniforms.uGrain.value = grain ? 1 : 0; uniforms.uGrainIntensity.value = grainIntensity; uniforms.uOpacity.value = opacity; uniforms.uMouseStrength.value = mouseStrength; uniforms.uEnableMouse.value = mouseInteraction; uniforms.uLightMode.value = lightMode;
    [color1, color2, color3, backgroundColor].forEach((color, index) => { const value = hexToRgb(color); const target = [uniforms.uColor1.value, uniforms.uColor2.value, uniforms.uColor3.value, uniforms.uBackgroundColor.value][index] as Float32Array; target.set(value); });
  }, [color1, color2, color3, speed, scale, detail, glow, coreSize, swirl, fold, blackPoint, brightness, colorMode, grain, grainIntensity, mouseInteraction, mouseStrength, opacity, backgroundColor, lightMode]);

  return <div ref={containerRef} className={`molten-metal-container ${className}`.trim()} aria-hidden="true" />;
}
