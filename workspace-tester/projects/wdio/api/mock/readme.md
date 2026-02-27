## usage of mock-network-throttle.js

### mock network throttling

```javascript
// Basic usage - add 3 second delay to all API calls
await mockRequestSpeed({
    urlPattern: '**/api/**',
    delay: 3000
});

// Mock different API tiers
await mockApiSpeedTiers({
    slowDelay: 8000,    // Heavy operations
    mediumDelay: 4000,  // Moderate operations  
    fastDelay: 1000     // Light operations
});

// Use network throttling presets
// Supports presets like 'Regular 3G', 'Slow 3G', 'Fast 3G', 'Offline'
await mockNetworkThrottling('Slow 3G');

// Progressive delays for testing degradation
await mockProgressiveRequestSpeed({
    urlPattern: '**/api/data/**',
    initialDelay: 1000,
    delayIncrement: 500,
    maxDelay: 10000
});

// clean up
await restoreRequestSpeedMocks();


```
