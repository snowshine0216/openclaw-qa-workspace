# opeclaw-qa-workspace

## Setup Requirements

### .env setup
- copy .env.example and update the placeholder value
### Jira setup
1. Skills needed: jira-cli
2. instal jira-cli for mac os; (for other os, [please refer to github] (https://github.com/ankitpokhrel/jira-cli/wiki/Installation))
``` bash
brew tap ankitpokhrel/jira-cli
brew install jira-cli
```
3. jira token installation
- [for self usage](https://github.com/ankitpokhrel/jira-cli)
- for project purpose. add below to .env file
```bash
JIRA_API_TOKEN=<jira-api-token>
JIRA_BASE_URL=<jira-base-url>
```
- [to refresh your token](https://id.atlassian.com/manage-profile/security/api-tokens)

4. run `jira init` to setup environment

### Confluence Setup
1. Skills needed: confluence-cli
2. instal confluence-cli for mac os; (for other os, [please refer to github] (https://github.com/pchuri/confluence-cli))
``` bash
npm install -g confluence-cli
```
3. run `confluence init` to setup environment
