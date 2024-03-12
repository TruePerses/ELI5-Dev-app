const express =  require("express"); 
const { isValidRequest, createMessage, postChatGPTMessage, addMessageToConversation } = require("../utils/chatGPTUtil");
const { USER_TYPES } = require("../constants/chatGPTRoles");


// create new router instance
const router = express.Router();

// create new post
router.post("/", async (req, res) => {
    if (!isValidRequest(req.body)) {
        return res.status(400).json({ error: "Invalid Request"})
    }

    // extracts the message and coversation 
    const { message, context, conversation = [] } = req.body;

    // create content message
    const contextMessage = createMessage(context, USER_TYPES.SYSTEM);

    // add user message to the conversation
    addMessageToConversation(message, conversation, USER_TYPES.USER);
    
    // call postChatGPTMessage to get the response from ChatGPT API
    console.log("Generating response for: /n", message)
    const chatGPTResponse = await postChatGPTMessage(
        contextMessage,
        conversation
    );

    // check if there was an error with the ChatGPT API
    if (!chatGPTResponse) {
        return res.status(500).json( { error: "Error with ChatGPT" });
    }

    // get the content from the ChatGPT response
    const { content } = chatGPTResponse;

    // add the response to the conversation
    addMessageToConversation(content, conversation, USER_TYPES.ASSISTANT);

    // return the conversation as json response
    console.log("Updated conversation: /n", conversation);
    return res.status(200).json({ message: conversation });
})

module.exports = router;