import React, { useEffect } from "react";

const Chatbot = () => {
  useEffect(() => {
    const loadScript = (src, id) => {
      return new Promise((resolve, reject) => {
        if (document.getElementById(id)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.id = id;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const loadCSS = (href, id) => {
      if (document.getElementById(id)) {
        return;
      }
      const link = document.createElement("link");
      link.href = href;
      link.rel = "stylesheet";
      link.id = id;
      document.head.appendChild(link);
    };

    loadCSS(
      "https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css",
      "df-messenger-css",
    );
    loadScript(
      "https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js",
      "df-messenger-js",
    )
      .then(() => {
        console.log("Dialogflow Messenger script loaded successfully.");
      })
      .catch((error) => {
        console.error("Error loading Dialogflow Messenger script:", error);
      });
  }, []);

  return (
    <>
      <df-messenger
        project-id="coolie-9cc38"
        agent-id="6496d431-7bb2-479d-91d7-e959264389b3"
        language-code="en"
        max-query-length="-1"
        allow-feedback="all"
      >
        <df-messenger-chat-bubble chat-title="TASK TIGERS HELP"></df-messenger-chat-bubble>
      </df-messenger>
      <style>
        {`
          df-messenger {
            z-index: 999;
            position: fixed;
            --df-messenger-font-color: #000000;
            --df-messenger-font-family: Roboto;
            --df-messenger-chat-background: #f3f6fc;
            --df-messenger-message-user-background: #DDDDDD;
            --df-messenger-message-bot-background: #EE8100;
            bottom: 16px;
            right: 16px;
          }
        `}
      </style>
    </>
  );
};

export default Chatbot;
