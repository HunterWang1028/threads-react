import {
  Avatar,
  Box,
  Divider,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  conversationsAtom,
  messagesAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SockertContext";

const MessageContainer = () => {
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useRecoilState(messagesAtom);
  const currentUser = useRecoilValue(userAtom);
  const { socket } = useSocket();
  const setConversations = useSetRecoilState(conversationsAtom);
  const messageContainerRef = useRef(null);
  const isAtBottomRef = useRef(true);

  useEffect(() => {
    socket.on("newMessage", (message) => {
      if (selectedConversation._id === message.conversationId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }

      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === message.conversationId) {
            return {
              ...conversation,
              lastMessage: {
                ...conversation.lastMessage,
                text: message.text,
                sender: message.sender,
              },
              // Increment unseen count only if not from current user
              // unseenCount:
              //   conversation.unseenCount +
              //   (message.sender !== currentUser._id ? 1 : 0),
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, selectedConversation, setConversations, messages, setMessages]);

  useEffect(() => {
    const lastMessageIsFromOtherUser =
      messages.length &&
      messages[messages.length - 1].sender !== currentUser._id;
    if (lastMessageIsFromOtherUser) {
      socket.emit("markMessagesAsSeen", {
        conversationId: selectedConversation._id,
        userId: selectedConversation.userId,
      });
    }

    socket.on("messagesSeen", ({ conversationId }) => {
      if (selectedConversation._id === conversationId) {
        setMessages((prev) => {
          const updatedMessages = prev.map((message) => {
            if (!message.seen) {
              return {
                ...message,
                seen: true,
              };
            }
            return message;
          });
          return updatedMessages;
        });
      }
    });
    return () => socket.off("messageSeen");
  }, [socket, currentUser._id, messages, selectedConversation, setMessages]);

  useEffect(() => {
    const getMessages = async () => {
      setMessages([]);
      try {
        const res = await fetch(`/api/messages/${selectedConversation.userId}`);
        const data = await res.json();
        if (data.error) return showToast("Error", data.error, "error");
        setMessages(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoadingMessages(false);
      }
    };

    getMessages();
  }, [showToast, selectedConversation.userId, setMessages]);

  // Set scroll position to the bottom when conversation is selected
  useEffect(() => {
    if (messageContainerRef.current && !loadingMessages) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [selectedConversation, loadingMessages]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (isAtBottomRef.current && !loadingMessages) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages, loadingMessages]);

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    isAtBottomRef.current = scrollTop + clientHeight >= scrollHeight - 50; // Adjust threshold as needed
  };

  return (
    <Flex
      flex={100}
      bg={useColorModeValue("gray.100", "#101010")}
      borderRadius={"md"}
      flexDirection={"column"}
      p={2}
    >
      {/* Message header */}
      <Flex
        w={"full"}
        h={12}
        alignItems={"center"}
        gap={2}
        my={1}
        py={5}
        position={{ base: "sticky", md: "relative" }} // Sticky on small devices
        top={0} // Stick to top
        zIndex={2} // Ensure it's above the content
        bg={useColorModeValue("gray.100", "#101010")}
      >
        <Avatar
          src={selectedConversation.userProfilePic}
          size={{ base: "sm", md: "md", lg: "lg" }}
        />
        <Text display={"flex"} alignItems={"center"}>
          {selectedConversation.name}
          <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
      </Flex>
      <Divider />

      {/* Messages */}
      <Flex
        ref={messageContainerRef}
        flexDirection={"column"}
        gap={4}
        my={4}
        onScroll={handleScroll}
        height={"full"}
        overflowY={"auto"}
        sx={{
          scrollbarWidth: "thin", // For Firefox
        }}
        p={2}
      >
        {loadingMessages
          ? [...Array(5)].map((_, i) => (
              <Flex
                key={i}
                gap={2}
                alignItems={"center"}
                p={1}
                borderRadius={"md"}
                alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
              >
                {i % 2 === 0 && <SkeletonCircle size={7} />}
                <Flex flexDirection={"column"} gap={2}>
                  <Skeleton
                    h={"8px"}
                    w={"100px"}
                    alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
                  />
                  <Skeleton h={"8px"} w={"200px"} />
                </Flex>
                {i % 2 !== 0 && <SkeletonCircle size={7} />}
              </Flex>
            ))
          : messages.map((message, index) => (
              <Message
                key={message._id}
                message={message}
                ownMessage={currentUser._id === message.sender}
                previousMessage={index > 0 ? messages[index - 1] : undefined}
              />
            ))}
      </Flex>
      <Box
        position="sticky"
        bottom={0}
        py={3}
        bg={useColorModeValue("gray.100", "#101010")}
        zIndex="1"
      >
        <MessageInput setMessages={setMessages} />
      </Box>
    </Flex>
  );
};

export default MessageContainer;
