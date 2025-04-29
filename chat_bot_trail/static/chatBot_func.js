const chatToggle = document.getElementById('chatToggle');
const chatBox = document.querySelector('.chatbot-container');
const closeBtn = document.getElementById('closeBtn');
const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const chatBody = document.getElementById('chatBody');

// Toggle chat visibility
chatToggle.onclick = () => {
  chatBox.style.display = 'flex';
  chatToggle.style.display = 'none';
};

closeBtn.onclick = () => {
  chatBox.style.display = 'none';
  chatToggle.style.display = 'block';
};

// Send message
sendBtn.onclick = () => {
  const message = userInput.value.trim();
  if (message === '') return;

  addMessage('user', message);
  userInput.value = '';
  
  setTimeout(() => {
    generateBotReply(message);
  }, 600);
};

function addMessage(type, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', type);
  msg.innerHTML = text;
  chatBody.scrollTop = chatBody.scrollHeight;
}


userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});

function handleUserInput(input) {
  if (input.trim().toLowerCase() === 'exit') {
    clearChat();
    closeChat();
    return;
  }
}

function clearChat() {
  const chatContainer = document.getElementById('chat-container'); 
  if (chatContainer) {
    chatContainer.innerHTML = '';
  }
}

function closeChat() {
  addMessage('bot', "👋 Chat closed. Have a nice day!");
  setTimeout(() => {
    const chatWindow = document.getElementById('chat-header');
    if (chatWindow) chatWindow.style.display = 'none';
  }, 60000); 
}


function generateBotReply(userMsg) {
  const loadingWrapper = document.createElement('div');
  loadingWrapper.classList.add('loader-wrapper');

  const loadingMsg = document.createElement('div');
  loadingMsg.classList.add('loader');

  loadingWrapper.appendChild(loadingMsg);
  chatBody.appendChild(loadingWrapper);
  chatBody.scrollTop = chatBody.scrollHeight;
  // Send message to backend
  fetch('/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: userMsg })
  })
  .then(response => response.json())
  .then(data => {
    // Remove the loading message
    chatBody.removeChild(loadingWrapper);
    let reply = data.reply;

    if (typeof reply === 'object') {
      // Pretty format for JSON responses
      reply = `<b>Description:</b> ${reply.description}<br>
      <b>Input:</b> ${reply.input}<br>
      <b>Syntax:</b> ${reply.syntax}`;
    } 
    else {
      try {
        const parsedReply = JSON.parse(reply);
        if (typeof parsedReply === 'object') {
          reply = `<b>Description:</b> ${parsedReply.description}<br>
          <b>Input:</b> ${parsedReply.input}<br>
          <b>Syntax:</b> ${parsedReply.syntax}`;
        }
      } catch (e) {
        // Not JSON, leave as-is
      }
    }
    addMessage('bot', reply);
    handleUserInput(userMsg);
  })
  .catch(error => {
    chatBody.removeChild(loadingWrapper);
    console.error('Error:', error);
    addMessage('bot', "Sorry, I couldn't reach the server.");
  });

}


