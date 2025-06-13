<script>
    import { onMount } from "svelte";
    import fireworkSound from "$lib/assets/sounds/firework.wav";

    export let emitterX = 960;
    export let emitterY = 540;
    export let particleRadius = 5;
    export let particleLifespan = 700;
    export let particlesCount = 100;
    export let maxParticleSpeed = 500;
    export let particleColor = "hsl(0deg, 100%, 60%)";

    /** @typedef {{
     *  x: number,
     *  y: number,
     *  radius: number,
     *  color: string,
     *  lifespan: number,
     *  speed: number,
     *  angle: number,
     *  opacity: number,
     *  hueShift: number,
     * }} Particle */

    /** @type {Particle[]} */
    let particles = [];

    for (let i = 0; i < particlesCount; i++) {
        /** @type {Particle} */
        let particle = {
            x: emitterX,
            y: emitterY,
            radius: particleRadius,
            color: particleColor,
            lifespan: particleLifespan,
            speed: Math.random() * maxParticleSpeed,
            angle: Math.random() * Math.PI * 2,
            opacity: 1,
            hueShift: (Math.random() - 0.5) * 30,
        };
        particles = [...particles, particle];
    }

    let fadingSpeed = 1 / (particleLifespan / 1000);

    let lastTime = (new Date()).getTime();
    let firstStartTime = (new Date()).getTime();
    function animate() {
        let startTime = (new Date()).getTime();
        let deltaTime = (startTime - lastTime) / 1000;
        lastTime = startTime;

        for (let i = 0; i < particles.length; i++) {
            let particle = particles[i];
            particle.x += particle.speed * deltaTime * Math.cos(particle.angle);
            particle.y += particle.speed * deltaTime * Math.sin(particle.angle);
            
            particle.opacity -= fadingSpeed * deltaTime;
        }
        particles = particles.filter((p) => p.opacity > 0);

        if (lastTime - firstStartTime <= particleLifespan) {
            requestAnimationFrame(animate);
        }
    }

    onMount(() => {
        lastTime = (new Date()).getTime();
        firstStartTime = (new Date()).getTime();
        requestAnimationFrame(animate);
    });

</script>

{#each particles as particle}
    <div style:position="absolute" style:top="{particle.y}px" style:left="{particle.x}px" style:transform="translate(-50%, -50%)"
        style:width="{particle.radius * 2}px" style:height="{particle.radius * 2}px" style:border-radius="{particle.radius}px"
        style:background-color={particle.color} style:opacity={particle.opacity} style:filter="hue-rotate({particle.hueShift}deg) blur({particle.radius}px)"
        style:mix-blend-mode="screen"></div>
{/each}

<audio autoplay>
    <source src={fireworkSound} type="audio/wav" />
</audio>