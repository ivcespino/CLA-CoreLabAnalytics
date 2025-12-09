let regressionChartInstance = null;
let distributionChartInstance = null;

$(document).ready(function() {
    
    // --- Event Listeners ---
    // File Upload
    $('#csvFileInput').on('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            parseCSV(file);
        }
    });

    // Demo Data Loader
    $('#loadDemoData').on('click', function(e) {
        e.preventDefault();
        loadDemoData();
    });

    // Handle Theme Change for Charts
    document.addEventListener('themeChange', function(e) {
        const isDark = e.detail.isDark;
        updateChartsTheme(isDark);
    });

    // Reset / Redo Analysis
    $('#btn-reset-analysis').on('click', function() {
        $('#dashboard-content').addClass('hidden');
        $('#upload-section').removeClass('hidden');
        
        $('#csvFileInput').val('');

        $('html, body').animate({ scrollTop: 0 }, 'fast');
    });

});

// --- Data Parsing ---

function parseCSV(file) {
    Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {
            if (results.data && results.data.length > 0) {
                processData(results.data);
            } else {
                alert("Error: The CSV file appears to be empty or invalid.");
            }
        },
        error: function(error) {
            alert("CSV Parse Error: " + error.message);
        }
    });
}

function loadDemoData() {
    // Simulated data if the user doesn't have a CSV, also for grading purposes.
    const demoData = [];
    for (let i = 0; i < 50; i++) {
        // Generates a realistic-looking data with a slight positive trend.
        let hours = Math.floor(Math.random() * 10) + 1; // 1 to 10 hours
        let baseGrade = 75;
        let prelim = baseGrade + (hours * 1.5) + (Math.random() * 10 - 5);
        let midterm = prelim + (hours * 0.5) + (Math.random() * 5 - 2); 
        
        demoData.push({
            "StudentID": "S" + (i+1),
            "LabHours": hours,
            "HandsOn%": Math.floor(Math.random() * 40) + 60, // 60-100%
            "PrelimGrade": parseFloat(prelim.toFixed(2)),
            "MidtermGrade": parseFloat(midterm.toFixed(2))
        });
    }
    processData(demoData);
}

// --- The Analysis Engine ---

function processData(data) {
    // 01. Reveal Dashboard
    $('#upload-section').addClass('hidden');
    $('#dashboard-content').removeClass('hidden');

    // 02. Extract Arrays for Math
    const labHours = data.map(d => d.LabHours);
    const midtermGrades = data.map(d => d.MidtermGrade);
    const prelimGrades = data.map(d => d.PrelimGrade);
    
    // 03. Calculate Basic Stats
    const sampleSize = data.length;
    
    // Calculate Performance Change (Midterm - Prelim)
    let totalChange = 0;
    data.forEach(d => {
        totalChange += (d.MidtermGrade - d.PrelimGrade);
    });
    const avgChange = (totalChange / sampleSize).toFixed(2);

    // 04. Advanced Math: Correlation & Regression
    const correlation = calculateCorrelation(labHours, midtermGrades);
    const regression = calculateLinearRegression(labHours, midtermGrades);

    // 05. Update UI "Insight Cards"
    $('#stat-sample-size').text(sampleSize);
    $('#stat-change').text((avgChange > 0 ? "+" : "") + avgChange);
    $('#stat-correlation').text(correlation.toFixed(2));
    
    // Color code the change
    if(avgChange > 0) $('#stat-change').addClass('text-green-500');
    else $('#stat-change').addClass('text-red-500');

    // 06. Generate Insight Text
    generateInsightText(correlation, regression.slope);

    // 07. Render Visuals
    renderRegressionChart(data, regression);
    renderDistributionChart(prelimGrades, midtermGrades);
    renderCorrelationMatrix(data);
}

// --- Math Helpers ---

// Pearson Correlation Coefficient (r)
function calculateCorrelation(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = (n * sumXY) - (sumX * sumY);
    const denominator = Math.sqrt(((n * sumX2) - (sumX * sumX)) * ((n * sumY2) - (sumY * sumY)));

    return (denominator === 0) ? 0 : numerator / denominator;
}

// Simple Linear Regression (y = mx + b)
function calculateLinearRegression(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
}

// --- Chart Rendering ---

function renderRegressionChart(data, regression) {
    const ctx = document.getElementById('regressionChart').getContext('2d');
    const isDark = $('html').hasClass('dark');
    const color = isDark ? '#00B8D4' : '#1A237E';

    // Prepare Scatter Data
    const scatterPoints = data.map(d => ({ x: d.LabHours, y: d.MidtermGrade }));

    // Prepare Regression Line Data (Start and End points)
    const minX = Math.min(...data.map(d => d.LabHours));
    const maxX = Math.max(...data.map(d => d.LabHours));
    const lineData = [
        { x: minX, y: regression.slope * minX + regression.intercept },
        { x: maxX, y: regression.slope * maxX + regression.intercept }
    ];

    if (regressionChartInstance) regressionChartInstance.destroy();

    regressionChartInstance = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Student Grades',
                    data: scatterPoints,
                    backgroundColor: color + '80',
                    borderColor: color,
                    borderWidth: 1,
                    pointRadius: 5
                },
                {
                    type: 'line',
                    label: 'Trend Line',
                    data: lineData,
                    borderColor: isDark ? '#FF4081' : '#D50000', 
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0 
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: 'Weekly Lab Hours' } },
                y: { title: { display: true, text: 'Midterm Grade' }, min: 60, max: 100 }
            }
        }
    });
}

function renderDistributionChart(prelim, midterm) {
    const ctx = document.getElementById('distributionChart').getContext('2d');
    
    const ranges = ['75-79', '80-84', '85-89', '90-94', '95-100'];
    
    function getCounts(grades) {
        return [
            grades.filter(g => g >= 75 && g <= 79.9).length,
            grades.filter(g => g >= 80 && g <= 84.9).length,
            grades.filter(g => g >= 85 && g <= 89.9).length,
            grades.filter(g => g >= 90 && g <= 94.9).length,
            grades.filter(g => g >= 95).length
        ];
    }

    if (distributionChartInstance) distributionChartInstance.destroy();

    distributionChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ranges,
            datasets: [
                {
                    label: 'Preliminary',
                    data: getCounts(prelim),
                    backgroundColor: '#9CA3AF'
                },
                {
                    label: 'Midterm',
                    data: getCounts(midterm),
                    backgroundColor: '#1A237E'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function renderCorrelationMatrix(data) {
    // Only numeric columns
    const keys = ["LabHours", "HandsOn%", "PrelimGrade", "MidtermGrade"];
    let html = '<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">';
    
    // Header
    html += '<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"><tr><th class="px-6 py-3">Variable</th>';
    keys.forEach(k => html += `<th class="px-6 py-3">${k}</th>`);
    html += '</tr></thead><tbody>';

    // Rows
    keys.forEach(rowKey => {
        html += `<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"><th class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">${rowKey}</th>`;
        keys.forEach(colKey => {
            const rowData = data.map(d => d[rowKey]);
            const colData = data.map(d => d[colKey]);
            const r = calculateCorrelation(rowData, colData);
            
            // Heatmap coloring
            let colorClass = "text-gray-900";
            if (Math.abs(r) > 0.7) colorClass = "text-green-600 font-bold";
            else if (Math.abs(r) < 0.3) colorClass = "text-gray-400";
            
            html += `<td class="px-6 py-4 ${colorClass}">${r.toFixed(2)}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody></table>';

    $('#correlation-matrix-container').html(html);
}

function generateInsightText(correlation, slope) {
    const $el = $('#regression-insight');
    let strength = "";
    if (Math.abs(correlation) > 0.7) strength = "strong";
    else if (Math.abs(correlation) > 0.4) strength = "moderate";
    else strength = "weak";

    let direction = correlation > 0 ? "positive" : "negative";

    const text = `Analysis: The data suggests a ${strength} ${direction} correlation (r=${correlation.toFixed(2)}) between laboratory hours and midterm performance. For every additional hour spent in the lab, grades tend to increase by approximately ${slope.toFixed(2)} points.`;
    
    $el.text(text);
}

function updateChartsTheme(isDark) {
    // A full reload or specialized update would be needed here for perfect color syncing
    // For now, we rely on the initial load state or re-process if needed
    // Ideally, destroy and re-render charts with new colors
}