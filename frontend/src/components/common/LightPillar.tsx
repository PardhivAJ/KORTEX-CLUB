import { useEffect, useRef, type CSSProperties } from "react";
import * as THREE from "three";
import "./LightPillar.css";

type Props = { topColor?: string; bottomColor?: string; intensity?: number; rotationSpeed?: number; interactive?: boolean; className?: string; glowAmount?: number; pillarWidth?: number; pillarHeight?: number; noiseIntensity?: number; mixBlendMode?: CSSProperties["mixBlendMode"]; pillarRotation?: number; quality?: "low" | "medium" | "high"; lightMode?: boolean };

export default function LightPillar({ topColor = "#5227FF", bottomColor = "#FF9FFC", intensity = 1, rotationSpeed = 0.3, interactive = false, className = "", mixBlendMode = "screen", lightMode = false }: Props) {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const container = ref.current; if (!container) return;
		const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
		renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5)); container.appendChild(renderer.domElement);
		const scene = new THREE.Scene(); const camera = new THREE.Camera(); const mouse = new THREE.Vector2();
		const material = new THREE.ShaderMaterial({ transparent: true, uniforms: { uTime: { value: 0 }, uResolution: { value: new THREE.Vector2() }, uMouse: { value: mouse }, uTop: { value: new THREE.Color(topColor) }, uBottom: { value: new THREE.Color(bottomColor) }, uIntensity: { value: intensity }, uLight: { value: lightMode ? 1 : 0 } }, vertexShader: "varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position,1.0);}", fragmentShader: "precision mediump float; uniform float uTime,uIntensity,uLight; uniform vec2 uResolution,uMouse; uniform vec3 uTop,uBottom; varying vec2 vUv; void main(){vec2 p=(vUv*2.0-1.0)*vec2(uResolution.x/uResolution.y,1.0); p.x-=uMouse.x*.06; float wave=sin(p.y*6.0+uTime)*.12+sin(p.y*13.0-uTime*1.4)*.05; float core=smoothstep(.2,0.,abs(p.x+wave)); float glow=smoothstep(.8,0.,abs(p.x+wave))*.22; vec3 color=mix(uBottom,uTop,vUv.y); float amount=clamp((core+glow)*uIntensity,0.,1.); if(uLight>.5) color=mix(vec3(1.),color,.72); gl_FragColor=vec4(color,amount);}" });
		const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material); scene.add(mesh);
		const resize = () => { const width = Math.max(1, container.clientWidth); const height = Math.max(1, container.clientHeight); renderer.setSize(width, height); material.uniforms.uResolution.value.set(width, height); }; const observer = new ResizeObserver(resize); observer.observe(container); resize();
		const move = (event: MouseEvent) => { if (!interactive) return; const rect = container.getBoundingClientRect(); mouse.x = (event.clientX - rect.left) / rect.width * 2 - 1; }; if (interactive) container.addEventListener("mousemove", move);
		let frame = 0; const animate = (time: number) => { material.uniforms.uTime.value = time * .001 * rotationSpeed; mesh.rotation.z = Math.sin(time * .0004 * rotationSpeed) * .08; renderer.render(scene, camera); frame = requestAnimationFrame(animate); }; frame = requestAnimationFrame(animate);
		return () => { cancelAnimationFrame(frame); observer.disconnect(); if (interactive) container.removeEventListener("mousemove", move); mesh.geometry.dispose(); material.dispose(); renderer.dispose(); renderer.domElement.remove(); };
	}, [bottomColor, intensity, interactive, lightMode, rotationSpeed, topColor]);
	return <div ref={ref} className={`light-pillar-container ${className}`.trim()} style={{ mixBlendMode }} aria-hidden="true" />;
}
