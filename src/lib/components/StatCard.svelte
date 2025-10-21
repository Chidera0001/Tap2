<script lang="ts">
  import { CreditCard, Gift, Building, BarChart3, TrendingUp, TrendingDown } from 'lucide-svelte';
  
  export let title: string;
  export let value: number | string;
  export let icon: string = '';
  export let color: string = 'tap2-blue';
  export let trend: 'up' | 'down' | 'neutral' = 'neutral';
  export let trendValue: string = '';
  
  // Map icon names to Lucide components
  $: IconComponent = (() => {
    switch(icon) {
      case '💳': return CreditCard;
      case '🎁': return Gift;
      case '🏪': return Building;
      case '📊': return BarChart3;
      default: return BarChart3;
    }
  })();
</script>

<div class="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100/50 animate-fade-in-up group">
  <!-- Custom Background Pattern -->
  <div class="absolute inset-0 opacity-5">
    <div class="absolute top-0 left-0 w-full h-full" style="background-image: radial-gradient(circle at 20px 20px, rgba(0,85,255,0.1) 2px, transparent 2px); background-size: 40px 40px;"></div>
  </div>
  
  <!-- Gradient overlay -->
  <div class="absolute inset-0 bg-gradient-to-br from-tap2-blue/5 via-transparent to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  
  <!-- Floating accent -->
  <div class="absolute top-2 right-2 w-8 h-8 bg-gradient-to-br from-tap2-blue/10 to-blue-600/10 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  
  <!-- Content -->
  <div class="relative p-6">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 text-center">{title}</p>
        <p class="text-4xl font-bold text-gray-900 mb-3 text-center">{value}</p>
        
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
      
      {#if icon}
        <div class="flex-shrink-0">
          <div class="relative">
            <!-- Outer glow -->
            <div class="absolute inset-0 bg-gradient-to-br from-tap2-blue/20 to-blue-600/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
            
            <!-- Main icon container -->
            <div class="relative w-16 h-16 bg-gradient-to-br from-tap2-blue/10 via-tap2-blue/20 to-blue-600/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg border border-tap2-blue/10">
              <!-- Inner pattern -->
              <div class="absolute inset-0 rounded-2xl opacity-50" style="background-image: radial-gradient(circle at 10px 10px, rgba(0,85,255,0.05) 1px, transparent 1px); background-size: 20px 20px;"></div>
              
              <!-- Icon -->
              <svelte:component this={IconComponent} class="w-8 h-8 text-tap2-blue relative z-10" />
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
  
  <!-- Bottom accent line -->
  <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-tap2-blue to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
</div>
