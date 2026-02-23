#!/bin/bash
# Feishu Uploader - Uploads DOCX file to Feishu chat
# Usage: bash feishu_uploader.sh <file_path>

set -e

FILE_PATH="$1"
CHAT_ID="oc_f15b73b877ad243886efaa1e99018807"

if [ ! -f "$FILE_PATH" ]; then
    echo "✗ Error: File not found: $FILE_PATH"
    exit 1
fi

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

log "Uploading to Feishu: $FILE_PATH"

# Get Feishu credentials from OpenClaw config
FEISHU_APP_ID=$(grep -A 20 '"feishu"' ~/.openclaw/openclaw.json | grep '"appId"' | sed 's/.*": "//;s/".*//')
FEISHU_APP_SECRET=$(grep -A 20 '"feishu"' ~/.openclaw/openclaw.json | grep '"appSecret"' | sed 's/.*": "//;s/".*//')

if [ -z "$FEISHU_APP_ID" ] || [ -z "$FEISHU_APP_SECRET" ]; then
    log "✗ Error: Feishu credentials not found in openclaw.json"
    exit 1
fi

# Get tenant access token
log "Getting Feishu access token..."
TOKEN_RESPONSE=$(curl -s -X POST "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal" \
    -H "Content-Type: application/json" \
    -d "{\"app_id\":\"$FEISHU_APP_ID\",\"app_secret\":\"$FEISHU_APP_SECRET\"}")

ACCESS_TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.tenant_access_token')

if [ -z "$ACCESS_TOKEN" ] || [ "$ACCESS_TOKEN" = "null" ]; then
    log "✗ Error: Failed to get access token"
    echo "$TOKEN_RESPONSE" | jq .
    exit 1
fi

log "✓ Access token obtained"

# Upload file
log "Uploading file..."
FILE_NAME=$(basename "$FILE_PATH")

UPLOAD_RESPONSE=$(curl -s -X POST "https://open.feishu.cn/open-apis/im/v1/files" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -F "file_type=stream" \
    -F "file_name=$FILE_NAME" \
    -F "file=@$FILE_PATH")

FILE_KEY=$(echo "$UPLOAD_RESPONSE" | jq -r '.data.file_key')

if [ -z "$FILE_KEY" ] || [ "$FILE_KEY" = "null" ]; then
    log "✗ Error: File upload failed"
    echo "$UPLOAD_RESPONSE" | jq .
    exit 1
fi

log "✓ File uploaded (file_key: $FILE_KEY)"

# Send message with file attachment
log "Sending message to chat..."

MESSAGE_PAYLOAD=$(cat <<EOF
{
  "receive_id": "$CHAT_ID",
  "msg_type": "file",
  "content": "{\"file_key\":\"$FILE_KEY\"}"
}
EOF
)

SEND_RESPONSE=$(curl -s -X POST "https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=chat_id" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$MESSAGE_PAYLOAD")

MESSAGE_ID=$(echo "$SEND_RESPONSE" | jq -r '.data.message_id')

if [ -z "$MESSAGE_ID" ] || [ "$MESSAGE_ID" = "null" ]; then
    log "✗ Error: Message send failed"
    echo "$SEND_RESPONSE" | jq .
    exit 1
fi

log "✓ Message sent successfully (message_id: $MESSAGE_ID)"
log "✓ Report delivered to Feishu chat: $CHAT_ID"

exit 0
