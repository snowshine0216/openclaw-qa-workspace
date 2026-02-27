export const teamsApp = 'Library';

export const botInTeamsUser = {
    credentials: {
        username: 'bot@nvy2.onmicrosoft.com',
        password: 'newman1#',
    },
    id: 'D977AD4C8E4B11A60FAA62BA7D0DA85A',
    name: 'bot',
};

export const autoInTeamsUser = {
    credentials: {
        username: 'auto@nvy2.onmicrosoft.com',
        password: 'newman1#',
    },
    id: '9BD5985DD344699B1904BA8AF116FBE2',
    name: 'auto',
};

export const receipient = {
    credentials: {
        name: 'botReceipient',
        username: 'botReceipient@nvy2.onmicrosoft.com',
        password: '',
        id: 'E187A49DC143AAD3533909B6BDF011ED',
    },
};

export const mstrUser = {
    id: 'B56F132AE6445C0CBAF9589BAC1681B9',
    credentials: {
        username: 'bot_palette',
        password: '',
    },
};

export const perfInTeamsUser = {
    id: '1943CE893F4042D4E6569E9AE2D349FC',
    credentials: {
        username: 'shezhao@nvy2.onmicrosoft.com',
        password: 'newman1#',
    },
    name: 'Zhao, Sheng',
}

export const publishInfo = {
    type: 'document_definition',
    recipients: [
        {
            id: botInTeamsUser.id,
        },
    ],
    projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
};

export const project = {
    id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    name: 'MicroStrategy Tutorial',
};

export const dossier = {
    id: '35FE2341434527218E174BA8ACB5918C',
    name: 'F40341_Dossier',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const dossierNotInLibrary = {
    id: 'DD37C4EA0E43370D501EC788983E8880',
    name: 'F40341_DossierNotInLibrary',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const mstrStockBot = {
    id: '235BDBC9B740B01EF72FD5A3C502E85C',
    name: 'MSTR Stock Bot',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const defaultApp = 'Strategy';
export const cubeNotPublishedBot = { id: '5A86174401486D391E395E911715046C', name: 'Auto_cubeNotPublishedBot' };

export const question = 'What is the total amount of accounts receivable?';
export const sharedMessage = 'Hi, please check this shared message from Teams.';
export const successMessage = 'Your message has been shared.';
export const folderId = '4A291487A748D212F129BC8801EA9092';
export const bot = { modifiedName: 'F40341_ModifiedName', modifiedGreeting: 'Hi, I am Javis.' };

export const team = 'Auto_Teams';
export const teamChannel = 'Teams';
export const shareChannel = 'ChannelWithPinnedObject';
export const shareDossierChannel = 'ChannelToPinDossier';
export const pinFromContextMenuChannel = 'PinFromContextMenu';
export const pinFromPinnedObjectChannel = 'PinFromPinnedObject';
export const longNameChannel = 'TestPinFromSharePanelWithLoooooooooooooooooooooooo';
export const errorChannel = 'Error';

export const testGroupChat1 = 'Auto_Group1';
export const testGroupChat2 = 'Auto_Group2';
export const testGroupChat3 = 'Auto_Group3';
export const testGroupChat4 = 'Auto_Group4';

export const noAccessErrorMessage = 'You do not have permission to perform this action.';
export const inactiveBotErrorMessage = 'This bot is currently inactive.';
export const cubeNotPublishedErrorMessage = 'One or more datasets are not loaded for this item.';
export const deletedErrorMessage = 'The item you are trying to access cannot be found. It may have been deleted.';
export const warningTextForNewChat = 'Before sharing, please send a message to initiate the chat.';
export const viewMoreMessage = 'The image might be cut off, click "View More" to see the full visualization with interactivity.';
export const simpleGreetingMessage =
    "Hi there! I'm your data assistant. My primary function is to assist with data analysis and visualization. Ask me any questions related to your data.";
export const noPrivilegeError =
    "Sorry, you don't have the necessary privileges to interact with bots. Please contact your administrator for assistance.";
export const noBotsError = 'Sorry, there are no bots available. Please contact your administrator for assistance.';
export const noAgentsError = 'Sorry, there are no agents available. Please contact your administrator for assistance.';
export const greetingMessage1InWelcomeCard = `I'm your data assistant, powered by Auto!`;
export const greetingMessage2InWelcomeCard = `I can answer questions about your data and provide insights.`;
export const greetingMessage3InWelcomeCard = `You can see the available bots below along with information about their respective data focus.`;

export const sunset = ['fill:rgb(206,45,39);', 'fill: rgb(206, 45, 39);'];

export const greetingMessage1InBot2 = `Hello! I'm DMTECH机器人, your virtual assistant. How can I guide you today?`;
export const greetingMessage2InBot2 = `hello~ I'm a modified greeting message!`;
