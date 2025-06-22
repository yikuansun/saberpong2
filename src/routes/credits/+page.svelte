<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    import logo from "$lib/assets/images/logo.jpg";
    import ExpletusSansTtf from "$lib/assets/fonts/ExpletusSans-VariableFont_wght.ttf";
    import Exo2Ttf from "$lib/assets/fonts/Exo2-VariableFont_wght.ttf";
    import bgVideo from "$lib/assets/videos/homescreenLoop.mp4";
    import music from "$lib/assets/music/lady on the track 132.mp3";

    let curtainVisible = true;
    let screenFadeDuration = 500;

    /**
     * Go to a page & use fade-out effect
     * @param {string} endpt path to go to
     */
    function gotoCool(endpt) {
        curtainVisible = true;
        setTimeout(() => { goto(endpt); }, screenFadeDuration + 10);
    }

    onMount(() => {
        setTimeout(() => { curtainVisible = false; }, 10);
    });
</script>

<table style:position="absolute" style:top="0" style:left="0" style:width="1920px" style:height="1080px"
    style:color="white" style:font-size="24px" style:font-family="Exo2" style:user-select="none">
    <tr>
        <td colspan="2" style:text-align="center" style:font-size="50px"
            style:font-family="ExpletusSans" style:font-variant="small-caps" style:letter-spacing="7px"
            style:text-shadow="0 0 20px white, 0 0 40px white, 0 0 80px white" style:font-weight="bold">
            Credits
        </td>
    </tr>
    <tr>
        <td style:text-align="center" style:width="50%">
            <b style:font-family="ExpletusSans" style:font-variant="small-caps" style:letter-spacing="7px" style:font-size="32px" style:text-shadow="0 0 20px white, 0 0 40px white, 0 0 80px white">
                Development
            </b>
            <br /> <br />
            Developed by Yikuan Sun, purely using Svelte.
            <br /> (I guess Supermaven helped a bit as well.)
            <br /> <br />
            More projects by Yikuan can be found at
            <span style:user-select="text" style:color="deepskyblue">yikuansun.github.io</span>.
            <br /> <br />
            The Pong paddle bounce algorithm was provided by
            <span style:user-select="text">Ricket</span>
            on the GameDev StackExchange.
        </td>
        <td style:text-align="center" style:width="50%">
            <b style:font-family="ExpletusSans" style:font-variant="small-caps" style:letter-spacing="7px" style:font-size="32px" style:text-shadow="0 0 20px white, 0 0 40px white, 0 0 80px white">
                Music
            </b>
            <br /> <br />
            The soundtrack was composed by Moby, and is licensed under the mobygratis License.
            <br /> <br />
            The following tracks are used in the game: <br />
            Main Menu - <i>lady on the track</i> by Moby <br />
            Setup Screen - <i>argon</i> Moby <br />
            Victory Theme - <i>dream a dream</i> Moby <br />
            <br /> <br />
            Kevin Ji composed a song for this game as well but I didn't end up using it {":("} <br /> sorry Kevin.
        </td>
    </tr>
    <tr>
        <td style:text-align="center">
            <b style:font-family="ExpletusSans" style:font-variant="small-caps" style:letter-spacing="7px" style:font-size="32px" style:text-shadow="0 0 20px white, 0 0 40px white, 0 0 80px white">
                Sound Effects
            </b>
            <br /> <br />
            The following sound effects were used in the game: <br />
            Lightsaber Hum - <i>Lightsaber Idle Loop</i> by Sound Library on YouTube <br />
            Laser Deflect - <i>All Lightsaber Deflect Sounds</i> by Sound Library on YouTube <br />
            Laser Shot - <i>Star Wars Blaster Shot</i> by Sound Library on YouTube <br />
            <br /> <br />
            All other sound effects were created by Yikuan Sun, using ChipTone
            <span style:user-select="text" style:color="deepskyblue">sfbgames.itch.io/chiptone</span>.
        </td>
        <td style:text-align="center">
            <b style:font-family="ExpletusSans" style:font-variant="small-caps" style:letter-spacing="7px" style:font-size="32px" style:text-shadow="0 0 20px white, 0 0 40px white, 0 0 80px white">
                Fonts
            </b>
            <br /> <br />
            Fonts used (ExpletusSans and Exo2) were downloaded from Google Fonts
            and used under the SIL Open Font License.
        </td>
    </tr>
    <tr>
        <td colspan="2" style:text-align="center">
            <button on:click={() => {
                gotoCool("../menu");
            }}>Return to Menu</button>
        </td>
    </tr>
</table>

{#if curtainVisible}
    <div style:position="absolute" style:left="0px" style:top="0px" style:width="1920px" style:height="1080px"
        style:background-color="black" transition:fade={{ duration: screenFadeDuration, }}></div>
{/if}

<audio autoplay loop on:timeupdate={(e) => {
    if (e.target) {
        let buffer = 0.44;
        if (e.target.currentTime > e.target.duration - buffer) {
            e.target.currentTime = 0;
            e.target.play();
        }
    }
}}>
    <source src={music} type="audio/mpeg">
</audio>

<style>
    button {
        /*border: 5px solid white;
        border-radius: 5px;*/
        border: 0;
        background-color: transparent;
        color: white;
        text-shadow: 0 0 10px white, 0 0 20px white, 0 0 40px white;
        /*box-shadow: 0 0 4px white, 0 0 14px white, inset 0 0 4px white, inset 0 0 14px white;*/
        transition: text-shadow 0.3s, box-shadow 0.3s, color 0.3s;
        font-size: 36px;
        padding: 10px 20px;
        font-family: "Exo2", sans-serif;
    }

    button:hover {
        --glow-color: hsl(200deg, 100%, 70%);
        text-shadow: 0 0 15px var(--glow-color), 0 0 30px var(--glow-color), 0 0 60px var(--glow-color), 0 0 120px var(--glow-color);
        color: hsl(200deg, 100%, 88%);
        /*box-shadow: 0 0 10px var(--glow-color), 0 0 20px var(--glow-color), inset 0 0 10px var(--glow-color), inset 0 0 20px var(--glow-color);*/
        cursor: pointer;
    }

    @font-face {
        font-family: "ExpletusSans";
        src: url("$lib/assets/fonts/ExpletusSans-VariableFont_wght.ttf");
    }

    @font-face {
        font-family: "Exo2";
        src: url("$lib/assets/fonts/Exo2-VariableFont_wght.ttf");
    }
</style>

<svelte:head>
    <link rel="preload" as="font" href={ExpletusSansTtf} type="font/ttf" crossorigin="anonymous" />
    <link rel="preload" as="font" href={Exo2Ttf} type="font/ttf" crossorigin="anonymous" />
</svelte:head>