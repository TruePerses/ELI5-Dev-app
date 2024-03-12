const Yup = require("yup");
require("dotenv").config();
const axios = require("axios");

// define constants
const CHATGPT_END_POINT = "https://api.openai.com/v1/chat/completions";
const CHATGPT_MODEL = "gpt-3.5-turbo";

// set config for axios request
const config = {
    headers: {
        Authorization: `Bearer ${process.env.CHATGPT_API_KEY}`,
    },
};

// function to build a conversation array
const buildConversation = (contextMessage, conversation) => {
    return [contextMessage].concat(conversation);
};

// function to post a message to the ChatGPT API
const postChatGPTMessage = async (contentMessage, conversation) => {
    const messages = buildConversation(contentMessage, conversation);
    const chatGPTData = {
        model: CHATGPT_MODEL,
        model: "gpt-3.5-turbo",
        messages: messages,
    };


    try {
        const resp = await axios.post(CHATGPT_END_POINT, chatGPTData, config);
        const data = resp.data;
        const message = data?.choices[0]?.message;
        return message;
    }

    catch (error) {
        console.error("error with ChatGPT API");
        console.error(error)
        return null;
    }
};

// define yup validation schema for conversation object
const conversationSchema = Yup.object().shape({
    role: Yup.string().required("Role is required"),
    content: Yup.string().required("Content is required"),
});

// define yup validation schema for request object
const requestSchema = Yup.object().shape({
    context: Yup.string().required(),
    message: Yup.string().required(),
    conversation : Yup.array().of(conversationSchema).notRequired(),
});

// function to validate request odject using Yup schema
const isValidRequest = (request) => {
    try {
        requestSchema.validateSync(request);
        return true;
    }
    catch (error) {
        return false;
    }
};

const createMessage = (message, role) => {
    return {
        role: role,
        content: message,
    };
};

// function to add a message to a conversation array
const addMessageToConversation = (message, conversation, role) => {
    conversation.push(createMessage(message, role));
};

module.exports = {
    isValidRequest,
    addMessageToConversation,
    postChatGPTMessage,
    createMessage,
};