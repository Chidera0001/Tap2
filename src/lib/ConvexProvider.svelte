<script lang="ts">
  import { ConvexProvider } from 'convex/react';
  import { ConvexReactClient } from 'convex/react';
  
  // Initialize Convex client with your deployment URL
  const convex = new ConvexReactClient('https://formal-penguin-443.convex.cloud');
</script>

<ConvexProvider client={convex}>
  <slot />
</ConvexProvider>
