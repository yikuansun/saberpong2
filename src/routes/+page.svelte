<script>
    import blankSound from "$lib/assets/sounds/nothing.mp3";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    let autoplayAllowed = true;

    onMount(() => {
        let aud = new Audio(blankSound);
        aud.addEventListener("canplaythrough", () => {
            aud.play().then(() => {
                // media autoplay allowed
                goto("./menu");
            }).catch((e) => {
                // media autoplay not allowed, need user interaction
                console.log(e.message);
                autoplayAllowed = false;
            });
        });
    });
</script>

{#if !autoplayAllowed}
    <div style:width="100vw" style:height="100vh"
        style:position="fixed" style:top="0" style:left="0"
        style:background-color="lightgrey"></div>
    <button style:position="fixed"
        style:left="50vw" style:top="50vh"
        style:transform="translate(-50%, -50%)"
        on:click={() => { goto("./menu"); }}
        style:padding="14px 24px" style:font-size="24px">
        Run Game
    </button>
{:else}
    <div style:width="100vw" style:height="100vh"
        style:position="fixed" style:top="0" style:left="0"
        style:background-color="black"></div>
{/if}