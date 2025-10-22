<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { X, Calendar } from 'lucide-svelte';
  
  export let selectedBusiness: string = 'all';
  export let dateRange: string = '30d';
  export let loyaltyCards: any[] = [];
  
  const dispatch = createEventDispatcher();
  
  // Dynamic business options based on loyalty cards
  $: businessOptions = [
    { value: 'all', label: 'All Businesses' },
    ...loyaltyCards.map((card: any) => ({
      value: card.businessName,
      label: card.businessName
    }))
  ];
  
  const dateOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' },
    { value: 'custom', label: 'Custom range' }
  ];
  
  // Custom date range state
  let showCustomDateRange = false;
  let customStartDate = '';
  let customEndDate = '';
  
  function handleClose() {
    dispatch('close');
  }
  
  function handleDateRangeChange() {
    if (dateRange === 'custom') {
      showCustomDateRange = true;
    } else {
      showCustomDateRange = false;
    }
  }
  
  function applyFilters() {
    // In a real app, this would trigger data refetch
    handleClose();
  }
  
  function resetFilters() {
    selectedBusiness = 'all';
    dateRange = '30d';
    showCustomDateRange = false;
    customStartDate = '';
    customEndDate = '';
  }
</script>

<div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
  <div class="flex items-center justify-between mb-6">
    <h3 class="text-lg font-semibold text-gray-900">Filter Analytics</h3>
    <button 
      on:click={handleClose}
      class="text-gray-400 hover:text-gray-600 transition-colors"
    >
      <X class="w-5 h-5" />
    </button>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Business Filter -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-3">Business</label>
      <div class="relative">
        <select 
          bind:value={selectedBusiness}
          class="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-tap2-blue focus:border-tap2-blue transition-all duration-200 appearance-none cursor-pointer hover:border-gray-300"
        >
          {#each businessOptions as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>
    
    <!-- Date Range Filter -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-3">Date Range</label>
      <div class="relative">
        <select 
          bind:value={dateRange}
          on:change={handleDateRangeChange}
          class="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-tap2-blue focus:border-tap2-blue transition-all duration-200 appearance-none cursor-pointer hover:border-gray-300"
        >
          {#each dateOptions as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Calendar class="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  </div>
  
  <!-- Custom Date Range -->
  {#if showCustomDateRange}
    <div class="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
      <h4 class="text-sm font-medium text-gray-700 mb-4">Select Custom Date Range</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-2">Start Date</label>
          <input
            type="date"
            bind:value={customStartDate}
            class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-tap2-blue focus:border-tap2-blue transition-all duration-200"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-2">End Date</label>
          <input
            type="date"
            bind:value={customEndDate}
            class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-tap2-blue focus:border-tap2-blue transition-all duration-200"
          />
        </div>
      </div>
    </div>
  {/if}
  
  <!-- Action Buttons -->
  <div class="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
    <button 
      on:click={resetFilters}
      class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
    >
      Reset
    </button>
    <button 
      on:click={applyFilters}
      class="px-4 py-2 bg-tap2-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Apply Filters
    </button>
  </div>
</div>
