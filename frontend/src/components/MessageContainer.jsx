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
import { useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useEffect, useRef, useState } from "react";

const MessageContainer = () => {
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const currentUser = useRecoilValue(userAtom);
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      setMessages([]);
      try {
        const res = await fetch(`/api/messages/${selectedConversation.userId}`);
        const data = await res.json();
        if (data.error) return showToast("Error", data.error, "error");
        setMessages(data);
        console.log(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoadingMessages(false);
      }
    };

    getMessages();
  }, [showToast, selectedConversation.userId]);

  return (
    <Flex
      flex={100}
      bg={useColorModeValue("gray.100", "#101010")}
      borderRadius={"md"}
      flexDirection={"column"}
      p={2}
    >
      {/* Message header */}
      <Flex w={"full"} h={12} alignItems={"center"} gap={2} my={1} pb={2}>
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
        flexDirection={"column"}
        gap={4}
        my={4}
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
          : messages.map((message) => (
              <Flex
                key={message._id}
                direction={"column"}
                ref={
                  messages.length - 1 === messages.indexOf(message)
                    ? messageEndRef
                    : null
                }
              >
                <Message
                  message={message}
                  ownMessage={currentUser._id === message.sender}
                />
              </Flex>
            ))}
      </Flex>
      <Box>
        <MessageInput setMessages={setMessages} />
      </Box>
    </Flex>
  );
};

export default MessageContainer;
