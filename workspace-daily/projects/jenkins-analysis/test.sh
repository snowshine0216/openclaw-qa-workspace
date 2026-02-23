#!/bin/bash
# Test script to verify the system setup

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "🧪 Testing Jenkins QA Monitoring System"
echo "========================================"
echo ""

# Test 1: Check folder structure
echo "✓ Test 1: Folder structure"
for dir in scripts tmp reports docs; do
    if [ -d "$dir" ]; then
        echo "  ✓ $dir/ exists"
    else
        echo "  ✗ $dir/ missing"
        exit 1
    fi
done
echo ""

# Test 2: Check scripts exist
echo "✓ Test 2: Scripts exist"
for script in webhook_server.js analyzer.sh report_generator.js md_to_docx.js feishu_uploader.sh; do
    if [ -f "scripts/$script" ]; then
        echo "  ✓ scripts/$script exists"
    else
        echo "  ✗ scripts/$script missing"
        exit 1
    fi
done
echo ""

# Test 3: Check execute permissions
echo "✓ Test 3: Execute permissions"
for script in analyzer.sh feishu_uploader.sh; do
    if [ -x "scripts/$script" ]; then
        echo "  ✓ scripts/$script is executable"
    else
        echo "  ⚠ scripts/$script not executable - fixing..."
        chmod +x "scripts/$script"
    fi
done
echo ""

# Test 4: Check Node.js dependencies
echo "✓ Test 4: Node.js dependencies"
if [ -d "scripts/node_modules" ]; then
    echo "  ✓ node_modules exists"
    if [ -d "scripts/node_modules/marked" ]; then
        echo "  ✓ marked installed"
    else
        echo "  ✗ marked not installed"
        echo "  → Run: cd scripts && npm install"
        exit 1
    fi
    if [ -d "scripts/node_modules/docx" ]; then
        echo "  ✓ docx installed"
    else
        echo "  ✗ docx not installed"
        echo "  → Run: cd scripts && npm install"
        exit 1
    fi
else
    echo "  ✗ node_modules missing"
    echo "  → Run: cd scripts && npm install"
    exit 1
fi
echo ""

# Test 5: Check .gitignore
echo "✓ Test 5: .gitignore"
if grep -q "/tmp/" .gitignore 2>/dev/null; then
    echo "  ✓ /tmp/ is gitignored"
else
    echo "  ⚠ /tmp/ not in .gitignore"
fi
if grep -q "/reports/" .gitignore 2>/dev/null; then
    echo "  ✓ /reports/ is gitignored"
else
    echo "  ⚠ /reports/ not in .gitignore"
fi
echo ""

# Test 6: Check documentation
echo "✓ Test 6: Documentation"
for doc in README.md docs/DESIGN.md docs/WEBHOOK_SETUP.md; do
    if [ -f "$doc" ]; then
        echo "  ✓ $doc exists"
    else
        echo "  ✗ $doc missing"
    fi
done
echo ""

# Test 7: Webhook server syntax check
echo "✓ Test 7: Webhook server syntax"
if node -c scripts/webhook_server.js 2>/dev/null; then
    echo "  ✓ webhook_server.js has valid syntax"
else
    echo "  ✗ webhook_server.js has syntax errors"
    exit 1
fi
echo ""

# Test 8: Report generator syntax check
echo "✓ Test 8: Report generator syntax"
if node -c scripts/report_generator.js 2>/dev/null; then
    echo "  ✓ report_generator.js has valid syntax"
else
    echo "  ✗ report_generator.js has syntax errors"
    exit 1
fi
echo ""

# Test 9: MD to DOCX converter syntax check
echo "✓ Test 9: MD to DOCX converter syntax"
if node -c scripts/md_to_docx.js 2>/dev/null; then
    echo "  ✓ md_to_docx.js has valid syntax"
else
    echo "  ✗ md_to_docx.js has syntax errors"
    exit 1
fi
echo ""

# Test 10: Analyzer script syntax check
echo "✓ Test 10: Analyzer script syntax"
if bash -n scripts/analyzer.sh 2>/dev/null; then
    echo "  ✓ analyzer.sh has valid syntax"
else
    echo "  ✗ analyzer.sh has syntax errors"
    exit 1
fi
echo ""

echo "========================================"
echo "✅ All tests passed!"
echo ""
echo "Next steps:"
echo "1. Start webhook server: node scripts/webhook_server.js"
echo "2. Configure Jenkins webhooks (see docs/WEBHOOK_SETUP.md)"
echo "3. Test with: curl -X POST http://localhost:9090/webhook ..."
echo ""
echo "Documentation:"
echo "- Architecture: docs/DESIGN.md"
echo "- Setup guide: docs/WEBHOOK_SETUP.md"
echo "- Quick start: README.md"
