<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    import ExpletusSansTtf from "$lib/assets/fonts/ExpletusSans-VariableFont_wght.ttf";
    import Exo2Ttf from "$lib/assets/fonts/Exo2-VariableFont_wght.ttf";
    import music from "$lib/assets/music/argon inst mix ab oz.mp3";
    import ColorSelect from "$lib/components/ColorSelect.svelte";

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

    let params = {
        P1_COLOR: "hsl(204deg, 100%, 54%)",
        P2_COLOR: "hsl(0deg, 100%, 60%)",
        BALL_COLOR: "hsl(100deg, 100%, 50%)",
        BALL_SPEED: 842,
        MAX_LIVES: 3,
        P1_NAME: "Player 1",
        P2_NAME: "Player 2",
        P1_UP_KEY: "w",
        P1_DOWN_KEY: "s",
        P2_UP_KEY: "ArrowUp",
        P2_DOWN_KEY: "ArrowDown",
        MOBILE_CONTROLS: false,
        AI_LEVEL: 1,
    };

    let p1ControlScheme = "w/s";
    let p2ControlScheme = "ArrowUp/ArrowDown";

    let availLaserColors = [
        {
            color: "hsl(100deg, 100%, 50%)",
            locked: false,
            unlockMessage: "",
        },
        {
            color: "hsl(5deg, 100%, 64%)",
            locked: true,
            unlockMessage: "Unlock by beating the Normal CPU in a 5-point game.",
        },
        {
            color: "hsl(210deg, 100%, 64%)",
            locked: true,
            unlockMessage: "Unlock by beating the Advanced CPU in a 5-point game.",
        },
        {
            color: "hsl(30deg, 100%, 54%)",
            locked: true,
            unlockMessage: "Unlock by beating the Expert CPU in a 5-point game.",
        },
    ];

    let availSaberColors = [
        {
            color: "hsl(204deg, 100%, 54%)",
            locked: false,
            unlockMessage: "",
        },
        {
            color: "hsl(0deg, 100%, 60%)",
            locked: false,
            unlockMessage: "",
        },
        {
            color: "hsl(100deg, 100%, 50%)",
            locked: true,
            unlockMessage: "Unlock by beating the Normal CPU in an 11-point game.",
        },
        {
            color: "hsl(289deg, 100%, 50%)",
            locked: true,
            unlockMessage: "Unlock by beating the Expert CPU in an 8-point game.",
        },
        {
            color: "hsl(30deg, 100%, 54%)",
            locked: true,
            unlockMessage: "Unlock by beating the Expert CPU in an 11-point game.",
        },
    ];

    onMount(() => {
        if (window.localStorage.getItem("RED_LASER_UNLOCKED") == "yes") {
            availLaserColors[1].locked = false;
        }
        if (window.localStorage.getItem("BLUE_LASER_UNLOCKED") == "yes") {
            availLaserColors[2].locked = false;
        }
        if (window.localStorage.getItem("ORANGE_LASER_UNLOCKED") == "yes") {
            availLaserColors[3].locked = false;
        }
        if (window.localStorage.getItem("GREEN_SABER_UNLOCKED") == "yes") {
            availSaberColors[2].locked = false;
        }
        if (window.localStorage.getItem("PURPLE_SABER_UNLOCKED") == "yes") {
            availSaberColors[3].locked = false;
        }
        if (window.localStorage.getItem("ORANGE_SABER_UNLOCKED") == "yes") {
            availSaberColors[4].locked = false;
        }

        if (window.localStorage.getItem("PVP_DEFAULT_PARAMS")) {
            let pvpDefaultParams = JSON.parse(window.localStorage.getItem("PVP_DEFAULT_PARAMS"));
            for (let [key, value] of Object.entries(pvpDefaultParams)) {
                params[key] = value;
            }
            p1ControlScheme = pvpDefaultParams.P1_UP_KEY + "/" + pvpDefaultParams.P1_DOWN_KEY;
            p2ControlScheme = pvpDefaultParams.P2_UP_KEY + "/" + pvpDefaultParams.P2_DOWN_KEY;
        }

        setTimeout(() => { curtainVisible = false; }, 10);
    });
</script>

<table style:position="absolute" style:top="0" style:left="0" style:width="1920px" style:height="1080px"
    style:color="white" style:font-size="24px" style:font-family="Exo2" style:user-select="none">
    <tr>
        <td colspan="2" style:text-align="center" style:font-size="24px">
            <button on:click={() => {
                window.localStorage.setItem("PVP_DEFAULT_PARAMS", JSON.stringify(params));
                gotoCool("../menu");
            }} style:font-size="24px">Return to Menu</button>
            <br /> <br />
            <b style:font-family="ExpletusSans" style:font-variant="small-caps" style:letter-spacing="7px" style:font-size="32px" style:text-shadow="0 0 20px white, 0 0 40px white, 0 0 80px white">New Game (Player vs. Player)</b>
        </td>
    </tr>
    <tr>
        <td colspan="2" style:text-align="center">
            <p style:display="inline-block" style:margin="0" style:text-align="left" style:width="400px">
                <label>
                    Laser Color: <br />
                    <input type="hidden" bind:value={params.BALL_COLOR} />
                    <ColorSelect bind:value={params.BALL_COLOR} availColors={availLaserColors} />
                </label> <br />
                <label>
                    Laser Speed: <br />
                    <select bind:value={params.BALL_SPEED} style:width="400px">
                        <option value={700}>Slow</option>
                        <option value={842}>Normal</option>
                        <option value={1111}>Fast</option>
                    </select> <br />
                </label> <br />
                <label>
                    Starting Lives: <br />
                    <input type="number" bind:value={params.MAX_LIVES} min={3} max={11} style:width="400px" style:text-align="center" />
                </label>
            </p>
        </td>
    </tr>
    <tr>
        <td style:text-align="center" style:width="50%">
            <b style:font-family="ExpletusSans" style:font-variant="small-caps" style:letter-spacing="7px" style:font-size="32px" style:text-shadow="0 0 20px white, 0 0 40px white, 0 0 80px white">Player 1</b>
            <br /> <br />
            <p style:display="inline-block" style:margin="0" style:text-align="left" style:width="414px">
                <label>
                    Color: <br />
                    <input type="hidden" bind:value={params.P1_COLOR} />
                    <ColorSelect bind:value={params.P1_COLOR} availColors={availSaberColors} />
                </label> <br />
                <label>
                    Nickname: <br />
                    <input type="text" bind:value={params.P1_NAME} style:width="414px" /> <br />
                </label> <br />
                <label>
                    Control Scheme: <br />
                    <select on:input={(e) => {
                        let [ upKey, downKey ] = e.target.value.split("/");
                        params.P1_UP_KEY = upKey;
                        params.P1_DOWN_KEY = downKey;
                    }} style:width="414px" bind:value={p1ControlScheme}>
                        <option value="w/s">W/S</option>
                    </select>
                </label>
            </p>
        </td>
        <td style:text-align="center" style:width="50%">
            <b style:font-family="ExpletusSans" style:font-variant="small-caps" style:letter-spacing="7px" style:font-size="32px" style:text-shadow="0 0 20px white, 0 0 40px white, 0 0 80px white">Player 2</b>
            <br /> <br />
            <p style:display="inline-block" style:margin="0" style:text-align="left" style:width="414px">
                <label>
                    Color: <br />
                    <input type="hidden" bind:value={params.P2_COLOR} />
                    <ColorSelect bind:value={params.P2_COLOR} availColors={availSaberColors} />
                </label> <br />
                <label>
                    Nickname: <br />
                    <input type="text" bind:value={params.P2_NAME} style:width="414px" /> <br />
                </label> <br />
                <label>
                    Control Scheme: <br />
                    <select on:input={(e) => {
                        let [ upKey, downKey ] = e.target.value.split("/");
                        params.P2_UP_KEY = upKey;
                        params.P2_DOWN_KEY = downKey;
                    }} style:width="414px" bind:value={p2ControlScheme}>
                        <option value="ArrowUp/ArrowDown">Arrow Keys</option>
                        <option value="i/k">I/K</option>
                        <option value="PONG_AI/PONG_AI" hidden>ai lmao</option>
                    </select>
                </label>
            </p>
        </td>
    </tr>
    <tr>
        <td colspan="2" style:text-align="center">
            <button on:click={() => {
                window.localStorage.setItem("PVP_DEFAULT_PARAMS", JSON.stringify(params));

                let searchParams = new URLSearchParams();
                for (let [key, value] of Object.entries(params)) {
                    searchParams.set(key, value);
                }
                gotoCool(`../arena?${searchParams.toString()}`);
            }}>Start Game</button>
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

    select, input[type=number], input[type=text] {
        font-family: "Exo2", sans-serif;
        font-size: inherit;
        padding: 5px 15px;
        box-sizing: border-box;
        color: white;
        border: 2px solid white;
        border-radius: 5px;
        background-color: #141414;
        outline: none!important;
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