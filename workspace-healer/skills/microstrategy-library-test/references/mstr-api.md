# MicroStrategy API Testing Tips

## Common API Endpoints

### Library API
- `GET /api/library`: List available content
- `GET /api/dashboards`: List dashboards
- `GET /api/dashboards/{id}`: Get dashboard details

### Analytics API
- `GET /api/analytics/{id}/data`: Get visualization data
- `POST /api/analytics/{id}/execute`: Execute report

### Authentication
- `POST /api/auth/login`: Authenticate
- `GET /api/auth/validate`: Validate session

## Testing Tips

### 1. Check Network Requests

```bash
# List all network activity
playwright-cli network
```

### 2. Mock API Responses

```bash
# Mock specific API call
playwright-cli route "/api/analytics/*" --mock=response.json
```

### 3. Wait for API Completion

```bash
# Wait for all requests to complete
playwright-cli run-code "await page.waitForLoadState('networkidle')"
```

### 4. Extract Data from API

```bash
# Run code to get response data
playwright-cli run-code "
const response = await page.waitForResponse(/\/api\/analytics/);
const data = await response.json();
console.log('Data points:', data.result?.data?.length);
"
```

## Environment-Specific URLs

### MicroStrategy Cloud
- Library: `https://microstrategy.cloud.microstrategy.com/library`
- Analytics: `https://microstrategy.cloud.microstrategy.com/analytics`

### MicroStrategy Server (On-Prem)
- Library: `http://your-server:8080/library`
- Analytics: `http://your-server:8080/analytics`

## Authentication Flow

For testing authenticated sessions:

```bash
# 1. Login first
playwright-cli open <login-url>
playwright-cli type <email_ref> "user@company.com"
playwright-cli type <password_ref> "password"
playwright-cli click <login_button_ref>

# 2. Save session
playwright-cli state-save mstr-session.json

# 3. Load in future sessions
playwright-cli state-load mstr-session.json
```

## Performance Testing

```bash
# Record trace
playwright-cli tracing-start
playwright-cli open <dashboard-url>
playwright-cli snapshot
playwright-cli tracing-stop

# Check trace file for timing
```

## Error Handling

```bash
# Capture console errors
playwright-cli console error

# Run code to check for errors
playwright-cli run-code "
const errors = [];
page.on('console', msg => {
  if (msg.type() === 'error') errors.push(msg.text());
});
console.log('Errors:', errors.length);
"
```
