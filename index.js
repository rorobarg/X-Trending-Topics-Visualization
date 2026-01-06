// ============================================
// X/Twitter Trending Topics Visualization
// ============================================

// Update page title with current date
const dateElement = document.getElementById('date');
const currentDate = new Date();
const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
dateElement.innerHTML = currentDate.toLocaleDateString('en-US', dateOptions);

// ============================================
// Fetch Trending Topics from API
// ============================================

const API_URL = 'https://twitter-trends5.p.rapidapi.com/twitter/request.php';
const PHILIPPINES_WOEID = '23424934'; // Where On Earth ID for Philippines

// WARNING: API key should be stored securely (environment variables or backend)
const API_KEY = 'f4ec97fc3cmsh39ee798645e3932p114fd8jsnfab9506728c4';

const formData = new FormData();
formData.append('woeid', PHILIPPINES_WOEID);

const requestOptions = {
	method: 'POST',
	headers: {
		'x-rapidapi-key': API_KEY,
		'x-rapidapi-host': 'twitter-trends5.p.rapidapi.com'
	},
	body: formData
};

// Fetch trending topics and create chart
fetch(API_URL, requestOptions)
	.then(response => {
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	})
	.then(data => {
		// Extract top 25 trending topics
		const graphData = data.trends.slice(0, 25).map(trend => ({
			name: trend.name,
			volume: trend.volume || 0
		}));

		// Separate topics and volumes for chart
		const topics = graphData.map(item => item.name);
		const volumes = graphData.map(item => item.volume);

		// Create the chart
		createTrendingChart(topics, volumes);
	})
	.catch(error => {
		console.error('Error fetching trending topics:', error);
		displayErrorMessage();
	});

// ============================================
// Chart Creation
// ============================================

function createTrendingChart(topics, volumes) {
	const chartElement = document.getElementById('myChart');
	
	new Chart(chartElement, {
		type: 'bar',
		data: {
			labels: topics,
			datasets: [{
				label: '# of Tweets/Posts',
				data: volumes,
				borderWidth: 2,
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(255, 159, 64, 0.2)',
					'rgba(255, 205, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					'rgba(201, 203, 207, 0.2)'
				],
				borderColor: [
					'rgb(255, 99, 132)',
					'rgb(255, 159, 64)',
					'rgb(255, 205, 86)',
					'rgb(75, 192, 192)',
					'rgb(54, 162, 235)',
					'rgb(153, 102, 255)',
					'rgb(201, 203, 207)'
				],
				hoverBackgroundColor: [
					'rgb(255, 99, 132)',
					'rgb(255, 159, 64)',
					'rgb(255, 205, 86)',
					'rgb(75, 192, 192)',
					'rgb(54, 162, 235)',
					'rgb(153, 102, 255)',
					'rgb(201, 203, 207)'
				]
			}]
		},
		options: {
			indexAxis: 'y', // Horizontal bars
			responsive: true,
			maintainAspectRatio: true,
			scales: {
				x: {
					beginAtZero: true,
					ticks: {
						color: '#fff'
					},
					grid: {
						color: 'rgba(255, 255, 255, 0.1)'
					}
				},
				y: {
					ticks: {
						color: '#fff'
					},
					grid: {
						color: 'rgba(255, 255, 255, 0.1)'
					}
				}
			},
			plugins: {
				legend: {
					labels: {
						color: '#fff'
					}
				}
			}
		}
	});
}

// ============================================
// Error Handling
// ============================================

function displayErrorMessage() {
	const chartElement = document.getElementById('myChart');
	const errorDiv = document.createElement('div');
	errorDiv.className = 'alert alert-danger text-center';
	errorDiv.textContent = 'Unable to load trending topics. Please try again later.';
	chartElement.parentElement.insertBefore(errorDiv, chartElement);
}