import _ from 'lodash';

export function randomString(length) {
    length = length || 32;
    var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
        a = t.length,
        n = '';
    for (let i = 0; i < length; i++) {
        n += t.charAt(Math.floor(Math.random() * a));
    }
    return n;
}

//v1, 21.12, original custom app
export let customizedItems2112 = {
    my_content: true,
    subscriptions: true,
    new_dossier: true,
    edit_dossier: true,
    add_library_server: true,
    data_search: true,
    hyper_intelligence: true,
    font_size: true,
    undo_and_redo: true,
};

//v2, 22.12, add customized email
export function getEmailBody({ enabled, hostPortal, emailAddress }) {
    let emailBody = {
        emailSettings: {
            brandingImage: {
                url: '',
            },
            button: {
                browserButtonStyle: {
                    backgroundColor: '#3492ed',
                    fontColor: '#ffffff',
                    text: 'View in Browser',
                },
                description:
                    '’View in Mobile App‘ may not work for all mobile mail apps. Use ‘View in Browser’ option for such cases.',
                mobileButtonLinkType: 'DEFAULT',
                mobileButtonScheme: 'dossier',
                mobileButtonStyle: {
                    backgroundColor: '#3492ed',
                    fontColor: '#ffffff',
                    text: 'View in Mobile App',
                },
            },
            content: {
                MEMBER_ADDED: {
                    body: 'Hi, {&RecipientName}!\n{&SenderName} invited you to a discussion in a dossier.',
                    subject: 'You have been invited to a discussion',
                },
                SHARE_BOOKMARK: {
                    body: 'Hi, {&RecipientName}!\n{&SenderName} shared {&DossierName} and {&BookmarkCount} bookmark with you.',
                    subject: 'You have been invited to view {&DossierName} with share',
                },
                SHARE_DOSSIER: {
                    body: 'Hi, {&RecipientName}!\n{&SenderName} shared {&DossierName} with you.',
                    subject: 'You have been invited to view {&DossierName}',
                },
                USER_MENTION: {
                    body: 'Hi, {&RecipientName}!\n{&SenderName} mentioned you in a comment in {&DossierName}.',
                    subject: 'You have been mentioned in a {&MentionTarget}',
                },
            },
            enabled,
            hostPortal,
            reminder: {
                linkText: 'View Notification Center',
                text: 'Since you last checked, {&NewNotificationCount} notification has been sent to you.',
            },
            sender: {
                address: emailAddress,
                displayName: 'MicroStrategy Library',
            },
            sentByText: '',
            showBrandingImage: true,
            showBrowserButton: true,
            showButtonDescription: true,
            showMobileButton: true,
            showReminder: true,
            showSentBy: true,
            showSentByInfo: true,
            showSocialMedia: true,
            showSubscription: true,
            socialMedia: {
                facebookLink: 'google',
                linkedInLink: 'google',
                showFacebook: true,
                showLinkedIn: true,
                showTwitter: true,
                showYouTube: true,
                twitterLink: 'google',
                youTubeLink: 'google',
            },
        },
    };
    return emailBody;
}

//v3, 23.06, add some granular control
export let customizedItems2306 = {
    my_content: true,
    subscriptions: true,
    new_dossier: true,
    edit_dossier: true,
    add_library_server: true,
    data_search: true,
    hyper_intelligence: true,
    font_size: true,
    undo_and_redo: true,
    insights: true,
    content_discovery: true,
    mobile_account_panel_user_name: true,
    mobile_account_panel_preferences_my_language: true,
    mobile_account_panel_preferences_my_time_zone: true,
    mobile_account_panel_preferences_face_id_login: true,
    mobile_account_panel_preferences_take_a_tour: true,
    mobile_account_panel_preferences_refresh_view_automatically: true,
    mobile_account_panel_preferences_smart_download: true,
    mobile_account_panel_preferences_automatically_add_to_library: true,
    mobile_account_panel_advanced_settings_app_settings: true,
    mobile_account_panel_advanced_settings_security_settings: true,
    mobile_account_panel_advanced_settings_logging: true,
    mobile_account_panel_help_and_legal: true,
    mobile_account_panel_help_and_legal_help: true,
    mobile_account_panel_help_and_legal_legal: true,
    mobile_account_panel_help_and_legal_report_a_problem: true,
    mobile_account_panel_log_out: true,
    filter_summary: true,
    share_panel_share: true,
    share_panel_export_to_excel: true,
    share_panel_export_to_pdf: true,
    share_panel_download: true,
    share_panel_subscribe: true,
    share_panel_annotate_and_share: true,
    web_account_panel_user_name: true,
    web_account_panel_my_library: true,
    web_account_panel_manage_library: true,
    web_account_panel_preference: true,
    web_account_panel_preference_my_language: true,
    web_account_panel_preference_my_time_zone: true,
    web_account_panel_switch_workspace: true,
    web_account_panel_take_a_tour: true,
    web_account_panel_help: true,
    web_account_panel_log_out: true,
    mobile_downloads: true,
    table_of_contents_header: true,
    table_of_contents_content_info: true,
    table_of_contents_chapter_and_page: true,
    switch_library_server: true,
    create_new_content_dossier: true,
    create_new_content_report: true,
    content_info_content_creator: true,
    content_info_timestamp: true,
    content_info_info_window: true,
    control_filter_summary: true,
    hide_filter_summary: false,
};

//v3, 23.06, granular control, customize help and legal link
export let customizedItemProperties2306 = {
    mobile_account_panel_help_and_legal_legal: {
        link_name: 'Legal',
        address: '',
    },
    mobile_account_panel_help_and_legal_help: {
        link_name: 'Help',
        address: '',
    },
    web_account_panel_help: {
        link_name: 'Help',
        address: '',
    },
};

//v4, 23.09, add pin feature
export let customizedItems2309 = {
    ...customizedItems2306,
    // newly added properties in F38343
    table_of_contents_unpin: true,
    table_of_contents_allow_close: true,
    filter_panel_unpin: true,
    filter_panel_allow_close: true,
    comments_panel_unpin: true,
    comments_panel_allow_close: true,
    sidebars_unpin: true,
    filter_panel: true,
    ai_assistant_unpin: true,
    ai_assistant_allow_close: true,
};

//v4, 23.09, pin feature, customize filter position
export let customizedItemProperties2309 = {
    mobile_account_panel_help_and_legal_legal: {
        link_name: 'Legal',
        address: '',
    },
    mobile_account_panel_help_and_legal_help: {
        link_name: 'Help',
        address: '',
    },
    web_account_panel_help: {
        link_name: 'Help',
        address: '',
    },
    filter_panel: {
        panel_position: 'right',
    },
};

//v5, bot, 23.12
export let customizedItems2312 = {
    ...customizedItems2309,
    bot_window_share_panel: true,
    bot_window_share_panel_share_bot: true,
    bot_window_share_panel_embed_bot: true,
    bot_window_share_panel_manage_access: true,
    bot_window_edit_bot: true,
    share_panel_manage_access: true,
    create_new_content_bot: true,
};

// v1: original custom app
// v2: customized email
// v3: granular control, help and legal link
// v4: pin, filter position
// v5: bot
export function getCustomizedItems(version) {
    let customizedItems;
    if (version === 'v1' || version === 'v2') {
        customizedItems = _.cloneDeep(customizedItems2112);
    } else if (version === 'v3') {
        customizedItems = _.cloneDeep(customizedItems2306);
    } else if (version === 'v4') {
        customizedItems = _.cloneDeep(customizedItems2309);
    } else if (version === 'v5') {
        customizedItems = _.cloneDeep(customizedItems2312);
    } else {
        console.log('Error: correct version is required in getCustomizedItems');
    }
    return customizedItems;
}

export function getCustomizedItemProperties(version) {
    let customizedItemProperties;
    if (version === 'v3') {
        customizedItemProperties = _.cloneDeep(customizedItemProperties2306);
    } else if (version === 'v4' || version === 'v5') {
        customizedItemProperties = _.cloneDeep(customizedItemProperties2309);
    } else {
        console.log('Error: correct version is required in getCustomizedItemProperties');
    }
    return customizedItemProperties;
}

// Example to create custom app:
//
// 1.[optional] customize items
// let customizedItemsAccountUserName = getCustomizedItems('v3');
// customizedItemsAccountUserName.web_account_panel_user_name = false;
// let customizedFilterPanel = getCustomizedItemProperties('v4');
// customizedFilterPanel.filter_panel = {
//     panel_position: 'left',
// };
//
// 2. create custom app body
// export const disableAccountUserName = getCustomAppBody({
//     version: 'v3',
//     name: 'auto_disableAccountUserName',
//     customizedItems: customizedItemsAccountUserName,
//     customizedItemProperties: customizedFilterPanel,
// });
//
// 3. create custom app
// customAppIdDisableAccountUserName = await createCustomApp({
//     credentials: consts.mstrUser.credentials,
//     customAppInfo: consts.disableAccountUserName,
// });

// v1: original custom app
// v2: customized email
// v3: granular control, help and legal link
// v4: pin, filter position
// v5: bot
export function getCustomAppBody({
    version,
    name,
    toolbarMode = 0,
    toolbarEnabled = true,
    dossierMode = 0,
    url = '',
    iconsHomeLibrary = ['sidebars', 'sort_and_filter', 'search', 'notifications', 'multi_select', 'options'],
    sidebarsHomeLibrary = ['all', 'favorites', 'recents', 'default_groups', 'my_groups', 'options'],
    iconsHomeDocument = [
        'table_of_contents',
        'bookmarks',
        'reset',
        'filters',
        'comments',
        'share',
        'notifications',
        'options',
    ],
    contentBundleIds = [],
    defaultGroupsName = 'Default Groups',
    showAllContents = false,
    applicationPalettes = [],
    applicationDefaultPalette = '',
    useConfigPalettes = false,
    isDefault = false,
    homeDocumentType = 'dossier',
    enabled = false,
    hostPortal = '',
    emailAddress = 'xuyin@microstrategy.com',
    customizedItems,
    customizedItemProperties,
    applicationNuggets = [],
    systemStatus = {
        enabled: false,
        range: 'all_screen',
        enableTopContent: false,
        topContent: '',
        enableBottomContent: false,
        bottomContent: '',
        allowClose: false,
        topContentBackgroundColor: '#FFFFFF',
        bottomContentBackgroundColor: '#FFFFFF',
    },
    aiSettings = {
        feedback: true,
        learning: true,
        disclaimer: '',
    },
    theme = {},
    applicationDefaultFont = '',
}) {
    let originalCustomAppBody = {
        name: name + '_' + randomString(6),
        description: '',
        platforms: ['mobile', 'web', 'desktop'],
        objectNames: [],
        objectAcl: [],
        homeScreen: {
            mode: dossierMode,
            homeLibrary: {
                icons: iconsHomeLibrary,
                sidebars: sidebarsHomeLibrary,
                contentBundleIds,
                showAllContents,
                defaultGroupsName,
                toolbarMode,
                toolbarEnabled,
                customizedItems: {
                    my_content: true,
                    subscriptions: true,
                    new_dossier: true,
                    edit_dossier: true,
                    add_library_server: true,
                    data_search: true,
                    hyper_intelligence: true,
                    font_size: true,
                    undo_and_redo: true,
                },
            },
            homeDocument: {
                url,
                icons: iconsHomeDocument,
                homeDocumentType,
                toolbarMode,
                toolbarEnabled,
            },
            theme: theme,
        },
        general: {
            disableAdvancedSettings: false,
            disablePreferences: false,
            networkTimeout: 180,
            cacheClearMode: 1,
            clearCacheOnLogout: false,
            maxLogSize: 500,
            logLevel: 12,
            updateInterval: 30,
        },
        applicationPalettes,
        applicationDefaultPalette,
        isDefault,
        systemStatus: systemStatus,
    };
    if (applicationPalettes.length > 0) {
        originalCustomAppBody.useConfigPalettes = useConfigPalettes;
        originalCustomAppBody.applicationDefaultPalette = applicationDefaultPalette;
    }
    let customAppBody, emailBody;
    if (version === 'v1') {
        originalCustomAppBody.homeScreen.homeLibrary.customizedItems =
            customizedItems || _.cloneDeep(customizedItems2112);
        customAppBody = originalCustomAppBody;
    } else {
        emailBody = getEmailBody({ enabled, hostPortal, emailAddress });
        if (version === 'v2') {
            originalCustomAppBody.homeScreen.homeLibrary.customizedItems =
                customizedItems || _.cloneDeep(customizedItems2112);
        } else if (version === 'v3') {
            originalCustomAppBody.homeScreen.homeLibrary.customizedItems =
                customizedItems || _.cloneDeep(customizedItems2306);
            originalCustomAppBody.homeScreen.homeLibrary.customizedItemProperties =
                customizedItemProperties || _.cloneDeep(customizedItemProperties2306);
        } else if (version === 'v4') {
            originalCustomAppBody.homeScreen.homeLibrary.customizedItems =
                customizedItems || _.cloneDeep(customizedItems2309);
            originalCustomAppBody.homeScreen.homeLibrary.customizedItemProperties =
                customizedItemProperties || _.cloneDeep(customizedItemProperties2309);
        } else if (version === 'v5') {
            originalCustomAppBody.homeScreen.homeLibrary.customizedItems =
                customizedItems || _.cloneDeep(customizedItems2312);
            originalCustomAppBody.homeScreen.homeLibrary.customizedItemProperties =
                customizedItemProperties || _.cloneDeep(customizedItemProperties2309);
            originalCustomAppBody.homeScreen.contentType = {
                dossier: true,
                document: true,
                report: true,
                bot: true,
            };
        } else if (version === 'v6') {
            originalCustomAppBody.homeScreen.homeLibrary.customizedItems =
                customizedItems || _.cloneDeep(customizedItems2312);
            originalCustomAppBody.homeScreen.homeLibrary.customizedItemProperties =
                customizedItemProperties || _.cloneDeep(customizedItemProperties2309);
            originalCustomAppBody.homeScreen.contentType = {
                dossier: true,
                document: true,
                report: true,
                bot: true,
            };
            originalCustomAppBody.applicationNuggets = applicationNuggets;
            originalCustomAppBody.aiSettings = aiSettings;
        } else if (version === 'v7') {
            originalCustomAppBody.homeScreen.homeLibrary.customizedItems =
                customizedItems || _.cloneDeep(customizedItems2312);
            originalCustomAppBody.homeScreen.homeLibrary.customizedItemProperties =
                customizedItemProperties || _.cloneDeep(customizedItemProperties2309);
            originalCustomAppBody.applicationDefaultFont = applicationDefaultFont;
        } else {
            console.log('Error: correct version is required in getCustomAppBody');
        }
        customAppBody = Object.assign(originalCustomAppBody, emailBody);
    }
    return customAppBody;
}

export const customEmailDefaultSettingsOnlyEnabled = {
    enabled: true,
    hostPortal: '',
    showBrandingImage: true,
    showBrowserButton: true,
    showMobileButton: true,
    showReminder: true,
    showSubscriptionReminder: true,
    showSentBy: true,
    sentByText: 'Strategy',
    showSocialMedia: true,
    isSubscriptionTemplateUpgraded: true,
};
