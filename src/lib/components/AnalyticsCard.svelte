<script lang="ts">
  export let title: string;
  export let value: number | string;
  export let icon: any;
  export let trend: 'up' | 'down' | 'neutral' = 'neutral';
  export let trendValue: string = '';
</script>

<div class="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-100/50 animate-fade-in-up group">
  <!-- Custom Background Pattern -->
  <div class="absolute inset-0 opacity-5">
    <div class="absolute top-0 left-0 w-full h-full" style="background-image: radial-gradient(circle at 20px 20px, rgba(0,85,255,0.1) 2px, transparent 2px); background-size: 40px 40px;"></div>
  </div>
  
  <!-- Gradient overlay -->
  <div class="absolute inset-0 bg-gradient-to-br from-tap2-blue/5 via-transparent to-blue-600/5 opacity-100 group-hover:opacity-100 transition-opacity duration-300"></div>
  
  <!-- Floating accent -->
  <div class="absolute top-2 right-2 w-8 h-8 bg-gradient-to-br from-tap2-blue/10 to-blue-600/10 rounded-full blur-sm opacity-100 group-hover:opacity-100 transition-opacity duration-300"></div>
  
  <!-- Content -->
  <div class="relative p-6">
    <div class="text-center">
      <p class="text-sm font-semibold text-blue-500 uppercase tracking-wide mb-2">{title}</p>
      <p class="text-4xl font-bold text-gray-900 mb-3">{value}</p>
      
      {#if trend !== 'neutral' && trendValue}
        <div class="flex items-center justify-center">
          {#if trend === 'up'}
            <div class="flex items-center bg-green-50 px-2 py-1 rounded-full">
              <span class="text-xs font-semibold text-green-700">{trendValue}</span>
            </div>
          {:else if trend === 'down'}
            <div class="flex items-center bg-red-50 px-2 py-1 rounded-full">
              <span class="text-xs font-semibold text-red-700">{trendValue}</span>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
  
  <!-- Bottom accent line -->
  <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-tap2-blue to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
</div>
