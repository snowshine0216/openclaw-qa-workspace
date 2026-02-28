#!/bin/bash
# update-phase-progress.sh <family> <phase> <field> <value>
FAMILY=$1
PHASE=$2
FIELD=$3
VALUE=$4
TMP=$(mktemp)
jq ".families[\"$FAMILY\"].phases[\"$PHASE\"].progress.$FIELD = $VALUE" \
  migration/script_families.json > "$TMP" && mv "$TMP" migration/script_families.json
