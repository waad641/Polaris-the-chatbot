const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input i");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");



let userMessage;
// create your own  API key then copy paste it here and remember to not share it with anyone :
const API_KEY = "";

const createChatLi = (message, className) => {
    // create a chat <li> element with passed message and className
    const chatLi = document.createElement("li"); // Changed "Li" to "li"
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<i class="material-icons">smart_toy</i><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");
    const requestOptions = {
        method: "POST",
        headers: { // Changed "Headers" to "headers"
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }]
        })
    };

    // send POST request to API, get response
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
            messageElement.textContent = data.choices[0].message.content;
        })
        .catch((error) => {
            messageElement.textContent = "Oops! Something went wrong .Please try again";
        }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatInput.value = "";


    // append the user message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        // display "thinking...." while waiting for the answer
        const incomingChatLi =  createChatLi("Thinking....", "incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
};
sendChatBtn.addEventListener("click", handleChat);
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));


