<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { X, FileText, Table, Download } from 'lucide-svelte';
  
  const dispatch = createEventDispatcher();
  
  const exportOptions = [
    {
      format: 'pdf',
      label: 'PDF Report',
      description: 'Complete analytics report with charts and insights',
      icon: FileText,
      color: 'bg-red-500'
    },
    {
      format: 'excel',
      label: 'Excel Spreadsheet',
      description: 'Detailed data tables for further analysis',
      icon: Table,
      color: 'bg-green-500'
    },
    {
      format: 'json',
      label: 'JSON Data',
      description: 'Raw data for import into other tools',
      icon: Download,
      color: 'bg-blue-500'
    }
  ];
  
  function handleClose() {
    dispatch('close');
  }
  
  function handleExport(format) {
    dispatch('export', format);
  }
</script>

<!-- Modal Backdrop -->
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
  <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
    <!-- Modal Header -->
    <div class="flex items-center justify-between p-6 border-b border-gray-200">
      <h3 class="text-xl font-semibold text-gray-900">Export Analytics Report</h3>
      <button 
        on:click={handleClose}
        class="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X class="w-6 h-6" />
      </button>
    </div>
    
    <!-- Modal Content -->
    <div class="p-6">
      <p class="text-gray-600 mb-6">Choose your preferred export format:</p>
      
      <div class="space-y-4">
        {#each exportOptions as option}
          <button
            on:click={() => handleExport(option.format)}
            class="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-tap2-blue hover:bg-blue-50 transition-all duration-200 group"
          >
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 {option.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svelte:component this={option.icon} class="w-6 h-6 text-white" />
              </div>
              <div class="flex-1 text-left">
                <h4 class="font-semibold text-gray-900 group-hover:text-tap2-blue transition-colors">
                  {option.label}
                </h4>
                <p class="text-sm text-gray-600">{option.description}</p>
              </div>
            </div>
          </button>
        {/each}
      </div>
    </div>
    
    <!-- Modal Footer -->
    <div class="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
      <button 
        on:click={handleClose}
        class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        Cancel
      </button>
    </div>
  </div>
</div>
