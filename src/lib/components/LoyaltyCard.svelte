<script lang="ts">
  import StatCard from './StatCard.svelte';
  import { MapPin, Calendar, Users, Gift } from 'lucide-svelte';
  
  export let card: {
    _id: string;
    businessName: string;
    location: string;
    activeCards: number;
    redemptions: number;
    rewardThreshold: number;
    color: string;
    createdAt: number;
  };
  
  // Calculate engagement rate
  $: engagementRate = card.activeCards > 0 
    ? Math.round((card.redemptions / card.activeCards) * 100) 
    : 0;
  
  // Format date
  $: createdDate = new Date(card.createdAt).toLocaleDateString();
  
  // Business images mapping
  $: businessImage = (() => {
    switch(card.businessName) {
      case 'Café Amsterdam': return 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=200&fit=crop&crop=center';
      case 'Bistro Rotterdam': return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop&crop=center';
      case 'The Hague Coffee': return 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=200&fit=crop&crop=center';
      default: return 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=200&fit=crop&crop=center';
    }
  })();
</script>

<div class="card-gradient overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group animate-fade-in-up">
  <!-- Business Image Header -->
  <div class="relative h-32 overflow-hidden">
    <img 
      src={businessImage} 
      alt="{card.businessName}" 
      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
    
    <!-- Color indicator -->
    <div 
      class="absolute top-3 right-3 w-4 h-4 rounded-full border-2 border-white shadow-sm"
      style="background-color: {card.color}"
      title="Brand color"
    ></div>
    
    <!-- Business name overlay -->
    <div class="absolute bottom-3 left-3 text-white">
      <h3 class="text-lg font-bold drop-shadow-lg">{card.businessName}</h3>
    </div>
  </div>

  <!-- Card Content -->
  <div class="p-6">
    <!-- Location and Date -->
    <div class="flex items-center text-gray-600 mb-4 space-x-4">
      <div class="flex items-center">
        <MapPin class="w-4 h-4 mr-1" />
        <span class="text-sm">{card.location}</span>
      </div>
      <div class="flex items-center">
        <Calendar class="w-4 h-4 mr-1" />
        <span class="text-sm">Created {createdDate}</span>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div class="text-center p-3 bg-gray-50 rounded-lg">
        <div class="flex items-center justify-center mb-1">
          <Users class="w-4 h-4 text-tap2-blue mr-1" />
          <span class="text-xs text-gray-600">Active Cards</span>
        </div>
        <div class="text-xl font-bold text-gray-900">{card.activeCards}</div>
      </div>
      <div class="text-center p-3 bg-gray-50 rounded-lg">
        <div class="flex items-center justify-center mb-1">
          <Gift class="w-4 h-4 text-green-600 mr-1" />
          <span class="text-xs text-gray-600">Redemptions</span>
        </div>
        <div class="text-xl font-bold text-gray-900">{card.redemptions}</div>
      </div>
    </div>

    <!-- Engagement Rate -->
    <div class="mb-4">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm font-medium text-gray-700">Engagement Rate</span>
        <span class="text-sm font-bold text-tap2-blue">{engagementRate}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="bg-gradient-to-r from-tap2-blue to-blue-600 h-2 rounded-full transition-all duration-500"
          style="width: {Math.min(engagementRate, 100)}%"
        ></div>
      </div>
    </div>

    <!-- Reward Threshold -->
    <div class="text-center py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg mb-4">
      <span class="text-sm text-gray-600">Reward after </span>
      <span class="font-semibold text-gray-900">{card.rewardThreshold}</span>
      <span class="text-sm text-gray-600"> visits</span>
    </div>

    <!-- Action Button -->
    <a 
      href="/card/{card._id}"
      class="block w-full text-center py-3 px-4 bg-gradient-to-r from-tap2-blue to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
    >
      View Details
    </a>
  </div>
</div>
