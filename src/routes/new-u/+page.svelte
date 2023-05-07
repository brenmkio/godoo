<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;

    async function subscribe(event: Event) {
        const form = event.target as HTMLFormElement
        const data = new FormData(form)

        await fetch('/api/u', {
            method: 'POST',
            body: data,
        })
    }

</script>

<h1>New dummy user</h1>

<form on:submit|preventDefault={subscribe}>
    <input type="email" name="email">
    <button>Test</button>
</form>