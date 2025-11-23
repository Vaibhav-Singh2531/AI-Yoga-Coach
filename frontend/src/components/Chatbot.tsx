import React from "react";

interface ChatbotProps {
  user_id: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ user_id }) => {
  const typebotUrl = `https://typebot.io/my-typebot-6zy714b?user_id=${encodeURIComponent(user_id)}`;

  return (
    <iframe
      key={user_id} // ensures stability for each user
      src={typebotUrl}
      style={{
        width: "100%",
        height: "500px",
        border: "none",
        borderRadius: "8px",
      }}
      allow="camera; microphone; autoplay; clipboard-write; encrypted-media;"
      title="Typebot Chat"
    />
  );
};

export default Chatbot;