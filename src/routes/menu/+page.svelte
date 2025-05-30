<script>
    import { goto } from "$app/navigation";
</script>

<button on:click={() => {
    goto("../arena");
}}>New Game</button>