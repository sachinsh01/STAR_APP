// Import necessary libraries 
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import axios from "axios";
import { useCookies } from "react-cookie";
// import { BiSolidMessageDetail } from "react-icons/bi";

function ChatBot() {

  // Extracting the 'token' cookie using the useCookies hook
  const [cookies] = useCookies(["token"]);

  //Set the baseURL
  const baseURL = process.env.NODE_ENV === 'production' ? 'https://3.108.23.98/API' : 'http://localhost:4000';

  const values = ["md-down"];
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);

  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }

  // Initializing the state for the chat history. It is an array of objects, each representing a message.
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", content: "Hi, How can I help you?" }, // Initial message from the assistant
  ]);

  // Initializing the state for the typing indicator. It is a boolean value representing whether the assistant is typing or not.
  const [isTyping, setIsTyping] = useState(false);

  // Function to handle sending a message
  const handleSend = async (message) => {
    setIsTyping(true); // Set the typing indicator to true

    // Update the chat history with the user's message
    const updatedChatHistory = [
      ...chatHistory,
      { role: "user", content: message },
    ];

    setChatHistory(updatedChatHistory); // Update the chat history with the user's message immediately

    // Send a post request to the specified URL using the axios library
    axios({
      method: "post",
      url: baseURL + "/chat", // URL for the post request
      data: {
        messages: updatedChatHistory, // Data to be sent in the post request
      },
      headers: {
        Authorization: `Bearer ${cookies.token}`, // Set the authorization token in the headers
      },
    }).then((response) => {
      // When the request is successful, update the chat history with the received response
      const newChatHistory = [...updatedChatHistory, response.data.reply];
      setChatHistory(newChatHistory); // Update the chat history with the response
      setIsTyping(false); // Set the typing indicator to false
    });
  };


  return (
    <>
      {values.map((v, idx) => (
        // <BiSolidMessageDetail size={30} key={idx} className="mx-4" onClick={() => handleShow(v)}
        // />
        <a key={idx} className="text-left dropdown-item smallDropdown text-dark" onClick={() => handleShow(v)}>Star Assistant</a>

      ))}
      <Modal show={show} fullscreen={fullscreen} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Star Assistant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <div className="">
            <div
              style={{ position: "relative" }}
            >
              <MainContainer>
                <ChatContainer>
                  <MessageList
                    scrollBehavior="smooth"
                    typingIndicator={
                      isTyping ? (
                        <TypingIndicator content="Assistant is typing" />
                      ) : null
                    }
                  >
                    {chatHistory.map((element, i) => {
                      const message = {
                        message: element.content,
                        sender: element.role === "user" ? "user" : "ChatGPT",
                        direction:
                          element.role === "user" ? "outgoing" : "incoming",
                      };
                      return <Message key={i} model={message} />;
                    })}
                  </MessageList>
                  {/* <MessageInput
                    placeholder="Type message here"
                    onSend={handleSend}
                  /> */}
                </ChatContainer>
              </MainContainer>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ChatBot;