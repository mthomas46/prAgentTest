// Import Chart.js for visualizations
declare const Chart: any;

interface CodeMetrics {
  totalLines: number;
  codeLines: number;
  commentLines: number;
  blankLines: number;
  fileTypes: Array<{
    type: string;
    count: number;
    lines: number;
  }>;
  complexity: {
    average: number;
    max: number;
    distribution: {
      low: number;
      medium: number;
      high: number;
    };
  };
  typeCoverage: {
    percentage: number;
    totalTypes: number;
    coveredTypes: number;
  };
  codeSmells: {
    total: number;
    byType: {
      complexity: number;
      duplication: number;
      naming: number;
      other: number;
    };
  };
  historicalTrends: {
    dates: string[];
    metrics: {
      linesOfCode: number[];
      complexity: number[];
      typeCoverage: number[];
    };
  };
}

// Function to fetch code metrics
async function fetchCodeMetrics(): Promise<CodeMetrics> {
  try {
    const response = await fetch('/api/metrics');
    if (!response.ok) {
      throw new Error('Failed to fetch code metrics');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching code metrics:', error);
    throw error;
  }
}

// Create code size distribution chart
function createCodeSizeChart(metrics: CodeMetrics) {
  const container = document.getElementById('code-size-chart');
  if (!container) {
    console.error('Code size chart container not found');
    return;
  }

  console.log('Creating code size chart with data:', {
    codeLines: metrics.codeLines,
    commentLines: metrics.commentLines,
    blankLines: metrics.blankLines,
  });

  try {
    // Create canvas element
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    const chart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: ['Code', 'Comments', 'Blank Lines'],
        datasets: [
          {
            data: [metrics.codeLines, metrics.commentLines, metrics.blankLines],
            backgroundColor: ['#4CAF50', '#2196F3', '#FFC107'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Code Size Distribution',
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    });

    console.log('Code size chart created successfully');
  } catch (error) {
    console.error('Error creating code size chart:', error);
    container.innerHTML = '<div class="error">Failed to create code size chart</div>';
  }
}

// Create file type distribution chart
function createFileTypeChart(metrics: CodeMetrics) {
  const container = document.getElementById('file-type-chart');
  if (!container) return;

  // Create canvas element
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: metrics.fileTypes.map(ft => ft.type),
      datasets: [
        {
          label: 'Lines of Code',
          data: metrics.fileTypes.map(ft => ft.lines),
          backgroundColor: '#4CAF50',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'File Type Distribution',
        },
      },
    },
  });
}

// Create historical trends chart
function createHistoricalTrendsChart(metrics: CodeMetrics) {
  const container = document.getElementById('historical-trends');
  if (!container) {
    console.error('Historical trends container not found');
    return;
  }

  console.log('Creating historical trends chart with data:', metrics.historicalTrends);

  try {
    // Create canvas element
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    const chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: metrics.historicalTrends.dates,
        datasets: [
          {
            label: 'Lines of Code',
            data: metrics.historicalTrends.metrics.linesOfCode,
            borderColor: '#4CAF50',
            tension: 0.1,
          },
          {
            label: 'Complexity',
            data: metrics.historicalTrends.metrics.complexity,
            borderColor: '#2196F3',
            tension: 0.1,
          },
          {
            label: 'Type Coverage',
            data: metrics.historicalTrends.metrics.typeCoverage,
            borderColor: '#FFC107',
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Historical Trends',
          },
          legend: {
            position: 'top',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    console.log('Historical trends chart created successfully');
  } catch (error) {
    console.error('Error creating historical trends chart:', error);
    container.innerHTML = '<div class="error">Failed to create historical trends chart</div>';
  }
}

// Function to update complexity metrics
function updateComplexityMetrics(metrics: CodeMetrics): void {
  const cyclomaticElement = document.getElementById('cyclomatic-complexity');
  const linesElement = document.getElementById('lines-of-code');

  if (cyclomaticElement) {
    cyclomaticElement.innerHTML = `
            <div class="metric-value">${metrics.complexity.average}</div>
            <div class="metric-label">Average Complexity</div>
        `;
  }

  if (linesElement) {
    linesElement.innerHTML = `
            <div class="metric-value">${metrics.totalLines}</div>
            <div class="metric-label">Total Lines</div>
        `;
  }
}

// Function to update quality metrics
function updateQualityMetrics(metrics: CodeMetrics): void {
  const smellsElement = document.getElementById('code-smells');
  const coverageElement = document.getElementById('type-coverage');

  if (smellsElement) {
    smellsElement.innerHTML = `
            <div class="metric-value">${metrics.codeSmells.total}</div>
            <div class="metric-label">Identified Issues</div>
        `;
  }

  if (coverageElement) {
    coverageElement.innerHTML = `
            <div class="metric-value">${metrics.typeCoverage.percentage}%</div>
            <div class="metric-label">Type Coverage</div>
        `;
  }
}

// Initialize statistics page
async function initStatistics(): Promise<void> {
  console.log('Initializing statistics page...');
  try {
    const metrics = await fetchCodeMetrics();
    console.log('Fetched metrics:', metrics);

    // Create visualizations
    createCodeSizeChart(metrics);
    createFileTypeChart(metrics);
    updateComplexityMetrics(metrics);
    updateQualityMetrics(metrics);
    createHistoricalTrendsChart(metrics);

    console.log('All charts created successfully');
  } catch (error) {
    console.error('Error initializing statistics:', error);
    const containers = document.querySelectorAll('.chart-container, .metrics-container');
    containers.forEach(container => {
      container.innerHTML =
        '<div class="error">Failed to load statistics. Please try again later.</div>';
    });
  }
}

// Call initStatistics when the page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing statistics...');
  initStatistics().catch(error => {
    console.error('Failed to initialize statistics:', error);
  });
});
