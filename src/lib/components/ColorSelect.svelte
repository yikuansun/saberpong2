<script>
    export let availColors = [
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
    export let tooltip="";
    export let value = availColors[0].color;
</script>

{#each availColors as { color, locked, unlockMessage }}
    {#if !locked}
        <button style:background-color={color} on:click={() => {
                value = color;
            }} style:box-shadow={(value == color) ? "0 0 5px white, 0 0 20px white" : ""}
            ></button>
    {:else}
        <button style:background-color="black"
            disabled={true} on:mouseover={() => {
                tooltip = unlockMessage;
            }} on:mouseleave={() => {
                tooltip = "";
            }} on:focus={() => {}} style:position="relative">
            <div style:position="absolute" style:top="17px" style:left="14px"
                style:width="14px" style:height="14px" style:background-color="white"
                style:border-radius="3px"></div>
            <div style:position="absolute" style:top="12px" style:left="16px"
                style:width="10px" style:height="10px"
                style:background-color="transparent" style:border-radius="5px"
                style:box-shadow = "inset 0 0 0 2px white"></div>
            <div style:position="absolute" style:top="22px" style:left="19px"
                style:width="4px" style:height="4px"
                style:background-color="black" style:border-radius="2px"></div>
        </button>
    {/if}
{/each} <br />
<span style:font-size="15px">{tooltip}</span>

<style>
    button {
        border: 0;
        width: 42px;
        height: 42px;
        padding: 0;
        margin: 5px 20px;
        border-radius: 21px;
        transition: box-shadow 0.3s;
    }
</style>