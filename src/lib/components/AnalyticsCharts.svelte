<script lang="ts">
  import ChartCard from './ChartCard.svelte';

  export let chartData: any;
</script>

<!-- Charts Section -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
  <ChartCard 
    title="Monthly Growth" 
    subtitle="New cards vs. Redemptions" 
    data={chartData.monthlyGrowth} 
    type="line"
  />
  <ChartCard 
    title="Business Performance" 
    subtitle="Engagement by business" 
    data={chartData.businessPerformance} 
    type="bar"
  />
  <ChartCard 
    title="Weekly Redemptions" 
    subtitle="Redemptions over the last 7 days" 
    data={chartData.weeklyRedemptions} 
    type="bar"
    fullWidth={true}
  />
</div>
