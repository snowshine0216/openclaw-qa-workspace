#!/bin/bash

# Chrome 和 ChromeDriver 版本检查脚本
# 用于快速诊断版本兼容性问题

echo "🔍 Chrome & ChromeDriver 版本检查"
echo "================================"

# 检查 Chrome 版本
echo "📱 Chrome 版本:"
if command -v google-chrome &> /dev/null; then
    CHROME_VERSION=$(google-chrome --version 2>/dev/null)
    echo "   $CHROME_VERSION"
elif command -v google-chrome-stable &> /dev/null; then
    CHROME_VERSION=$(google-chrome-stable --version 2>/dev/null)
    echo "   $CHROME_VERSION"
elif [[ "$OSTYPE" == "darwin"* ]] && [[ -f "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ]]; then
    CHROME_VERSION=$("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --version 2>/dev/null)
    echo "   $CHROME_VERSION"
else
    echo "   ❌ Chrome 未找到"
    CHROME_VERSION=""
fi

# 检查 ChromeDriver 版本
echo ""
echo "🛠️  ChromeDriver 版本:"
if command -v chromedriver &> /dev/null; then
    CHROMEDRIVER_VERSION=$(chromedriver --version 2>/dev/null)
    echo "   $CHROMEDRIVER_VERSION"
else
    echo "   ❌ ChromeDriver 未找到"
    CHROMEDRIVER_VERSION=""
fi

# 版本兼容性分析
echo ""
echo "🔍 兼容性分析:"

if [[ $CHROME_VERSION == *"139."* ]]; then
    echo "   ⚠️  检测到 Chrome 139.x - 这是问题高发版本！"
    echo "   📋 建议操作:"
    echo "      1. 使用提供的增强 WebDriverIO 配置"
    echo "      2. 确保 ChromeDriver 版本匹配 (139.x)"
    echo "      3. 考虑暂时降级到 Chrome 138.x"
elif [[ $CHROME_VERSION == *"138."* ]]; then
    echo "   ✅ Chrome 138.x - 相对稳定的版本"
elif [[ $CHROME_VERSION == *"137."* ]] || [[ $CHROME_VERSION == *"136."* ]]; then
    echo "   ✅ Chrome 137.x/136.x - 推荐版本，较少问题"
else
    echo "   ❓ 无法确定版本兼容性"
fi

# 检查版本匹配
if [[ -n "$CHROME_VERSION" ]] && [[ -n "$CHROMEDRIVER_VERSION" ]]; then
    CHROME_MAJOR=$(echo "$CHROME_VERSION" | grep -oE '[0-9]+' | head -1)
    CHROMEDRIVER_MAJOR=$(echo "$CHROMEDRIVER_VERSION" | grep -oE '[0-9]+' | head -1)
    
    echo ""
    echo "🔗 版本匹配检查:"
    if [[ "$CHROME_MAJOR" == "$CHROMEDRIVER_MAJOR" ]]; then
        echo "   ✅ Chrome $CHROME_MAJOR 与 ChromeDriver $CHROMEDRIVER_MAJOR 版本匹配"
    else
        echo "   ❌ 版本不匹配! Chrome $CHROME_MAJOR vs ChromeDriver $CHROMEDRIVER_MAJOR"
        echo "   📋 建议: npm install chromedriver@^${CHROME_MAJOR}.0.0"
    fi
fi

# 环境变量检查
echo ""
echo "🌍 环境变量检查:"
echo "   HEADLESS: ${HEADLESS:-未设置}"
echo "   MAX_INSTANCES: ${MAX_INSTANCES:-未设置}"
echo "   CI: ${CI:-未设置}"

# CI 环境检测
if [[ "$CI" == "true" ]] || [[ -n "$JENKINS_URL" ]] || [[ -n "$GITHUB_ACTIONS" ]]; then
    echo ""
    echo "🏗️  CI 环境检测: ✅"
    echo "   📋 CI 环境建议:"
    echo "      • 设置 HEADLESS=true"
    echo "      • 设置 MAX_INSTANCES=1"
    echo "      • 使用唯一的用户数据目录"
    echo "      • 增加重试次数"
fi

echo ""
echo "✅ 检查完成"
echo ""
echo "🔧 如果遇到问题，请参考:"
echo "   • CHROME_CONFIG_OPTIMIZATION.md"
echo "   • node scripts/checkChromeCompatibility.js"
