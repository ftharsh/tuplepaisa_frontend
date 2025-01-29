import React from "react";
import { Bot, Sparkles } from "lucide-react";

const GuideAvatar = ({ message, isVisible }) => (
  <div
    className={`fixed bottom-4 right-4 flex items-end space-x-3 transition-all duration-300 
      ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
  >
    <div className="max-w-xs bg-blue-500/20 backdrop-blur-lg p-4 rounded-xl rounded-br-none">
      <p className="text-white text-sm">{message}</p>
    </div>
    <div className="relative">
      <div
        className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 
          flex items-center justify-center"
      >
        <Bot className="w-6 h-6 text-white" />
      </div>
      <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-spin" />
    </div>
  </div>
);

export default GuideAvatar;
