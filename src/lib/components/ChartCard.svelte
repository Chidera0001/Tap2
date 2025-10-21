<script lang="ts">
  export let title: string;
  export let subtitle: string;
  export let data: any[];
  export let type: 'line' | 'bar' | 'pie' = 'bar';
  export let fullWidth: boolean = false;
  
  // Calculate chart dimensions and data
  $: maxValue = Math.max(...data.map(d => d.cards || d.redemptions || d.engagement || 0));
  $: chartHeight = 200;
  $: chartWidth = fullWidth ? 800 : 400;
  $: isMonthlyChart = data.length > 6 && data[0]?.month; // Check if it's a monthly chart with 12 months
  $: safeMaxValue = maxValue === 0 ? 1 : maxValue; // Prevent division by zero
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 {fullWidth ? 'col-span-1 lg:col-span-2' : ''}">
  <div class="mb-6">
    <h3 class="text-lg font-semibold text-gray-900">{title}</h3>
    <p class="text-sm text-gray-600">{subtitle}</p>
  </div>
  
  <div class="relative {isMonthlyChart ? 'overflow-x-auto' : ''}">
    {#if type === 'bar'}
      <!-- Bar Chart -->
      <div class="flex items-end justify-between h-40 space-x-2 mt-[5rem] {isMonthlyChart ? 'min-w-[600px]' : ''}">
        {#each data as item, index}
          <div class="flex flex-col items-center flex-1">
            <div 
              class="w-full bg-gradient-to-t from-tap2-blue to-blue-600 rounded-t-lg transition-all duration-500 hover:from-blue-600 hover:to-blue-700"
              style="height: {((item.cards || item.redemptions || item.engagement || 0) / safeMaxValue) * 140}px;"
              title="{item.business || item.day || item.month}: {item.cards || item.redemptions || item.engagement || 0}"
            ></div>
            <div class="mt-2 text-xs text-gray-600 text-center">
              {item.business ? item.business.split(' ')[0] : (item.day || item.month)}
            </div>
            <div class="text-xs font-semibold text-gray-900 mt-1">
              {item.cards || item.redemptions || item.engagement || 0}
            </div>
          </div>
        {/each}
      </div>
    {:else if type === 'line'}
      <!-- Line Chart -->
      <div class="relative h-48 {isMonthlyChart ? 'overflow-x-auto' : ''}">
        <svg class="w-full h-full {isMonthlyChart ? 'min-w-[800px]' : ''}" viewBox="{isMonthlyChart ? '0 0 800 200' : '0 0 400 200'}">
          <!-- Grid lines -->
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          <!-- Line path -->
          <path 
            d="M {data.map((item, i) => `${(i * (isMonthlyChart ? 60 : 60)) + 20},${180 - ((item.cards || item.redemptions || 0) / safeMaxValue) * 160}`).join(' L ')}"
            fill="none" 
            stroke="#0055FF" 
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          
          <!-- Data points -->
          {#each data as item, index}
            <circle 
              cx={(index * (isMonthlyChart ? 60 : 60)) + 20} 
              cy={180 - ((item.cards || item.redemptions || 0) / safeMaxValue) * 160}
              r="4" 
              fill="#0055FF"
              class="hover:r-6 transition-all duration-200"
            />
          {/each}
        </svg>
        
        <!-- Labels -->
        <div class="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-600 {isMonthlyChart ? 'min-w-[800px]' : ''}">
          {#each data as item}
            <span>{item.month || item.day}</span>
          {/each}
        </div>
      </div>
    {/if}
  </div>
  
  <!-- Legend -->
  <div class="mt-4 flex items-center justify-center space-x-6">
    {#if type === 'line'}
      <div class="flex items-center">
        <div class="w-3 h-3 bg-tap2-blue rounded-full mr-2"></div>
        <span class="text-sm text-gray-600">Cards Issued</span>
      </div>
      <div class="flex items-center">
        <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
        <span class="text-sm text-gray-600">Redemptions</span>
      </div>
    {:else if type === 'bar'}
      <div class="flex items-center">
        <div class="w-3 h-3 bg-gradient-to-r from-tap2-blue to-blue-600 rounded mr-2"></div>
        <span class="text-sm text-gray-600">
          {data[0]?.cards ? 'Active Cards' : data[0]?.redemptions ? 'Redemptions' : 'Engagement %'}
        </span>
      </div>
    {/if}
  </div>
</div>
