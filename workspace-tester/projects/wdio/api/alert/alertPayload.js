export default async function getAlertPayload({ bookmarkId, credentials, recipient }) {
    let alertPayload = {
        multipleContents: true,
        allowUnsubscribe: true,
        allowDeliveryChanges: false,
        editable: false,
        sendNow: true,
        name: 'Alert_Created_By_API',
        schedules: [
            {
                id: '3450AE6F4E29E9A6E1075DA93B7062AA',
            },
        ],
        contents: [
            {
                id: '3D5AD91611E8285C3D690080EFA5ACC6',
                type: 'dossier',
                personalization: {
                    compressed: false,
                    formatMode: 'ALL_PAGES',
                    viewMode: 'BOTH',
                    formatType: 'EXCEL',
                    nodeKeys: ['WFC3676E000604A18B63CFA3124AAAF24'],
                    contentModes: ['bookmark'],
                    bookmarkIds: [bookmarkId],
                    exportToPdfSettings: null,
                    exportToExcelSettings: {
                        includeFilter: false,
                        sheet: {
                            content: {
                                level: 'page',
                            },
                        },
                    },
                },
                alertActions: [
                    {
                        act: 'updateTemplate',
                        keyContext: 'W336',
                        actions: [
                            {
                                act: 'threshold',
                                nodeKey: 'W336',
                                thresholds: [
                                    {
                                        n: 'threshold 0',
                                        scope: 1,
                                        rtp: 2,
                                        rtxt: '',
                                        expr: '<exp><nd et="14" fn="19"><nds><nd fn="8" fnt="1" et="10"><m n="Amount ($K)" did="486E5EFCCC4AB22E5C9474861B20DBB9" t="4"></m><cs><c v="0" dtp="3"></c></cs></nd></nds></nd></exp>',
                                        fmt: {
                                            FormattingAppearance: {
                                                Visible: -1,
                                            },
                                            FormattingNumber: {
                                                ThousandSeparator: 0,
                                            },
                                            FormattingFont: {
                                                Color: 255,
                                            },
                                        },
                                    },
                                ],
                                thresholdType: -1,
                                basedOnId: '486E5EFCCC4AB22E5C9474861B20DBB9',
                                did: '486E5EFCCC4AB22E5C9474861B20DBB9',
                                objType: 4,
                            },
                        ],
                    },
                ],
            },
        ],
        owner: {
            id: credentials.id,
        },
        recipients: [
            {
                id: recipient.id,
                type: 'user',
            },
        ],
        delivery: {
            mode: 'EMAIL',
            email: {
                subject: 'Financial Analysis 01/16/2025 11:25 AM',
                message: '',
                sendContentAs: 'data',
                overwriteOlderVersion: true,
            },
            applicationId: 'C2B2023642F6753A2EF159A75E0CFF29',
        },
    };
    return alertPayload;
}
