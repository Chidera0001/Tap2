<script lang="ts">
  import '../app.css';
  import type { LayoutLoad } from './$types';
  
  export const load: LayoutLoad = async () => {
    return {};
  };
</script>

<main class="min-h-screen bg-white">
  <slot />
</main>