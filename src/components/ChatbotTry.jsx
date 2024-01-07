import { useState } from "react";
import Button from "react-bootstrap/Button";
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
import {BiSolidMessageDetail} from "react-icons/bi";

function ChatbotTry() {
  const values = [ "md-down"];
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);

  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }

  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", content: "Hi,, How can I help you?" },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const [cookies] = useCookies(["token"]);

  const handleSend = async (message) => {
    setIsTyping(true);

    const updatedChatHistory = [
      ...chatHistory,
      { role: "user", content: message },
    ];

    setChatHistory(updatedChatHistory); // Update the chat history with the user's message immediately

    axios({
      method: "post",
      url: "http://localhost:4000/chat",
      data: {
        messages: updatedChatHistory,
      },
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    }).then((response) => {
      const newChatHistory = [...updatedChatHistory, response.data.reply];
      setChatHistory(newChatHistory);
      setIsTyping(false);
    });
  };

  return (
    <>
      {values.map((v, idx) => (
        <BiSolidMessageDetail  size={30} key={idx} className="mx-4" onClick={() => handleShow(v)}
          
          />
        
      ))}
      <Modal id='profile-modal' show={show} fullscreen={fullscreen} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Your assistant</Modal.Title>
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
                        sender: element.role == "user" ? "user" : "ChatGPT",
                        direction:
                          element.role == "user" ? "outgoing" : "incoming",
                      };
                      return <Message key={i} model={message} />;
                    })}
                  </MessageList>
                  <MessageInput
                    placeholder="Type message here"
                    onSend={handleSend}
                  />
                </ChatContainer>
              </MainContainer>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ChatbotTry;
