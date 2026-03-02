export function generateInstanceName(
    botVariantName,
    botVariantImpl,
    isDefaultVariant,
    languageName,
    isDefaultLanguage
) {
    if (isDefaultVariant && isDefaultLanguage) {
        return null;
    }

    // If botVariantImpl exists, include it in parentheses
    const variantDisplayName = botVariantImpl ? `${botVariantName} (${botVariantImpl})` : botVariantName;
    return `${variantDisplayName}, ${languageName}`;
}

export function generateTestSuiteName(
    botGroupName,
    botVariantName,
    botVariantImpl,
    isDefaultVariant,
    languageName,
    isDefaultLanguage
) {
    const instanceName = generateInstanceName(
        botVariantName,
        botVariantImpl,
        isDefaultVariant,
        languageName,
        isDefaultLanguage
    );

    if (instanceName === null) {
        return botGroupName;
    }

    return `${botGroupName} [${instanceName}]`;
}

export function generateUniqueTestSuiteName(
    botGroupName,
    botVariantName,
    botVariantImpl,
    isDefaultVariant,
    languageName,
    isDefaultLanguage,
    usedNames
) {
    const baseName = generateTestSuiteName(
        botGroupName,
        botVariantName,
        botVariantImpl,
        isDefaultVariant,
        languageName,
        isDefaultLanguage
    );

    // If botVariantImpl exists, the name is already unique (impl is unique per bot)
    // No need to add numeric suffix
    if (botVariantImpl) {
        return baseName;
    }

    // For bots without impl, use the numbering logic
    if (!usedNames.has(baseName)) {
        usedNames.set(baseName, 1);
        return baseName;
    }

    // Name collision detected, append numeric suffix at the end
    const count = usedNames.get(baseName);
    usedNames.set(baseName, count + 1);

    // Always append suffix after the entire name: "BotGroup [Variant, Language] 2" or "BotGroup 2"
    return `${baseName} ${count + 1}`;
}

export function generateTestCaseInstanceName(testCaseName, instanceName) {
    if (instanceName === null) {
        return testCaseName;
    }

    return `${testCaseName} [${instanceName}]`;
}
