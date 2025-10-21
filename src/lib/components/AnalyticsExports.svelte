<script lang="ts">
  import ExportModal from './ExportModal.svelte';
  import { BarChart3, Filter } from 'lucide-svelte';

  export let showExportModal: boolean = false;
  export let showFilters: boolean = false;
  export let loyaltyCards: any[];
  export let filteredData: any;

  function toggleExportModal() {
    showExportModal = !showExportModal;
  }

  function toggleFilters() {
    showFilters = !showFilters;
  }

  function handleExport(event: CustomEvent) {
    const format = event.detail;
    
    try {
      if (format === 'json') {
        downloadJSON();
      } else if (format === 'excel') {
        downloadExcel();
      } else if (format === 'pdf') {
        downloadPDF();
      }
      
      showExportModal = false;
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    }
  }

  function downloadJSON() {
    if (!loyaltyCards || loyaltyCards.length === 0) {
      alert('No data available to export. Please add some businesses first.');
      return;
    }
    
    try {
      const exportData = {
        reportDate: new Date().toISOString(),
        summary: {
          totalPrograms: filteredData.totalPrograms || 0,
          totalActiveCards: filteredData.totalActiveCards || 0,
          totalRedemptions: filteredData.totalRedemptions || 0,
          averageEngagement: filteredData.avgEngagement || 0
        },
        businesses: loyaltyCards.map((card: any) => ({
          id: card._id,
          businessName: card.businessName || 'Unknown',
          location: card.location || 'Unknown',
          activeCards: card.activeCards || 0,
          redemptions: card.redemptions || 0,
          rewardThreshold: card.rewardThreshold || 0,
          engagementRate: Math.round(((card.redemptions || 0) / (card.activeCards || 1)) * 100) || 0,
          color: card.color || '#0055FF',
          createdAt: card.createdAt || new Date().toISOString()
        }))
      };
      
      const jsonContent = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('JSON download error:', error);
      alert('Failed to download JSON. Please try again.');
    }
  }

  function downloadExcel() {
    if (!loyaltyCards || loyaltyCards.length === 0) {
      alert('No data available to export. Please add some businesses first.');
      return;
    }
    
    try {
      // Create CSV data that Excel can open natively
      const csvData = [
        ['Business Name', 'Location', 'Active Cards', 'Redemptions', 'Engagement Rate (%)', 'Reward Threshold', 'Created Date'],
        ...loyaltyCards.map((card: any) => [
          card.businessName || 'Unknown',
          card.location || 'Unknown',
          card.activeCards || 0,
          card.redemptions || 0,
          Math.round(((card.redemptions || 0) / (card.activeCards || 1)) * 100) || 0,
          card.rewardThreshold || 0,
          card.createdAt ? new Date(card.createdAt).toLocaleDateString() : 'Unknown'
        ])
      ];
      
      const csvContent = csvData.map(row => 
        row.map(cell => `"${cell}"`).join(',')
      ).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.xlsx`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Excel download error:', error);
      alert('Failed to download Excel file. Please try again.');
    }
  }

  function downloadPDF() {
    if (!loyaltyCards || loyaltyCards.length === 0) {
      alert('No data available to export. Please add some businesses first.');
      return;
    }
    
    try {
      // Create a structured PDF-like content using HTML/CSS that can be printed as PDF
      const pdfContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Analytics Report - ${new Date().toLocaleDateString()}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #0055FF; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #0055FF; margin: 0; }
        .header p { color: #666; margin: 5px 0; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
        .metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px; }
        .metric { background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #0055FF; }
        .metric-label { font-weight: bold; color: #666; font-size: 14px; }
        .metric-value { font-size: 24px; color: #0055FF; margin-top: 5px; }
        .business-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .business-table th, .business-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        .business-table th { background: #f8f9fa; font-weight: bold; }
        .business-table tr:hover { background: #f8f9fa; }
        .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Tap2 Loyalty Analytics Report</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
    </div>
    
    <div class="section">
        <h2>Key Metrics</h2>
        <div class="metrics">
            <div class="metric">
                <div class="metric-label">Total Programs</div>
                <div class="metric-value">${filteredData.totalPrograms || 0}</div>
            </div>
            <div class="metric">
                <div class="metric-label">Active Cards</div>
                <div class="metric-value">${(filteredData.totalActiveCards || 0).toLocaleString()}</div>
            </div>
            <div class="metric">
                <div class="metric-label">Total Redemptions</div>
                <div class="metric-value">${(filteredData.totalRedemptions || 0).toLocaleString()}</div>
            </div>
            <div class="metric">
                <div class="metric-label">Average Engagement</div>
                <div class="metric-value">${filteredData.avgEngagement || 0}%</div>
            </div>
        </div>
    </div>
    
    <div class="section">
        <h2>Business Performance</h2>
        <table class="business-table">
            <thead>
                <tr>
                    <th>Business Name</th>
                    <th>Location</th>
                    <th>Active Cards</th>
                    <th>Redemptions</th>
                    <th>Engagement Rate</th>
                </tr>
            </thead>
            <tbody>
                ${loyaltyCards.map((card: any) => `
                    <tr>
                        <td>${card.businessName || 'Unknown'}</td>
                        <td>${card.location || 'Unknown'}</td>
                        <td>${card.activeCards || 0}</td>
                        <td>${card.redemptions || 0}</td>
                        <td>${Math.round(((card.redemptions || 0) / (card.activeCards || 1)) * 100) || 0}%</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    
    <div class="footer">
        <p>Generated by Tap2 Loyalty Dashboard</p>
        <p>Report ID: ${Date.now()}</p>
    </div>
</body>
</html>
      `;
      
      const blob = new Blob([pdfContent], { type: 'application/pdf;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.pdf`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF download error:', error);
      alert('Failed to download PDF. Please try again.');
    }
  }
</script>

<!-- Export Modal -->
{#if showExportModal}
  <ExportModal 
    on:close={() => showExportModal = false}
    on:export={handleExport}
  />
{/if}

<!-- Action Buttons -->
<div class="mt-4 sm:mt-0 flex space-x-3">
  <button 
    on:click={toggleFilters}
    class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center"
  >
    <Filter class="w-4 h-4 mr-2" />
    Filters
  </button>
  <button 
    on:click={toggleExportModal}
    class="px-4 py-2 bg-tap2-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
  >
    <BarChart3 class="w-4 h-4 mr-2" />
    Export Report
  </button>
</div>
