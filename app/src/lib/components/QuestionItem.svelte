<script>
    let { sbj, placeholder, iptVal = $bindable() } = $props();
</script>

<div class="mt-5 flex w-full items-center">
    <div class="w-1/5 text-center text-sm">{sbj}</div>
    <div class="w-4/5">
        <input
            bind:value={iptVal}
            type="text"
            {placeholder}
            class="input input-bordered input-info input-sm w-full"
        />
    </div>
</div>
