<script>
    let testGroup = [];
</script>

<div>
    <label>
        <input
            type="radio"
            class="hidden peer"
            value="11111"
            bind:group={testGroup}
        />
        <div class="border peer-checked:border-blue-500">11111</div>
    </label>

    <label>
        <input
            type="radio"
            class="hidden peer"
            value="22222"
            bind:group={testGroup}
        />
        <div class="border peer-checked:border-blue-500">22222</div>
    </label>
</div>

<button
    on:click={() => {
        console.log(testGroup);
    }}
>
    asldjfadf
</button>
