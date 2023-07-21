import * as THREE from 'three';
import React, { useRef } from 'react';
import { extend, useFrame, useLoader, useThree } from '@react-three/fiber';

// GLSL shader code
const fragmentShader = `
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

const int iterations = 17;
const float formuparam = 0.51;
const int volsteps = 20;
const float stepsize = 0.1;
const float zoom = 1.000;
const float tile = 0.4;
const float speed = -0.00025;
const float brightness = 0.0025;
const float darkmatter = 0.6;
const float distfading = 0.8;
const float saturation = 0.9;

float SCurve(float value) {
    return value < 0.5 ? value * value * value * value * value * 16.0 : (value - 1.0) * (value - 1.0) * (value - 1.0) * (value - 1.0) * (value - 1.0) * 16.0 + 1.0;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    float a1 = (0.5 + iMouse.x / iResolution.x * 2.0) / 500.0;
    float a2 = (0.8 - iMouse.y / iResolution.y * 2.0) / 500.0;
    mat2 rot1 = mat2(cos(a1), sin(a1), -sin(a1), cos(a1));
    mat2 rot2 = mat2(cos(a2), sin(a2), -sin(a2), cos(a2));

    vec2 uv = fragCoord.xy / iResolution.xy - 0.5;
    uv.y *= iResolution.y / iResolution.x;

    vec3 dir = vec3(uv * zoom, 1.0);
    dir.xz *= rot1;
    dir.xy *= rot2;
    vec3 from = vec3(1.0, 0.5, 0.5);
    float time = iTime * speed + 0.25;
    from += vec3(time * 2.0, time, -2.0);
    from.xz *= rot1;
    from.xy *= rot2;

    float s = 0.1;
    float fade = 1.0;
    vec3 v = vec3(0.0);
    for (int r = 0; r < volsteps; r++) {
        vec3 p = from + s * dir * 0.25;
        p = abs(vec3(tile) - mod(p, vec3(tile * 2.0)));
        float pa;
        float a = pa = 0.0;
        for (int i = 0; i < iterations; i++) { 
            p = abs(p) / dot(p, p) - formuparam;
            a += abs(length(p) - pa);
            pa = length(p);
        }
        float dm = max(0.0, darkmatter - a * a * 0.001);
        a = pow(a, 2.5);
        if (r > 6) fade *= 1.0 - dm;
        v += fade;
        v += vec3(s, s * s, s * s * s * s) * a * brightness * fade;
        fade *= distfading;
        s += stepsize;
    }

    v = mix(vec3(length(v)), v, saturation);
    vec4 C = vec4(v * 0.01, 1.0);
    C.rgb = pow(C.rgb, vec3(0.40, 0.39, 0.36));
    vec4 L = C;

    C.rgb = mix(L.rgb, vec3(SCurve(C.r), SCurve(C.g) * 0.9, SCurve(C.b) * 0.6), 1.0);
    fragColor = C;
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

const uniforms = {
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector2() },
    iMouse: { value: new THREE.Vector2() },
};

class VolumetricMaterial extends THREE.ShaderMaterial {
    constructor() {
        super({
            uniforms,
            fragmentShader,
        });
    }
}

extend({ VolumetricMaterial });

const VolumetricShader = () => {
    const materialRef = useRef<THREE.ShaderMaterial>();
    const { size, viewport } = useThree();
    const aspect = size.width / viewport.width;

    // Add state to store the smoothed mouse position
    const [smoothedMouse, setSmoothedMouse] = React.useState(new THREE.Vector2());

    // Update the mouse position uniform based on the mouse move event
    const handleMouseMove = React.useCallback(
        (event: MouseEvent) => {
            const { clientX, clientY } = event;

            // Calculate the target mouse position
            const targetMouse = new THREE.Vector2(clientX, clientY);
            const targetMouseX = targetMouse.x / viewport.width;
            const targetMouseY = targetMouse.y / viewport.height;

            // Calculate the smoothed mouse position with some easing
            const smoothingFactor = 0.1; // Adjust this value to control the smoothness (0.0 - 1.0)
            const deltaX = targetMouseX - smoothedMouse.x;
            const deltaY = targetMouseY - smoothedMouse.y;
            const smoothedMouseX = smoothedMouse.x + deltaX * smoothingFactor;
            const smoothedMouseY = smoothedMouse.y + deltaY * smoothingFactor;

            // Update the smoothed mouse position
            setSmoothedMouse(new THREE.Vector2(smoothedMouseX, smoothedMouseY));

            // Set the uniform to the smoothed mouse position
            uniforms.iMouse.value.set(smoothedMouseX, smoothedMouseY);
        },
        [viewport.width, viewport.height, smoothedMouse]
    );

    React.useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);

    useFrame(({ clock }) => {
        if (materialRef.current) {
            const material = materialRef.current;
            material.uniforms.iTime.value = clock.getElapsedTime();
            material.uniforms.iResolution.value.set(viewport.width * aspect, viewport.height * aspect);
        }
    });

    return (
        <mesh scale={[viewport.width * aspect, viewport.height * aspect, 1]}>
            <planeGeometry args={[1, 1]} />
            <primitive object={new VolumetricMaterial()} ref={materialRef} attach="material" />
        </mesh>
    );
};

export default VolumetricShader;