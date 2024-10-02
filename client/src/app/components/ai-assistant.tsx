import React, { useContext, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, X } from "lucide-react";
import { ChatMessage, ChatState } from "../client";
import { useCompletionMutation, useFetchAiFlagsQuery } from "../queries/ai";
import ReactMarkdown from "react-markdown";

interface Conversation {
  isEnabled: boolean;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  chatState: ChatState;
  setChatState: (value: ChatState) => void;
}

const ConversationContext = React.createContext<Conversation>({
  isEnabled: true,
  isOpen: false,
  setIsOpen: () => {},
  chatState: {} as ChatState,
  setChatState: () => {},
});

export function AIAssistantProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const aiFlags = useFetchAiFlagsQuery();
  const isEnabled = aiFlags.data?.completions || false;

  const [isOpen, setIsOpen] = useState(false);
  const [chatState, setChatState] = useState({ messages: [] } as ChatState);

  return (
    <ConversationContext.Provider
      value={{
        isEnabled,
        isOpen,
        setIsOpen,
        chatState,
        setChatState,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

const VIEWING_MESSAGE_PREFIX = "--> I'm currently viewing ";

export function AIAssistant({ viewing }: { viewing?: string }) {
  const { isEnabled, isOpen, setIsOpen, chatState, setChatState } =
    useContext(ConversationContext);
  const [input, setInput] = useState("");
  const completionMutation = useCompletionMutation();

  const handleSubmit = async () => {
    const messages = [...chatState.messages];

    // Push extra context of what the user is currently viewing into the chat history...
    if (viewing) {
      messages.push({
        message_type: "human",
        content: VIEWING_MESSAGE_PREFIX + viewing,
      });
    }

    messages.push({
      message_type: "human",
      content: input,
    });
    setInput("");

    if (completionMutation) {
      const newMessageState = (
        await completionMutation.mutateAsync({ messages })
      ).messages.filter((m: ChatMessage) => {
        if (m.message_type == "human") {
          if (m.content.startsWith(VIEWING_MESSAGE_PREFIX)) {
            console.log("filtering out, ", m.content);
            return false;
          }
          return true;
        }
        return m.message_type == "ai";
      });
      setChatState({
        messages: newMessageState,
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setChatState({
      messages: [],
    });
  };

  const scrollAreaRef = useRef(null as HTMLDivElement | null);
  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollAreaRef?.current) {
        const scrollArea = scrollAreaRef.current;
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    }, 0);
  };

  useEffect(() => {
    scrollToBottom();
  }, [completionMutation.isPending]);

  if (!isEnabled) {
    return null;
  }
  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <Button
          className="fixed bottom-20 right-4 rounded-full p-4 z-10"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Open AI Assistant</span>
        </Button>
      )}

      {/* Chat box */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-[25rem] h-[40rem] flex flex-col z-10 bg-white">
          <CardHeader className="flex flex-row items-center">
            <CardTitle className="flex-1">AI Assistant</CardTitle>
            <Button
              className="relative -top-6 -right-4"
              variant="ghost"
              size="icon"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-full w-full pr-4" ref={scrollAreaRef}>
              <div className={`mb-4 text-left`}>
                <span className={`inline-block p-2 rounded-lg bg-muted`}>
                  Hello there! How can I help you today?
                </span>
              </div>
              {chatState.messages.map((m, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    m.message_type === "ai" ? "text-left" : "text-right"
                  }`}
                >
                  <span
                    className={`inline-block p-2 rounded-lg max-w-[90%] prose prose-sm ${
                      m.message_type === "ai"
                        ? "bg-muted"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </span>
                </div>
              ))}

              {completionMutation.isPending && (
                <div className="mb-4 text-left">
                  <span className="inline-block p-2 rounded-lg bg-muted">
                    <LoadingBubbles />
                  </span>
                </div>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-center space-x-2">
              <Input
                value={input}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    // Perform the action you want to handle when Enter is pressed
                    console.log("Enter key pressed!");
                    handleSubmit();
                  }
                }}
                onChange={(e) => {
                  setInput(e.target.value);
                }}
                placeholder="Type your message..."
              />
              <Button type="submit" size="icon" onMouseDown={handleSubmit}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
}

function LoadingBubbles() {
  return (
    <div className="flex space-x-2">
      <div
        className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
        style={{ animationDelay: "0ms" }}
      ></div>
      <div
        className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
        style={{ animationDelay: "150ms" }}
      ></div>
      <div
        className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
        style={{ animationDelay: "300ms" }}
      ></div>
    </div>
  );
}
