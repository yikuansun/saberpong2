<script>
    import Firework from "$lib/components/Firework.svelte";
    import { onMount } from "svelte";

    export let fireworkSettings = {
        particleRadius: 5,
        particleLifespan: 700,
        particlesCount: 100,
        maxParticleSpeed: 500,
        particleColor: "hsl(0deg, 100%, 60%)",
    };

    export let interval = 1500;
    export let duration = 10000;

    /** @type {Object[]} */
    let fireworks = [];

    onMount(() => {
        let intervalId = setInterval(() => {
            let cop = Object.assign({}, fireworkSettings);
            cop.emitterX = Math.random() * 1920;
            cop.emitterY = Math.random() * 1080;
            fireworks = [...fireworks, cop];
        }, interval);

        setTimeout(() => {
            clearInterval(intervalId);
        }, duration);
    });
</script>

{#each fireworks as firework}
    <Firework {...firework} />
{/each}