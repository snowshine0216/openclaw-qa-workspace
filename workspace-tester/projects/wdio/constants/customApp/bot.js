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
export let customizedItems_2309 = {
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

export let customizedItems_2312 = {
    ...customizedItems_2309,
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
    //newly added properties in Fxxx
    bot_window_edit_bot: true,
    create_new_content_bot: true,
    bot_window_share_panel: true,
    bot_window_share_panel_embed_bot: true,
    bot_window_share_panel_share_bot: true,
};

export let customizedItemProperties_detail = {};

export function getCustomizedItems({ enable_bot_window_edit_bot = true, enable_create_new_content_bot = true }) {
    let specify_customizedItems = {
        ...customizedItems_2312,
        bot_window_edit_bot: enable_bot_window_edit_bot,
        create_new_content_bot: enable_create_new_content_bot,
    };
    return specify_customizedItems;
}

export function getRequestBody({
    name,
    customizedItems = customizedItems_2312,
    customizedItemProperties = customizedItemProperties_detail,
    toolbarMode = 0,
    toolbarEnabled = true,
    dossierMode = 0,
    url = '',
    useConfigPalettes = false,
    applicationPalettes = [],
    applicationDefaultPalette = '',
    useColorTheme = false,
    selectedTheme = {},
    disclaimer,
    feedback,
    learning,
    availableModes = [],
    defaultMode = 0,
}) {
    let libraryAsHome = {
        name: name + '_' + randomString(6),
        description: '',
        platforms: ['mobile', 'web', 'desktop'],
        objectNames: [],
        objectAcl: [],
        homeScreen: {
            contentType: {
                dossier: true,
                document: true,
                report: true,
                bot: true,
            },
            mode: dossierMode,
            homeLibrary: {
                icons: ['sidebars', 'sort_and_filter', 'search', 'notifications', 'multi_select', 'options'],
                sidebars: ['all', 'favorites', 'recents', 'default_groups', 'my_groups', 'options'],
                customizedItems: customizedItems,
                customizedItemProperties: customizedItemProperties,
                contentBundleIds: [],
                showAllContents: false,
                defaultGroupsName: 'Default Groups',
                toolbarMode: toolbarMode,
                toolbarEnabled: toolbarEnabled,
            },
            homeDocument: {
                url: url,
                icons: ['table_of_contents', 'bookmarks', 'reset', 'filters', 'comments', 'share'],
                toolbarMode: toolbarMode,
                toolbarEnabled: toolbarEnabled,
            },
            theme: {},
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
        useConfigPalettes: false,
        applicationPalettes: [],
        isDefault: false,
        aiSettings: {
            disclaimer,
            feedback,
            learning,
        },
        emailSettings: {
            enabled: false,
            hostPortal: '',
            showBrandingImage: true,
            showBrowserButton: true,
            showMobileButton: true,
            showReminder: true,
            showSentBy: true,
            sentByText: 'MicroStrategy Inc.',
            showSocialMedia: true,
            content: {
                SHARE_DOSSIER: {
                    subject: 'You have been invited to view {&DossierName} in your library',
                    body: 'Hi, {&RecipientName}! \r\n {&SenderName} shared {&DossierName} with you.',
                },
                SHARE_BOOKMARK: {
                    subject: 'You have been invited to view {&DossierName} with shared bookmarks in your library',
                    body: 'Hi, {&RecipientName}! \r\n {&SenderName} shared {&DossierName} and {&BookmarkCount} bookmark with you.',
                },
                MEMBER_ADDED: {
                    subject: 'You have been invited to a discussion',
                    body: 'Hi, {&RecipientName}! \r\n {&SenderName} invited you to a discussion in a dossier.',
                },
                USER_MENTION: {
                    subject: 'You have been mentioned in a {&MentionTarget}',
                    body: 'Hi, {&RecipientName}! \r\n {&SenderName} mentioned you in a comment in {&DossierName}.',
                },
            },
            showButtonDescription: true,
            sender: {
                displayName: 'MicroStrategy Library',
                address: 'library@microstrategy.com',
            },
            brandingImage: {
                url: '',
            },
            button: {
                browserButtonStyle: {
                    backgroundColor: '#3492ed',
                    fontColor: '#ffffff',
                    text: 'View in Browser',
                },
                mobileButtonStyle: {
                    backgroundColor: '#3492ed',
                    fontColor: '#ffffff',
                    text: 'View in Mobile App',
                },
                mobileButtonScheme: 'dossier',
                mobileButtonLinkType: 'DEFAULT',
                description:
                    "'View in Mobile App' may not work for all mobile mail apps. Use 'View in Browser' option for such cases.",
            },
            reminder: {
                text: 'Since you last checked, {&NewNotificationCount} notification has been sent to you.',
                linkText: 'View Notification Center',
            },
            socialMedia: {
                showFacebook: true,
                facebookLink: 'microstrategy',
                showTwitter: true,
                twitterLink: 'microstrategy',
                showLinkedIn: true,
                linkedInLink: 'microstrategy',
                showYouTube: true,
                youTubeLink: 'microstrategy',
            },
        },
        authModes: {
            availableModes,
            defaultMode,
        },
        environments: {
            current: '', // needs to be changed
            other: [],
        },
    };
    if (useConfigPalettes) {
        libraryAsHome.applicationPalettes = applicationPalettes;
        libraryAsHome.applicationDefaultPalette = applicationDefaultPalette;
        libraryAsHome.useConfigPalettes = useConfigPalettes;
    }
    if (useColorTheme) {
        libraryAsHome.homeScreen.theme = selectedTheme;
    }
    return libraryAsHome;
}

export const darkTheme = {
    color: {
        selectedTheme: 'dark',
        formatting: {
            toolbarFill: '#29313B',
            toolbarColor: '#FFFFFF',
            sidebarFill: '#29313B',
            sidebarColor: '#FFFFFF',
            sidebarActiveFill: '#334A6A',
            sidebarActiveColor: '#FFFFFF',
            panelFill: '#23262A',
            panelColor: '#FFFFFF',
            accentFill: '#529AFE',
            notificationBadgeFill: '#F56B6B',
            buttonColor: '#29313B',
            canvasFill: '#000000',
        },
        enableForBots: false,
    },
};

export const redTheme = {
    color: {
        selectedTheme: 'red',
        formatting: {
            toolbarFill: '#C90E24',
            toolbarColor: '#FFEAEA',
            sidebarFill: '#FFF0F0',
            sidebarColor: '#27191F',
            sidebarActiveFill: '#E14B59',
            sidebarActiveColor: '#FFFFFF',
            panelFill: '#FFFFFF',
            panelColor: '#3A2F2F',
            accentFill: '#D0192B',
            notificationBadgeFill: '#FFDA18',
            buttonColor: '#FFFFFF',
            canvasFill: '#F3F1F1',
        },
        enableForBots: false,
    },
};

export const redThemeApplytoAllBots = {
    color: {
        selectedTheme: 'red',
        formatting: null,
        enableForBots: true,
    },
};

export const themeWithAppLogo = {
    logos: {
        web: {
            type: 'URL',
            value: 'https://cdn-icons-png.flaticon.com/512/9385/9385258.png',
        },
        favicon: {
            type: 'URL',
            value: 'https://www.logo.wine/a/logo/Bitcoin/Bitcoin-Logo.wine.svg',
        },
    },
};
