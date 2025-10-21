<script lang="ts">
  import { TrendingUp, Calendar, Users } from 'lucide-svelte';

  export let recentActivity: any[];
  export let insights: any[];
</script>

<!-- Recent Activity & Key Insights -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <!-- Recent Activity -->
  <div class="card p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
    <div class="space-y-3 max-h-80 overflow-auto scrollbar-hide">
      {#each recentActivity as activity, index}
        <div class="flex items-start space-x-3 py-2 {index < recentActivity.length - 1 ? 'border-b border-gray-100' : ''}">
          <div class="w-2 h-2 rounded-full mt-2 flex-shrink-0 {activity.type === 'card' ? 'bg-tap2-blue' : activity.type === 'redemption' ? 'bg-green-500' : activity.type === 'update' ? 'bg-yellow-500' : activity.type === 'stats' ? 'bg-purple-500' : 'bg-gray-400'}"></div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-900">{activity.message}</p>
            <p class="text-xs text-gray-500">{activity.time}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Key Insights -->
  <div class="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50/30 border border-blue-200/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full -translate-y-16 translate-x-16"></div>
      <div class="absolute bottom-0 left-0 w-24 h-24 bg-blue-400 rounded-full translate-y-12 -translate-x-12"></div>
    </div>
    
    <div class="relative p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900">Key Insights</h3>
        </div>
        <div class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
          {insights.length} insights
        </div>
      </div>
      
      <!-- Insights List -->
      <div class="space-y-4 max-h-80 overflow-auto scrollbar-hide">
        {#each insights as insight, index}
          <div class="group relative p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-blue-100/50 hover:bg-white hover:shadow-sm transition-all duration-200 hover:border-blue-200">
            <!-- Priority Badge -->
            <div class="absolute top-3 right-3">
              <span class="px-2 py-1 text-xs font-medium rounded-full {insight.priority === 'high' ? 'bg-red-100 text-red-700' : insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}">
                {insight.priority}
              </span>
            </div>
            
            <div class="flex items-start pr-16">
              <!-- Content -->
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                  {insight.title}
                </h4>
                <p class="text-sm text-gray-600 leading-relaxed">
                  {insight.description}
                </p>
                
                <!-- Business Tag -->
                {#if insight.businessName}
                  <div class="mt-3">
                    <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd"></path>
                      </svg>
                      {insight.businessName}
                    </span>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        {/each}
        
        {#if insights.length === 0}
          <div class="text-center py-8">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <h4 class="text-sm font-medium text-gray-900 mb-2">No Insights Available</h4>
            <p class="text-sm text-gray-500">Add some businesses to generate insights.</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
