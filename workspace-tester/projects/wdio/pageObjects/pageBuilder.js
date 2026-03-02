import DossierPage from './dossier/DossierPage.js';
import LibraryPage from './library/LibraryPage.js';
import LibrarySort from './common/LibrarySort.js';
import LoginPage from './auth/LoginPage.js';
import TOC from './dossier/TOC.js';
import Reset from './dossier/Reset.js';
import UserAccount from './common/UserAccount.js';
import HamburgerMenu from './common/HamburgerMenu.js';
import AdvancedSort from './dossier/AdvancedSort.js';
import PromptEditor from './common/PromptEditor.js';
import PromptSearchbox from './common/PromptSearchbox.js';
import BasePrompt from './base/BasePrompt.js';
import CheckboxStyle from './prompt/CheckboxStyle.js';
import UserPreference from './common/UserPreference.js';
import Bookmark from './dossier/Bookmark.js';
import LibraryHomeBookmark from './library/LibraryHomeBookmark.js';
import DossierAuthoringPage from './dossier/DossierAuthoringPage.js';
import LibraryAuthoringPage from './library/LibraryAuthoringPage.js';
import LibraryConditionalDisplay from './library/LibraryConditionalDisplay.js';
import LibraryFilter from './common/LibraryFilter.js';
import ShowDataDialog from './common/ShowDataDialog.js';
import PromptObject from './prompt/PromptObject.js';
import BaseVisualization from './base/BaseVisualization.js';
import LibrarySearch from './library/LibrarySearch.js';
import InfoWindow from './library/InfoWindow.js';
import Search from './library/Search.js';
import SearchPage from './library/SearchPage.js';
import BaseSearch from './search/BaseSearch.js';
import FullSearch from './search/FullSearch.js';
import FilterOnSearch from './search/FilterOnSearch.js';
import QuickSearch from './search/QuickSearch.js';
import TOCMenu from './common/TOCMenu.js';
import PDFExportWindow from './export/PDFExportWindow.js';
import LibraryAuthoringPDFExport from './export/LibraryAuthoringPDFExport.js';
import LibraryAuthoringExcelExport from './export/LibraryAuthoringExcelExport.js';
import FilterCapsule from './common/FilterCapsule.js';
import FilterElement from './common/FilterElement.js';
import FilterPanel from './common/FilterPanel.js';
import FilterSummary from './common/FilterSummary.js';
import CheckboxFilter from './filter/CheckboxFilter.js';
import FilterSummaryBar from './filter/FilterSummaryBar.js';
import Share from './dossier/Share.js';
import ShareDossierDialog from './dossier/ShareDossierDialog.js';
import ManageAccessDialog from './dossier/ManageAccessDialog.js';
import SaaSShareDialog from './saas/SaaSShareDialog.js';
import SaaSManageAccessDialog from './saas/SaaSManageAccessDialog.js';
import CommentsPage from './collaboration/CommentsPage.js';
import CollaborationDB from './common/CollaborationDB.js';
import PADb from './common/PADb.js';
import Notification from './collaboration/Notification.js';
import GroupDiscussionPage from './collaboration/GroupDiscussionPage.js';
import Email from './common/Email.js';
import SaaS_Email from './saas/SaaS_Email.js';
import CollabAdminPage from './collaboration/CollabAdminPage.js';
import BaseFilter from './base/BaseFilter.js';
import ReportFilter from './report/reportFilter/ReportFilter.js';
import ReportSummary from './report/reportFilter/ReportSummary.js';
import reportPageBuilder from './report/reportPageBuilder.js';
import ReportPage from './report/reportPage.js';
import Sidebar from './group/Sidebar.js';
import Group from './group/Group.js';
import Grid from './visualization/Grid.js';
import HtmlContainer from './dossier/HTMLContainer.js';
import HTMLPage from './dossier/HTMLPage.js';
import Subscribe from './export/Subscribe.js';
import SubscriptionDialog from './export/SubscriptionDialog.js';
import LibraryItem from './common/LibraryItem.js';
import AEPrompt from './prompt/AEPrompt.js';
import ValuePrompt from './prompt/ValuePrompt.js';
import OnboardingTutorial from './library/OnboardingTutorial.js';
import HierarchyPrompt from './prompt/HierarchyPrompt.js';
import ObjectPrompt from './prompt/ObjectPrompt.js';
import QualificationPrompt from './prompt/QualificationPrompt.js';
import RadiobuttonFilter from './filter/RadiobuttonFilter.js';
import SearchBoxFilter from './filter/SearchBoxFilter.js';
import AttributeSlider from '../pageObjects/filter/AttributeSlider.js';
import CalendarFilter from './filter/CalendarFilter.js';
import MQFilter from './filter/MQFilter.js';
import MQSliderFilter from './filter/MQSliderFilter.js';
import DynamicFilter from './filter/DynamicFilter.js';
import ChartVisualizationFilter from './filter/ChartVisualizationFilter.js';
import Timezone from './filter/Timezone.js';
import ListView from './library/ListView.js';
import ListViewAGGrid from './library/ListViewAGGrid.js';
import ContentDiscovery from './library/ContentDiscovery.js';
import InCanvasSelector from './selector/InCanvasSelector.js';
import AIAssistant from './autoAnswers/AIAssistant.js';
import Interpretation from './autoAnswers/Interpretation.js';
import Waterfall from './visualization/Waterfall.js';
import Graph from './visualization/Graph.js';
import GraphMatrix from './visualization/GraphMatrix.js';
import ImageContainer from './visualization/ImageContainer.js';
import LineChart from './visualization/LineChart.js';
import PieChart from './visualization/PieChart.js';
import ExcelExportPanel from './export/ExcelExportPanel.js';
import CSVExportPanel from './export/CSVExportPanel.js';
import Textbox from './visualization/Textbox.js';
import Threshold from './visualization/Threshold.js';
import ManageLibrary from './library/ManageLibrary.js';
import CalendarOnSearch from './search/CalendarOnSearch.js';
import RsdGrid from './document/RsdGrid.js';
import RsdGraph from './document/RsdGraph.js';
import RsdFilterPanel from './document/RsdFilterPanel.js';
import PanelStack from './document/PanelStack.js';
import AdminPage from '../pageObjects/admin/AdminPage.js';
import SelectorObject from './selector/SelectorObject.js';
import DocumentPage from './document/DocumentPage.js';
import TransactionPage from './transaction/TransactionPage.js';
import Survey from './transaction/Survey.js';
import BIWebRsdEditablePage from './document/BIWebRsdEditablePage.js';
import ChangePasswordPage from './auth/ChangePasswordPage.js';
import AttributeFilter from './report/reportFilter/AttributeFilter.js';
import MetricFilter from './report/reportFilter/MetricFilter.js';
import SetFilter from './report/reportFilter/SetFilter.js';
import ReportDatetime from './report/reportFilter/ReportDatetime.js';
import CustomInputBox from './report/reportFilter/CustomInputBox.js';
import AIBotChatPanel from './aibot/AIBotChatPanel.js';
import BotAuthoring from './aibot/BotAuthoring.js';
import BotRulesSettings from './aibot/BotRulesSettings.js';
import BotAppearance from './aibot/BotAppearance.js';
import BotCustomInstructions from './aibot/BotCustomInstructions.js';
import EmbedBotDialog from './aibot/EmbedBotDialog.js';
import CopyMoveWindow from './library/CopyMoveWindow.js';
import AzureLoginPage from './auth/AzureLoginPage.js';
import OktaLoginPage from './auth/OktaLoginPage.js';
import KeycloakLoginPage from './auth/KeycloakLoginPage.js';
import MainTeams from './teams/MainTeams.js';
import ModalDialog from './teams/ModalDialog.js';
import TeamsDesktop from './teams/TeamsDesktop.js';
import Apps from './teams/Apps.js';
import PinInTeamsDialog from './teams/PinInTeamsDialog.js';
import PinFromChannel from './teams/PinFromChannel.js';
import Conversation from './teams/Coversation.js';
import MessageExtension from './teams/MessageExtension.js';
import PingFederateLoginPage from './auth/PingFederateLoginPage.js';
import SiteMinderLoginPage from './auth/SiteMinderLoginPage.js';
import SAMLConfigPage from './auth/SAMLConfigPage.js';
import OneAuthEmbeddingPage from './auth/OneAuthEmbeddingPage.js';
import OneAuthApiPage from './auth/OneAuthApiPage.js';
import AutoDashboard from './dossierEditor/AutoDashboard.js';
import DatasetsPanel from './dossierEditor/DatasetsPanel.js';
import DatasetDialog from './dossierEditor/DatasetDialog.js';
import EditorPanel from './dossierEditor/EditorPanel.js';
import VisualizationPanel from './dossierEditor/VisualizationPanel.js';
import ContentsPanel from './dossierEditor/ContentsPanel.js';
import PendoGuide from './library/PendoGuide.js';
import LibraryNotification from './common/LibraryNotification.js';
import AntdMessage from './common/AntdMessage.js';
import InsightsPage from './insights/InsightsPage.js';
import KpiEditor from './insights/KpiEditor.js';
import KpiTile from './insights/KpiTile.js';
import AIBotToastNotification from './aibot/AIBotToastNotification.js';
import ExportNotification from './export/ExportNotification.js';
import ExportExcelDialog from './export/ExportExcelDialog.js';
import ShareInTeamsDialog from './teams/ShareInTeamsDialog.js';
import AIBotSnapshotsPanel from './aibot/AIBotSnapshotsPanel.js';
import SnapshotDialog from './aibot/SnapshotDialog.js';
import AIBotDatasetPanel from './aibot/AIBotDatasetPanel.js';
import AIBotDatasetPanelContextMenu from './aibot/AIBotDatasetPanelContextMenu.js';
import AIBotUsagePanel from './aibot/AIBotUsagePanel.js';
import SaaSExternalLinkDialog from './saas/SaaSExternalLinkDialog.js';
import Telemetry from './telemetry/Telemetry.js';
import BotConsumptionFrame from './aibot/BotConsumptionFrame.js';
import WarningDialog from './aibot/WarningDialog.js';
import Learning from './autoAnswers/Learning.js';
import BotVisualizations from './aibot/BotVisualizations.js';
import WebLoginPage from './web_auth/WebLoginPage.js';
import FolderPage from './web_folderBrowsing/FolderPage.js';
import HomePage from './web_folderBrowsing/HomePage.js';
import WebReportPage from './web_report/WebReportPage.js';
import MySubscriptionPage from './web_subscription/MySubscriptionPage.js';
import WebAdminPage from './web_admin/WebAdminPage.js';
import IServerManagePage from './web_admin/IServerManagePage.js';
import IServerPropertiesPage from './web_admin/IServerPropertiesPage.js';
import Diagnostics from './web_admin/Diagnostics.js';
import DefaultProperties from './web_admin/DefaultProperties.js';
import LoadingDialog from './dossierEditor/components/LoadingDialog.js';
import DossierEditorUtility from './dossierEditor/components/DossierEditorUtility.js';
import VizGallery from './dossierEditor/VizGallery.js';
import Toolbar from './dossierEditor/Toolbar.js';
import FormatPanel from './dossierEditor/FormatPanel.js';
import KeyDriverFormatPanel from './dossierEditor/KeyDriverFormatPanel.js';
import LayerPanel from './dossierEditor/LayerPanel.js';
import ThemePanel from './dossierEditor/ThemePanel.js';
import KeyDriver from './visualization/KeyDriver.js';
import AutoNarratives from './visualization/AutoNarratives.js';
import ForecastTrend from './visualization/ForecastTrend.js';
import AuthoringFilters from './common/AuthoringFilters.js';
import DataModel from './library/DataModel.js';
import SecurityFilter from './library/SecurityFilter.js';
import TeamsViewAllBotsPage from './teams/TeamsViewAllBotsPage.js';
import TeamsInteractiveChart from './teams/TeamsInteractiveChart.js';
import LinkAttributes from './dossier/LinkAttributes.js';
import LimitElementSource from './dossier/LimitElementSource.js';
import ParameterFilter from './filter/ParameterFilter.js';
import AIViz from './autoAnswers/AIViz.js';
import LinkEditor from './dossierEditor/LinkEditor.js';
import PreferencePage from './web_preference/PreferencePage.js';
import GeneralPage from './web_preference/GeneralPage.js';
import DistributionServicesPage from './web_preference/DistributionServicesPage.js';
import DynamicAddressList from './web_preference/DynamicAddressListsPage.js';
import ColorPalettePage from './web_preference/ColorPalettePage.js';
import HistoryListPage from './web_preference/HistoryListPage.js';
import ProjectDispalyPage from './web_preference/ProjectDisplayPage.js';
import SchedulePage from './web_preference/SchedulePage.js';
import ExportReportsPage from './web_preference/ExportReportsPage.js';
import PrintReportsPage from './web_preference/PrintReportsPage.js';
import GraphDisplayPage from './web_preference/GraphDisplayPage.js';
import GridDisplayPage from './web_preference/GridDisplayPage.js';
import OfficePage from './web_preference/OfficePage.js';
import SecurityPage from './web_preference/SecurityPage.js';
import ReportServicesPage from './web_preference/ReportServicesPage.js';
import FolderBrowsingPage from './web_preference/FolderBrowsingPage.js';
import ChangePWD from './web_preference/ChangePasswordPage.js';
import PromptPage from './web_preference/PromptPage.js';
import DrillModePage from './web_preference/DrillModePage.js';
import MyPage from './web_folderBrowsing/MyPage.js';
import WebDossierPage from './web_dossier/WebDossierPage.js';
import ShareDialog from './web_home/ShareDialog.js';
import AlertDialog from './alert/AlertDialog.js';
import ConditionDialog from './alert/ConditionDialog.js';
import AdminSecurityPage from './web_admin/AdminSecurity.js';
import ReportGrid from './report/ReportGrid.js';
import ReportNumberTextFormatting from './report/reportEditor/ReportNumberTextFormatting.js';
import ReportPageBy from './report/reportEditor/ReportPageBy.js';
import ReportPageBySorting from './report/reportEditor/ReportPageBySorting.js';
import ReportPromptEditor from './report/reportEditor/ReportPrompt.js';
import ReportSqlView from './report/reportEditor/ReportSqlView.js';
import ReportSubtotalsEditor from './report/reportEditor/ReportSubtotalsEditor.js';
import ReportTOC from './report/reportEditor/ReportTOC.js';
import ReportToolbar from './report/reportEditor/ReportToolbar.js';
import ReportGridView from './report/reportEditor/ReportGridView.js';
import ReportFormatPanel from './report/reportEditor/ReportFormatPanel.js';
import ReportFilterPanel from './report/reportEditor/ReportFilterPanel.js';
import ReportThemePanel from './report/reportEditor/ReportThemePanel.js';
import ReportEmbeddedPromptEditor from './report/reportEditor/ReportEmbeddedPromptEditor.js';
import ReportEditorPanel from './report/reportEditor/ReportEditorPanel.js';
import ReportDatasetPanel from './report/reportEditor/ReportDatasetPanel.js';
import ReportContextualLinkingDialog from './report/reportEditor/ReportContextualLinkingDialog.js';
import ReportAttributeFormsDialog from './report/reportEditor/ReportAttributeFormsDialog.js';
import BasicAuth from './auth/BasicAuth.js';
import OIDCConfig from './web_admin/OIDCConfig.js';
import MobileConfiguration from './web_admin/MobileConfiguration.js';
import ADC from './aibot/ADC.js';
import Bot2Chat from './aibot/Bot2Chat.js';
import AIDiagProcess from './aibot/AIDiagProcess.js';
import AdvancedReportProperties from './report/reportEditor/AdvancedReportProperties.js';
import ReportMenubar from './report/reportEditor/ReportMenubar.js';
import ThresholdEditor from './authoring/ThresholdEditor.js';
import AdvancedFilter from './authoring/AdvancedFilter.js';
import DatasetPanel from './authoring/DatasetPanel.js';
// NGM Pages
import NgmContextMenu from './authoring/ngm-pages/ngmContextMenu.js';
import NgmEditorPanel from './authoring/ngm-pages/ngmEditorPanel.js';
import NgmFormatPanel from './authoring/ngm-pages/ngmFormatPanel.js';
import NgmVisualizationPanel from './authoring/ngm-pages/ngmVisualizationPanel.js';
import VizPanelForGrid from './authoring/VizPanelForGrid.js';
import GridAuthoring from './authoring/grid/GridAuthoring.js';
import GroupEditor from './authoring/GroupEditor.js';
import MoreOptions from './authoring/MoreOptions.js';
import ExistingObjectsDialog from './authoring/ExistingObjectsDialog.js';
import HistoryPanel from './aibot/HistoryPanel.js';
import AIBotPromptPanel from './aibot/AIBotPrompt.js';

// Newly created pages
import NewFormatPanelForGrid from './authoring/format-panel/NewFormatPanelForGrid.js';
import FormatPanelForGridToolBox from './authoring/format-panel/FormatPanelForGridToolBox.js';
import FormatPanelForGridGeneral from './authoring/format-panel/FormatPanelForGridGeneral.js';
import FormatPanelForGridTitleCRV from './authoring/format-panel/FormatPanelForGridTitleCRV.js';
import FormatPanelForGridBase from './authoring/format-panel/FormatPanelForGridBase.js';
import InCanvasSelector_Authoring from './authoring/InCanvasSelector_Authoring.js';
import ManageAccessEditor from './dossier/ManageAccessEditor.js';

// Add imports
import BaseContainer from './authoring/BaseContainer.js';
import DossierMojoEditor from './authoring/DossierMojoEditor.js';
import NewGalleryPanel from './authoring/NewGalleryPanel.js';
import CalculationMetric from './authoring/CalculationMetric.js';
import ReportDerivedMetricEditor from './report/reportEditor/ReportDerivedMetricEditor.js';
import BaseFormatPanelReact from './authoring/BaseFormatPanelReact.js';
import BaseFormatPanel from './authoring/BaseFormatPanel.js';
import EditorPanelForGrid from './authoring/EditorPanelForGrid.js';
import CompoundGridVisualization from './compoundGrid/CompoundGridVisualization.js';
import TOCcontentsPanel from './authoring/TOCcontentsPanel.js';
import DatabarConfigDialog from './agGrid/DatabarConfigDialog.js';
import ParameterEditor from './authoringFilter/ParameterEditor.js';
import ContextualLinkEditor from './dossierEditor/ContextualLinkEditor.js';
import DerivedMetricEditor from './authoring/DerivedMetricEditor.js';
import DerivedAttributeEditor from './authoring/DerivedAttributeEditor.js';
import TextField from './authoring/Textfield.js';
import VIPanelStack from './authoring/PanelStack.js';
import VIPanelSelector from './authoring/PanelSelector.js';
import ImageContainer_Authoring from './authoring/ImageContainer_Authoring.js';
import HtmlContainer_Authoring from './authoring/HtmlContainer_Authoring.js';
import Open_Canvas from './authoring/Open_canvas.js';
import RichTextBox from './authoring/RichTextbox.js';
import FreeformPositionAndSize from './authoring/FreeformPositionAndSize.js';
import ResponsiveGroupingEditor from './authoring/ResponsiveGroupingEditor.js';
import Shapes from './authoring/Shapes.js';

// Newly migrated pages for SQLTXN
import AgGrid from './transactionSQL/AgGrid.js';
import BulkDelete from './transactionSQL/BulkDelete.js';
import BulkEdit from './transactionSQL/BulkEdit.js';
import BulkUpdate from './transactionSQL/BulkUpdate.js';
import InlineEdit from './transactionSQL/InlineEdit.js';
import InsertData from './transactionSQL/InsertData.js';
import TxnFirstUserExperience from './transactionSQL/TxnFirstUserExperience.js';
import TxnPopup from './transactionSQL/TxnPopup.js';
import TxnSwitch from './transactionSQL/TxnSwitch.js';

import DatabaseTable from './transactionSQLEditor/DatabaseTable.js';
import DataSourceEditor from './transactionSQLEditor/DataSourceEditor.js';
import InputConfiguration from './transactionSQLEditor/InputConfiguration.js';
import MappingEditor from './transactionSQLEditor/MappingEditor.js';
import TransactionConfigEditor from './transactionSQLEditor/TransactionConfigEditor.js';
import TXNConfigSQLEditor from './transactionSQLEditor/TXNConfigSQLEditor.js';
import TXNSQLEditorCheckbox from './transactionSQLEditor/TXNSQLEditorCheckbox.js';
import TXNSQLEditorDropdown from './transactionSQLEditor/TXNSQLEditorDropdown.js';
import TXNSQLEditorInputNumField from './transactionSQLEditor/TXNSQLEditorInputNumField.js';
import TXNSQLEditorPopup from './transactionSQLEditor/TXNSQLEditorPopup.js';
import TXNSQLEditorTextField from './transactionSQLEditor/TXNSQLEditorTextField.js';

import SnapshotsPage from './snapshots/SnapshotsPage.js';
import AgGridVisualization from './agGrid/AgGridVisualization.js';
import DossierTextField from './dossier/DossierTextField.js';
import MicrochartConfigDialog from './agGrid/MicrochartConfigDialog.js';
import DossierCreator from './library/DossierCreator.js';
import BookmarkBlade from './library/BookmarkBlade.js';
import JWTPage from './auth/JWTPage.js';
import CacheManager from './aibot/CacheManager.js';
import SelectorPanel from './selector/SelectorPanel.js';
import CoverImageDialog from './library/CoverImageDialog.js';
import MappingObjectInAgentTemplate from './aibot/MappingObjectInAgentTemplate.js';
import DashboardFormattingPanel from './authoring/DashboardFormattingPanel.js';
import DashboardSubtotalsEditor from './agGrid/DashboardSubtotalsEditor.js';
import RWDAuthoringPage from './rwd/RWDAuthoringPage.js';
/**
 * A function which creates instances of all page objects for a specific browser instance
 * @param { browser }  object that should be used by page objects
 */

function pageBuilder() {
    const dossierPage = new DossierPage();
    const libraryPage = new LibraryPage();
    const librarySort = new LibrarySort();
    const loginPage = new LoginPage();
    const toc = new TOC();
    const reset = new Reset();
    const userAccount = new UserAccount();
    const hamburgerMenu = new HamburgerMenu();
    const advancedSort = new AdvancedSort();
    const promptEditor = new PromptEditor();
    const promptSearchbox = new PromptSearchbox();
    const basePrompt = new BasePrompt();
    const checkboxStyle = new CheckboxStyle();
    const baseVisualization = new BaseVisualization();
    const userPreference = new UserPreference();
    const bookmark = new Bookmark();
    const libraryHomeBookmark = new LibraryHomeBookmark();
    const dossierAuthoringPage = new DossierAuthoringPage();
    const libraryAuthoringPage = new LibraryAuthoringPage();
    const libraryConditionalDisplay = new LibraryConditionalDisplay();
    const libraryFilter = new LibraryFilter();
    const showDataDialog = new ShowDataDialog();
    const checkbox = new CheckboxStyle();
    const librarySearch = new LibrarySearch();
    const infoWindow = new InfoWindow();
    const search = new Search();
    const searchPage = new SearchPage();
    const baseSearch = new BaseSearch();
    const fullSearch = new FullSearch();
    const filterOnSearch = new FilterOnSearch();
    const quickSearch = new QuickSearch();
    const aiAssistant = new AIAssistant();
    const interpretation = new Interpretation();
    const tocMenu = new TOCMenu();
    const pdfExportWindow = new PDFExportWindow();
    const libraryAuthoringPDFExport = new LibraryAuthoringPDFExport();
    const libraryAuthoringExcelExport = new LibraryAuthoringExcelExport();
    const filterCapsule = new FilterCapsule();
    const filterElement = new FilterElement();
    const filterPanel = new FilterPanel();
    const filterSummary = new FilterSummary();
    const checkboxFilter = new CheckboxFilter();
    const filterSummaryBar = new FilterSummaryBar();
    const share = new Share();
    const shareDossier = new ShareDossierDialog();
    const manageAccess = new ManageAccessDialog();
    const saasShareDialog = new SaaSShareDialog();
    const saasManageAccess = new SaaSManageAccessDialog();
    const commentsPage = new CommentsPage();
    const notification = new Notification();
    const groupDiscussion = new GroupDiscussionPage();
    const collaborationDb = new CollaborationDB();
    const paDb = new PADb();
    const email = new Email();
    const saasEmail = new SaaS_Email();
    const collabAdminPage = new CollabAdminPage();
    const sidebar = new Sidebar();
    const group = new Group();
    const grid = new Grid();
    const rsdGraph = new RsdGraph();
    const rsdFilterPanel = new RsdFilterPanel();
    const panelStack = new PanelStack();
    const reportPages = reportPageBuilder({ dossierPage, libraryPage });
    const baseFilter = new BaseFilter();
    const reportFilter = new ReportFilter();
    const reportSummary = new ReportSummary();
    const reportPage = new ReportPage();
    const htmlContainer = new HtmlContainer();
    const htmlPage = new HTMLPage();
    const subscribe = new Subscribe();
    const subscriptionDialog = new SubscriptionDialog();
    const libraryItem = new LibraryItem();
    const aePrompt = new AEPrompt();
    const valuePrompt = new ValuePrompt();
    const onboardingTutorial = new OnboardingTutorial();
    const hierarchyPrompt = new HierarchyPrompt();
    const objectPrompt = new ObjectPrompt();
    const qualificationPrompt = new QualificationPrompt();
    const radiobuttonFilter = new RadiobuttonFilter();
    const searchBoxFilter = new SearchBoxFilter();
    const attributeSlider = new AttributeSlider();
    const calendarFilter = new CalendarFilter();
    const mqFilter = new MQFilter();
    const mqSliderFilter = new MQSliderFilter();
    const dynamicFilter = new DynamicFilter();
    const chartVisualizationFilter = new ChartVisualizationFilter();
    const timezone = new Timezone();
    const listView = new ListView();
    const listViewAGGrid = new ListViewAGGrid();
    const contentDiscovery = new ContentDiscovery();
    const inCanvasSelector = new InCanvasSelector();
    const waterfall = new Waterfall();
    const graph = new Graph();
    const imageContainer = new ImageContainer();
    const lineChart = new LineChart();
    const pieChart = new PieChart();
    const excelExportPanel = new ExcelExportPanel();
    const csvExportPanel = new CSVExportPanel();
    const textbox = new Textbox();
    const threshold = new Threshold();
    const manageLibrary = new ManageLibrary();
    const rsdGrid = new RsdGrid();
    const adminPage = new AdminPage();
    const selectorObject = new SelectorObject();
    const rsdPage = new DocumentPage();
    const calendarOnSearch = new CalendarOnSearch();
    const transactionPage = new TransactionPage();
    const survey = new Survey();
    const biwebRsdEditablePage = new BIWebRsdEditablePage();
    const selector = new SelectorObject();
    const attributeFilter = new AttributeFilter();
    const metricFilter = new MetricFilter();
    const setFilter = new SetFilter();
    const reportDatetime = new ReportDatetime();
    const customInputbox = new CustomInputBox();
    const aibotChatPanel = new AIBotChatPanel();
    const embedBotDialog = new EmbedBotDialog();
    const botAuthoring = new BotAuthoring();
    const botRulesSettings = new BotRulesSettings();
    const botAppearance = new BotAppearance();
    const botCustomInstructions = new BotCustomInstructions();
    const copyMoveWindow = new CopyMoveWindow();
    const azureLoginPage = new AzureLoginPage();
    const oktaLoginPage = new OktaLoginPage();
    const basicAuth = new BasicAuth();
    const keycloakLoginPage = new KeycloakLoginPage();
    const mainTeams = new MainTeams();
    const modalDialog = new ModalDialog();
    const teamsDesktop = new TeamsDesktop();
    const apps = new Apps();
    const pinInTeamsDialog = new PinInTeamsDialog();
    const pinFromChannel = new PinFromChannel();
    const conversation = new Conversation();
    const messageExtension = new MessageExtension();
    const changePasswordPage = new ChangePasswordPage();
    const pingFederateLoginPage = new PingFederateLoginPage();
    const siteMinderLoginPage = new SiteMinderLoginPage();
    const samlConfigPage = new SAMLConfigPage();
    const oneAuthEmbeddingPage = new OneAuthEmbeddingPage();
    const oneAuthApiPage = new OneAuthApiPage();
    const autoDashboard = new AutoDashboard();
    const datasetsPanel = new DatasetsPanel();
    const datasetDialog = new DatasetDialog();
    const existingObjectsDialog = new ExistingObjectsDialog();
    const editorPanel = new EditorPanel();
    const visualizationPanel = new VisualizationPanel();
    const contentsPanel = new ContentsPanel();
    const pendoGuide = new PendoGuide();
    const libraryNotification = new LibraryNotification();
    const antdMessage = new AntdMessage();
    const insightsPage = new InsightsPage();
    const kpiEditor = new KpiEditor();
    const kpiTile = new KpiTile();
    const aibotToastNotification = new AIBotToastNotification();
    const exportNotification = new ExportNotification();
    const exportExcelDialog = new ExportExcelDialog();
    const shareInTeamsDialog = new ShareInTeamsDialog();
    const aibotSnapshotsPanel = new AIBotSnapshotsPanel();
    const snapshotDialog = new SnapshotDialog();
    const aibotDatasetPanel = new AIBotDatasetPanel();
    const aibotDatasetPanelContextMenu = new AIBotDatasetPanelContextMenu();
    const aibotUsagePanel = new AIBotUsagePanel();
    const saasExternalLinkDialog = new SaaSExternalLinkDialog();
    const telemetry = new Telemetry();
    const botConsumptionFrame = new BotConsumptionFrame();
    const warningDialog = new WarningDialog();
    const learning = new Learning();
    const botVisualizations = new BotVisualizations();
    const webLoginPage = new WebLoginPage();
    const folderPage = new FolderPage();
    const homePage = new HomePage();
    const webReportPage = new WebReportPage();
    const mySubscriptionPage = new MySubscriptionPage();
    const webAdminPage = new WebAdminPage();
    const webManagePage = new IServerManagePage();
    const iServerPropertiesPage = new IServerPropertiesPage();
    const mobileConfig = new MobileConfiguration();
    const diagnostics = new Diagnostics();
    const defaultProperties = new DefaultProperties();
    const loadingDialog = new LoadingDialog();
    const dossierEditorUtility = new DossierEditorUtility();
    const vizGallery = new VizGallery();
    const toolbar = new Toolbar();
    const formatPanel = new FormatPanel();
    const keyDriverFormatPanel = new KeyDriverFormatPanel();
    const layerPanel = new LayerPanel();
    const themePanel = new ThemePanel();
    const keyDriver = new KeyDriver();
    const autoNarratives = new AutoNarratives();
    const forecastTrend = new ForecastTrend();
    const authoringFilters = new AuthoringFilters();
    const dataModel = new DataModel();
    const securityFilter = new SecurityFilter();
    const teamsViewAllBotsPage = new TeamsViewAllBotsPage();
    const teamsInteractiveChart = new TeamsInteractiveChart();
    const linkAttributes = new LinkAttributes();
    const limitElementSource = new LimitElementSource();
    const parameterFilter = new ParameterFilter();
    const aiViz = new AIViz();
    const linkEditor = new LinkEditor();
    const preferencePage = new PreferencePage();
    const generalPage = new GeneralPage();
    const dsPage = new DistributionServicesPage();
    const dynamicAddressListsPage = new DynamicAddressList();
    const colorPalettePage = new ColorPalettePage();
    const historyListPage = new HistoryListPage();
    const projectDisplayPage = new ProjectDispalyPage();
    const schedulePage = new SchedulePage();
    const exportReportsPage = new ExportReportsPage();
    const printReportsPage = new PrintReportsPage();
    const graphDisplayPage = new GraphDisplayPage();
    const gridDisplayPage = new GridDisplayPage();
    const officePage = new OfficePage();
    const securityPage = new SecurityPage();
    const reportServicesPage = new ReportServicesPage();
    const folderBrowsingPage = new FolderBrowsingPage();
    const changePWD = new ChangePWD();
    const promptPage = new PromptPage();
    const drillModePage = new DrillModePage();
    const myPage = new MyPage();
    const webDossierPage = new WebDossierPage();
    const shareDialog = new ShareDialog();
    const alertDialog = new AlertDialog();
    const conditionDialog = new ConditionDialog();
    const adminSecurityPage = new AdminSecurityPage();
    const oidcConfig = new OIDCConfig();
    const reportGrid = new ReportGrid();
    const reportNumberTextFormatting = new ReportNumberTextFormatting();
    const reportPageBy = new ReportPageBy();
    const reportPageBySorting = new ReportPageBySorting();
    const reportPromptEditor = new ReportPromptEditor();
    const reportSqlView = new ReportSqlView();
    const reportSubtotalsEditor = new ReportSubtotalsEditor();
    const reportTOC = new ReportTOC();
    const reportToolbar = new ReportToolbar();
    const reportGridView = new ReportGridView();
    const reportFormatPanel = new ReportFormatPanel();
    const reportFilterPanel = new ReportFilterPanel();
    const reportThemePanel = new ReportThemePanel();
    const reportEmbeddedPromptEditor = new ReportEmbeddedPromptEditor();
    const reportEditorPanel = new ReportEditorPanel();
    const reportDatasetPanel = new ReportDatasetPanel();
    const reportContextualLinkingDialog = new ReportContextualLinkingDialog();
    const reportAttributeFormsDialog = new ReportAttributeFormsDialog();
    const gridAuthoring = new GridAuthoring();
    const groupEditor = new GroupEditor();
    const adc = new ADC();
    const bot2Chat = new Bot2Chat();
    const aiDiagProcess = new AIDiagProcess();
    const advancedReportProperties = new AdvancedReportProperties();
    const reportMenubar = new ReportMenubar();
    const graphMatrix = new GraphMatrix();
    const historyPanel = new HistoryPanel();
    const aiBotPromptPanel = new AIBotPromptPanel();
    const jwtPage = new JWTPage();
    const cacheManager = new CacheManager();

    // Newly created pages
    const newFormatPanelForGrid = new NewFormatPanelForGrid();
    const formatPanelForGridToolBox = new FormatPanelForGridToolBox();
    const formatPanelForGridGeneral = new FormatPanelForGridGeneral();
    const formatPanelForGridTitleCRV = new FormatPanelForGridTitleCRV();
    const formatPanelForGridBase = new FormatPanelForGridBase();

    const thresholdEditor = new ThresholdEditor();
    const advancedFilter = new AdvancedFilter();
    const datasetPanel = new DatasetPanel();

    // NGM Page Objects
    const ngmContextMenu = new NgmContextMenu();
    const ngmEditorPanel = new NgmEditorPanel();
    const ngmFormatPanel = new NgmFormatPanel();
    const ngmVisualizationPanel = new NgmVisualizationPanel();

    const vizPanelForGrid = new VizPanelForGrid();
    const moreOptions = new MoreOptions();
    const inCanvasSelector_Authoring = new InCanvasSelector_Authoring();

    const manageAccessEditor = new ManageAccessEditor();
    const snapshotsPage = new SnapshotsPage();

    // Add new instances
    const baseContainer = new BaseContainer();
    const dossierMojo = new DossierMojoEditor();
    const newGalleryPanel = new NewGalleryPanel();
    const calculationMetric = new CalculationMetric();
    const reportDerivedMetricEditor = new ReportDerivedMetricEditor();
    const parameterEditor = new ParameterEditor();
    const baseFormatPanelReact = new BaseFormatPanelReact();
    const baseFormatPanel = new BaseFormatPanel();
    const contextualLinkEditor = new ContextualLinkEditor();
    const editorPanelForGrid = new EditorPanelForGrid();
    const compoundGridVisualization = new CompoundGridVisualization();
    const tocContentsPanel = new TOCcontentsPanel();
    const databarConfigDialog = new DatabarConfigDialog();
    const derivedMetricEditor = new DerivedMetricEditor();
    const derivedAttributeEditor = new DerivedAttributeEditor();
    const textField = new TextField();
    const viPanelStack = new VIPanelStack();
    const viPanelSelector = new VIPanelSelector();
    const imageContainer_Authoring = new ImageContainer_Authoring();
    const htmlContainer_Authoring = new HtmlContainer_Authoring();
    const open_Canvas = new Open_Canvas();
    const richTextBox = new RichTextBox();
    const freeformPositionAndSize = new FreeformPositionAndSize();
    const responsiveGroupingEditor = new ResponsiveGroupingEditor();
    const shapes = new Shapes();

    // add SQL TXN pages
    const agGrid = new AgGrid();
    const bulkDelete = new BulkDelete();
    const bulkEdit = new BulkEdit();
    const bulkUpdate = new BulkUpdate();
    const inlineEdit = new InlineEdit();
    const insertData = new InsertData();
    const txnFirstUserExperience = new TxnFirstUserExperience();
    const txnPopup = new TxnPopup();
    const txnSwitch = new TxnSwitch();

    const databaseTable = new DatabaseTable();
    const dataSourceEditor = new DataSourceEditor();
    const inputConfiguration = new InputConfiguration();
    const mappingEditor = new MappingEditor();
    const transactionConfigEditor = new TransactionConfigEditor();
    const txnConfigSQLEditor = new TXNConfigSQLEditor();
    const txnSQLEditorCheckbox = new TXNSQLEditorCheckbox();
    const txnSQLEditorDropdown = new TXNSQLEditorDropdown();
    const txnSQLEditorInputNumField = new TXNSQLEditorInputNumField();
    const txnSQLEditorPopup = new TXNSQLEditorPopup();
    const txnSQLEditorTextField = new TXNSQLEditorTextField();

    const agGridVisualization = new AgGridVisualization();
    const microchartConfigDialog = new MicrochartConfigDialog();
    const dossierCreator = new DossierCreator();
    const dossierTextField = new DossierTextField();
    const bookmarkBlade = new BookmarkBlade();
    const selectorPanel = new SelectorPanel();
    const coverImageDialog = new CoverImageDialog();
    const mappingObjectInAgentTemplate = new MappingObjectInAgentTemplate();
    const dashboardFormattingPanel = new DashboardFormattingPanel();
    const dashboardSubtotalsEditor = new DashboardSubtotalsEditor();
    const rwdAuthoringPage = new RWDAuthoringPage();

    Object.assign(dossierPage, { libraryPage });
    Object.assign(libraryPage, { dossierPage, loginPage });
    Object.assign(loginPage, { libraryPage });
    Object.assign(toc, { dossierPage });
    Object.assign(radiobuttonFilter, { dossierPage, filterPanel });
    Object.assign(searchBoxFilter, { dossierPage, filterPanel });
    Object.assign(calendarFilter, { dossierPage, filterPanel });
    Object.assign(mqFilter, { dossierPage });
    Object.assign(mqSliderFilter, { dossierPage });
    Object.assign(dynamicFilter, { filterCapsule, filterElement });
    Object.assign(chartVisualizationFilter, { dossierPage, filterPanel });
    Object.assign(hamburgerMenu, { libraryPage });
    Object.assign(reset, { dossierPage, promptEditor });
    Object.assign(basePrompt, { promptEditor });
    Object.assign(librarySearch, { dossierPage, libraryPage, searchPage });
    Object.assign(searchPage, { dossierPage, libraryPage });
    Object.assign(toc, { dossierPage });
    Object.assign(commentsPage, { dossierPage });
    Object.assign(share, { dossierPage });
    Object.assign(notification, { dossierPage });
    Object.assign(filterPanel, { dossierPage, baseFilter });
    Object.assign(infoWindow, { dossierPage, libraryPage });
    Object.assign(baseVisualization, { dossierPage, pdfExportWindow, showDataDialog });
    Object.assign(basePrompt, { promptEditor });
    Object.assign(bookmark, { dossierPage });
    Object.assign(grid, { dossierPage });
    Object.assign(share, { dossierPage });
    Object.assign(aePrompt, { checkbox });
    Object.assign(promptEditor, { aePrompt, hierarchyPrompt, qualificationPrompt, objectPrompt, valuePrompt });
    Object.assign(waterfall, { dossierPage });
    Object.assign(graph, { dossierPage });
    Object.assign(lineChart, { dossierPage });
    Object.assign(pieChart, { dossierPage });
    Object.assign(pdfExportWindow, { baseVisualization, dossierPage, infoWindow, promptEditor, share });
    Object.assign(aibotChatPanel, { libraryPage });
    Object.assign(modalDialog, { mainTeams });
    Object.assign(aibotSnapshotsPanel, { aibotChatPanel });
    Object.assign(excelExportPanel, { baseVisualization, share });
    Object.assign(csvExportPanel, { baseVisualization, share });
    Object.assign(reportGrid, { dossierPage });
    Object.assign(reportNumberTextFormatting, { dossierPage });
    Object.assign(reportPageBy, { dossierPage });
    Object.assign(reportPageBySorting, { dossierPage });
    Object.assign(reportPromptEditor, { dossierPage });
    Object.assign(reportSqlView, { dossierPage });
    Object.assign(reportSubtotalsEditor, { dossierPage });
    Object.assign(reportTOC, { dossierPage });
    Object.assign(reportToolbar, { dossierPage });
    Object.assign(reportGridView, { dossierPage });
    Object.assign(reportFormatPanel, { dossierPage });
    Object.assign(reportFilterPanel, { dossierPage });
    Object.assign(reportEmbeddedPromptEditor, { dossierPage });
    Object.assign(reportEditorPanel, { dossierPage });
    Object.assign(reportDatasetPanel, { dossierPage });
    Object.assign(reportContextualLinkingDialog, { dossierPage });
    Object.assign(reportAttributeFormsDialog, { dossierPage });
    Object.assign(advancedReportProperties, { dossierPage });
    Object.assign(reportMenubar, { dossierPage });
    Object.assign(dashboardSubtotalsEditor, { dossierPage });

    return {
        ...reportPages,
        adminPage,
        baseFilter,
        reportFilter,
        reportSummary,
        reportPage,
        dossierPage,
        libraryPage,
        librarySort,
        loginPage,
        toc,
        reset,
        userAccount,
        hamburgerMenu,
        advancedSort,
        promptEditor,
        promptSearchbox,
        basePrompt,
        checkboxStyle,
        userPreference,
        bookmark,
        libraryHomeBookmark,
        dossierAuthoringPage,
        libraryAuthoringPage,
        libraryConditionalDisplay,
        libraryFilter,
        linkAttributes,
        limitElementSource,
        showDataDialog,
        checkbox,
        baseVisualization,
        librarySearch,
        baseSearch,
        fullSearch,
        filterOnSearch,
        infoWindow,
        search,
        searchPage,
        quickSearch,
        aiAssistant,
        interpretation,
        tocMenu,
        textbox,
        threshold,
        pdfExportWindow,
        libraryAuthoringPDFExport,
        libraryAuthoringExcelExport,
        filterCapsule,
        filterElement,
        filterPanel,
        filterSummary,
        checkboxFilter,
        filterSummaryBar,
        promptObject: new PromptObject(),
        share,
        shareDossier,
        manageAccess,
        saasShareDialog,
        saasManageAccess,
        commentsPage,
        collaborationDb,
        notification,
        groupDiscussion,
        email,
        saasEmail,
        collabAdminPage,
        sidebar,
        group,
        grid,
        htmlContainer,
        htmlPage,
        subscribe,
        subscriptionDialog,
        libraryItem,
        aePrompt,
        valuePrompt,
        onboardingTutorial,
        hierarchyPrompt,
        objectPrompt,
        qualificationPrompt,
        radiobuttonFilter,
        searchBoxFilter,
        attributeSlider,
        calendarFilter,
        mqFilter,
        mqSliderFilter,
        dynamicFilter,
        chartVisualizationFilter,
        timezone,
        listView,
        listViewAGGrid,
        contentDiscovery,
        waterfall,
        graph,
        imageContainer,
        lineChart,
        pieChart,
        inCanvasSelector,
        excelExportPanel,
        csvExportPanel,
        manageLibrary,
        rsdPage,
        rsdGrid,
        rsdGraph,
        rsdFilterPanel,
        panelStack,
        selectorObject,
        transactionPage,
        survey,
        biwebRsdEditablePage,
        calendarOnSearch,
        selector,
        attributeFilter,
        metricFilter,
        setFilter,
        reportDatetime,
        customInputbox,
        aibotChatPanel,
        embedBotDialog,
        botAuthoring,
        botRulesSettings,
        botAppearance,
        botCustomInstructions,
        copyMoveWindow,
        azureLoginPage,
        oktaLoginPage,
        basicAuth,
        keycloakLoginPage,
        mainTeams,
        modalDialog,
        teamsDesktop,
        apps,
        pinInTeamsDialog,
        pinFromChannel,
        conversation,
        messageExtension,
        changePasswordPage,
        pingFederateLoginPage,
        siteMinderLoginPage,
        samlConfigPage,
        oneAuthEmbeddingPage,
        oneAuthApiPage,
        autoDashboard,
        datasetsPanel,
        existingObjectsDialog,
        datasetDialog,
        editorPanel,
        visualizationPanel,
        contentsPanel,
        pendoGuide,
        libraryNotification,
        antdMessage,
        insightsPage,
        kpiEditor,
        kpiTile,
        aibotToastNotification,
        exportNotification,
        exportExcelDialog,
        shareInTeamsDialog,
        aibotSnapshotsPanel,
        aibotDatasetPanel,
        aibotDatasetPanelContextMenu,
        aibotUsagePanel,
        saasExternalLinkDialog,
        telemetry,
        botConsumptionFrame,
        warningDialog,
        learning,
        snapshotDialog,
        botVisualizations,
        webLoginPage,
        folderPage,
        homePage,
        webReportPage,
        mySubscriptionPage,
        webAdminPage,
        webManagePage,
        iServerPropertiesPage,
        mobileConfig,
        diagnostics,
        defaultProperties,
        loadingDialog,
        dossierEditorUtility,
        vizGallery,
        toolbar,
        formatPanel,
        keyDriverFormatPanel,
        layerPanel,
        themePanel,
        keyDriver,
        autoNarratives,
        forecastTrend,
        authoringFilters,
        dataModel,
        securityFilter,
        teamsViewAllBotsPage,
        teamsInteractiveChart,
        parameterFilter,
        paDb,
        aiViz,
        linkEditor,
        preferencePage,
        generalPage,
        dsPage,
        dynamicAddressListsPage,
        colorPalettePage,
        historyListPage,
        projectDisplayPage,
        schedulePage,
        exportReportsPage,
        printReportsPage,
        graphDisplayPage,
        gridDisplayPage,
        officePage,
        securityPage,
        reportServicesPage,
        folderBrowsingPage,
        changePWD,
        promptPage,
        drillModePage,
        myPage,
        webDossierPage,
        shareDialog,
        alertDialog,
        conditionDialog,
        adminSecurityPage,
        oidcConfig,
        reportGrid,
        reportNumberTextFormatting,
        reportPageBy,
        reportPageBySorting,
        reportPromptEditor,
        reportSqlView,
        reportSubtotalsEditor,
        reportTOC,
        reportToolbar,
        reportGridView,
        reportFormatPanel,
        reportFilterPanel,
        reportThemePanel,
        reportEmbeddedPromptEditor,
        reportEditorPanel,
        reportDatasetPanel,
        reportContextualLinkingDialog,
        reportAttributeFormsDialog,
        gridAuthoring,
        groupEditor,
        adc,
        jwtPage,
        bot2Chat,
        aiDiagProcess,
        advancedReportProperties,
        reportMenubar,
        historyPanel,
        aiBotPromptPanel,
        // Newly created pages
        newFormatPanelForGrid,
        formatPanelForGridToolBox,
        formatPanelForGridGeneral,
        formatPanelForGridTitleCRV,
        formatPanelForGridBase,
        thresholdEditor,
        advancedFilter,
        datasetPanel,
        // NGM Page Objects
        ngmContextMenu,
        ngmEditorPanel,
        ngmFormatPanel,
        ngmVisualizationPanel,
        vizPanelForGrid,
        moreOptions,
        calculationMetric,
        baseContainer,
        dossierMojo,
        newGalleryPanel,
        reportDerivedMetricEditor,
        parameterEditor,
        baseFormatPanelReact,
        baseFormatPanel,
        contextualLinkEditor,
        inCanvasSelector_Authoring,
        editorPanelForGrid,
        compoundGridVisualization,
        manageAccessEditor,
        tocContentsPanel,
        databarConfigDialog,
        derivedMetricEditor,
        derivedAttributeEditor,
        textField,
        viPanelStack,
        viPanelSelector,
        imageContainer_Authoring,
        htmlContainer_Authoring,
        open_Canvas,
        richTextBox,
        freeformPositionAndSize,
        responsiveGroupingEditor,
        shapes,

        // SQL TXN pages
        agGrid,
        bulkDelete,
        bulkEdit,
        bulkUpdate,
        inlineEdit,
        insertData,
        txnFirstUserExperience,
        txnPopup,
        txnSwitch,
        databaseTable,
        dataSourceEditor,
        inputConfiguration,
        mappingEditor,
        transactionConfigEditor,
        txnConfigSQLEditor,
        txnSQLEditorCheckbox,
        txnSQLEditorDropdown,
        txnSQLEditorInputNumField,
        txnSQLEditorPopup,
        txnSQLEditorTextField,
        agGridVisualization,
        dossierTextField,
        microchartConfigDialog,
        snapshotsPage,
        dossierCreator,
        graphMatrix,
        bookmarkBlade,
        cacheManager,
        selectorPanel,
        coverImageDialog,
        mappingObjectInAgentTemplate,
        dashboardFormattingPanel,
        dashboardSubtotalsEditor,
        rwdAuthoringPage,
    };
}

export default pageBuilder;
