<script lang="ts">
  import { goto } from '$app/navigation';
  import Header from '$lib/components/Header.svelte';
  import LoyaltyCard from '$lib/components/LoyaltyCard.svelte';
  import { convex } from '$lib/convex';
  import { api } from '$lib/convex-generated/api';
  
  // Form data
  let formData = {
    businessName: '',
    location: '',
    rewardThreshold: 10,
    color: '#0055FF'
  };
  
  // Form validation
  let errors: Record<string, string> = {};
  
  // Predefined colors for easy selection
  const colorOptions = [
    { name: 'Tap2 Blue', value: '#0055FF' },
    { name: 'Orange', value: '#FF6B35' },
    { name: 'Green', value: '#28A745' },
    { name: 'Purple', value: '#6F42C1' },
    { name: 'Pink', value: '#E83E8C' },
    { name: 'Teal', value: '#20C997' }
  ];
  
  // Validate form
  function validateForm() {
    errors = {};
    
    if (!formData.businessName.trim()) {
      errors.businessName = 'Business name is required';
    }
    
    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }
    
    if (formData.rewardThreshold < 1 || formData.rewardThreshold > 50) {
      errors.rewardThreshold = 'Reward threshold must be between 1 and 50';
    }
    
    return Object.keys(errors).length === 0;
  }
  
  // Handle form submission
  async function handleSubmit() {
    if (!validateForm()) return;
    
    try {
      await convex.mutation(api.loyaltyCards.create, {
        businessName: formData.businessName,
        location: formData.location,
        activeCards: 0,
        redemptions: 0,
        rewardThreshold: formData.rewardThreshold,
        color: formData.color
      });
      
      // Redirect to dashboard
      goto('/');
    } catch (error) {
      console.error('Error creating loyalty program:', error);
      errors.general = 'Failed to create loyalty program. Please try again.';
    }
  }
  
  // Preview card
  $: previewCard = {
    _id: 'preview',
    businessName: formData.businessName || 'Your Business',
    location: formData.location || 'Your Location',
    activeCards: 0,
    redemptions: 0,
    rewardThreshold: formData.rewardThreshold,
    color: formData.color,
    createdAt: Date.now()
  };
</script>

<svelte:head>
  <title>Create Loyalty Program - Tap2</title>
  <meta name="description" content="Create a new digital loyalty card program" />
</svelte:head>

<Header />

<main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <!-- Page Header -->
  <div class="mb-8">
    <nav class="mb-4">
      <div class="flex items-center space-x-2 text-sm text-gray-600">
        <a href="/" class="hover:text-tap2-blue">Dashboard</a>
        <span>/</span>
        <span class="text-black">Create Program</span>
      </div>
    </nav>
    <h1 class="text-3xl font-bold text-black mb-2">Create Loyalty Program</h1>
    <p class="text-gray-600">Set up a new digital loyalty card program for your business</p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-[10rem]">
    <!-- Form -->
    <div class="space-y-6">
      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        <!-- Business Name -->
        <div>
          <label for="businessName" class="block text-sm font-medium text-gray-700 mb-2">
            Business Name *
          </label>
          <input
            id="businessName"
            type="text"
            bind:value={formData.businessName}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tap2-blue focus:border-tap2-blue transition-colors
                   {errors.businessName ? 'border-red-500' : ''}"
            placeholder="e.g., Café Amsterdam"
            required
          />
          {#if errors.businessName}
            <p class="mt-1 text-sm text-red-600">{errors.businessName}</p>
          {/if}
        </div>

        <!-- Location -->
        <div>
          <label for="location" class="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <input
            id="location"
            type="text"
            bind:value={formData.location}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tap2-blue focus:border-tap2-blue transition-colors
                   {errors.location ? 'border-red-500' : ''}"
            placeholder="e.g., Amsterdam, Netherlands"
            required
          />
          {#if errors.location}
            <p class="mt-1 text-sm text-red-600">{errors.location}</p>
          {/if}
        </div>

        <!-- Reward Threshold -->
        <div>
          <label for="rewardThreshold" class="block text-sm font-medium text-gray-700 mb-2">
            Reward Threshold *
          </label>
          <div class="relative">
            <input
              id="rewardThreshold"
              type="number"
              bind:value={formData.rewardThreshold}
              min="1"
              max="50"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tap2-blue focus:border-tap2-blue transition-colors
                     {errors.rewardThreshold ? 'border-red-500' : ''}"
              required
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
              <span class="text-gray-500 text-sm">visits</span>
            </div>
          </div>
          <p class="mt-1 text-sm text-gray-600">
            Customers need to visit this many times to earn a reward
          </p>
          {#if errors.rewardThreshold}
            <p class="mt-1 text-sm text-red-600">{errors.rewardThreshold}</p>
          {/if}
        </div>

        <!-- Brand Color -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Brand Color *
          </label>
          <div class="grid grid-cols-3 gap-3">
            {#each colorOptions as color}
              <button
                type="button"
                on:click={() => formData.color = color.value}
                class="flex items-center p-3 border-2 rounded-lg hover:bg-gray-50 transition-colors
                       {formData.color === color.value ? 'border-tap2-blue bg-blue-50' : 'border-gray-200'}"
              >
                <div 
                  class="w-6 h-6 rounded-full mr-3 border border-gray-200"
                  style="background-color: {color.value}"
                ></div>
                <span class="text-sm font-medium text-gray-700">{color.name}</span>
              </button>
            {/each}
          </div>
          <p class="mt-2 text-sm text-gray-600">
            This color will be used for your loyalty card design
          </p>
        </div>

        <!-- Submit Button -->
        <div class="pt-4">
          <button
            type="submit"
            class="w-full btn-primary"
          >
            Create Loyalty Program
          </button>
          {#if errors.general}
            <p class="mt-2 text-sm text-red-600 text-center">{errors.general}</p>
          {/if}
        </div>
      </form>
    </div>

    <!-- Preview -->
    <div class="space-y-6 -mt-[0.5rem]">
      <div>
        <h3 class=" text-sm font-medium text-gray-700 mb-2">Preview</h3>
        
        <!-- Card Preview -->
        <div class="card p-6 mb-6">
          <div class="flex items-center mb-4">
            <div 
              class="w-12 h-12 rounded-lg mr-3 flex items-center justify-center text-white font-bold text-lg"
              style="background-color: {previewCard.color}"
            >
              {previewCard.businessName.charAt(0)}
            </div>
            <div>
              <h4 class="font-semibold text-black">{previewCard.businessName}</h4>
              <p class="text-sm text-gray-600">{previewCard.location}</p>
            </div>
          </div>
          
          <div class="text-center py-4 bg-gray-50 rounded-lg mb-4">
            <span class="text-sm text-gray-600">Reward after </span>
            <span class="font-semibold text-black">{previewCard.rewardThreshold}</span>
            <span class="text-sm text-gray-600"> visits</span>
          </div>
          
          <div class="text-center">
            <span class="text-sm text-gray-600">0 active cards</span>
          </div>
        </div>

        <!-- Wallet Card Preview -->
        <div class="card p-6">
          <h4 class="font-medium text-black mb-4">Wallet Card Preview</h4>
          <div class="flex justify-center">
            <div 
              class="w-64 h-40 rounded-xl shadow-lg flex flex-col justify-between p-4 text-white"
              style="background: linear-gradient(135deg, {previewCard.color} 0%, {previewCard.color}dd 100%)"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h5 class="text-sm font-bold">{previewCard.businessName}</h5>
                  <p class="text-xs opacity-90">{previewCard.location}</p>
                </div>
                <div class="text-right">
                  <div class="text-lg font-bold">0</div>
                  <div class="text-xs opacity-90">of {previewCard.rewardThreshold}</div>
                </div>
              </div>
              <div class="flex justify-between items-end">
                <div class="text-xs opacity-90">Tap2 Loyalty</div>
                <div class="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span class="text-xs">💳</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
