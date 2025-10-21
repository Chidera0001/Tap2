<script lang="ts">
  import AnalyticsCard from './AnalyticsCard.svelte';
  import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-svelte';

  export let filteredData: any;
</script>

<!-- Key Metrics -->
<div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
  <AnalyticsCard 
    title="Total Programs" 
    value={filteredData.totalPrograms || 0} 
    icon={BarChart3}
    trend="up"
    trendValue="+1 this month"
  />
  <AnalyticsCard 
    title="Active Cards" 
    value={(filteredData.totalActiveCards || 0).toLocaleString()} 
    icon={Users}
    trend="up"
    trendValue="+12% this month"
  />
  <AnalyticsCard 
    title="Total Redemptions" 
    value={(filteredData.totalRedemptions || 0).toLocaleString()} 
    icon={TrendingUp}
    trend="up"
    trendValue="+8% this month"
  />
  <AnalyticsCard 
    title="Avg Engagement" 
    value={filteredData.avgEngagement ? `${filteredData.avgEngagement}%` : '0%'} 
    icon={Calendar}
    trend="up"
    trendValue="+3% this month"
  />
</div>
