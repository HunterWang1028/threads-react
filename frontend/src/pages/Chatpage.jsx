import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Conversation from "../components/Conversation";
import { useEffect, useState } from "react";
import MessageContainer from "../components/MessageContainer";
import { RiMessengerLine } from "react-icons/ri";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  conversationsAtom,
  messagesAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SockertContext";

const Chatpage = () => {
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const currentUser = useRecoilValue(userAtom);
  const [messages, setMessages] = useRecoilState(messagesAtom);

  const [loadingConversations, setLoadingConversations] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchingUser, setSearchingUser] = useState(false);
  const showToast = useShowToast();
  const { socket, onlineUsers } = useSocket();

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch("api/messages/conversations");
        const data = await res.json();
        if (data.error) return showToast("Error", data.error, "error");
        setConversations(data);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setLoadingConversations(false);
      }
    };
    getConversations();
  }, [showToast, setConversations]);

  useEffect(() => {
    socket?.on("newMessage", (message) => {
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
      socket?.off("newMessage");
    };
  }, [socket, selectedConversation, setConversations, messages, setMessages]);

  useEffect(() => {
    socket?.on("messagesSeen", ({ conversationId }) => {
      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === conversationId) {
            return {
              ...conversation,
              lastMessage: {
                ...conversation.lastMessage,
                seen: true,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });
    return () => socket?.off("messagesSeen");
  }, [socket, setConversations]);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchingUser(true);
    try {
      const res = await fetch(`/api/users/profile/${searchText}`);
      const searchedUser = await res.json();
      if (searchedUser.error) {
        return showToast("Error", searchedUser.error, "error");
      }

      const messagingYourself = searchedUser._id === currentUser._id;
      if (messagingYourself) {
        return showToast("Error", "You cannot message yourself", "error");
      }

      const conversationAlreadyExists = conversations.find(
        (conversation) => conversation.participants[0]._id === searchedUser._id
      );
      if (conversationAlreadyExists) {
        setSelectedConversation({
          _id: conversationAlreadyExists._id,
          userId: searchedUser._id,
          username: searchedUser.username,
          userProfilePic: searchedUser.profilePic,
        });
        return;
      }

      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            name: searchedUser.name,
            profilePic: searchedUser.profilePic,
          },
        ],
      };
      setConversations((prevConvs) => [...prevConvs, mockConversation]);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setSearchingUser(false);
    }
  };

  return (
    <Box
      position={"absolute"}
      left={"50%"}
      w={"100%"}
      h={{ base: "85vh", md: "90vh" }}
      p={4}
      transform={"translateX(-50%)"}
    >
      <Flex
        gap={4}
        flexDirection={{
          base: "column",
          md: "row",
        }}
        maxW={{
          sm: "450px",
          md: "full",
        }}
        mx={"auto"}
        h={"full"}
      >
        <Flex
          flex={30}
          gap={2}
          flexDirection={"column"}
          w={"full"}
          mx={"auto"}
          display={selectedConversation._id && { base: "none", md: "block" }}
        >
          <Text
            fontWeight={700}
            color={useColorModeValue("gray.600", "gray.400")}
          >
            {currentUser.username}
          </Text>
          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={"center"} gap={2} py={4}>
              <Input
                placeholder="Search for a user"
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Button
                size={"sm"}
                onClick={handleConversationSearch}
                isLoading={searchingUser}
              >
                <SearchIcon />
              </Button>
            </Flex>
          </form>
          {loadingConversations
            ? [...Array(5)].map((_, i) => (
                <Flex
                  key={i}
                  gap={4}
                  alignItems={"center"}
                  p={"1"}
                  borderRadius={"md"}
                >
                  <Box>
                    <SkeletonCircle size={"10"} />
                  </Box>
                  <Flex w={"full"} flexDirection={"column"} gap={3}>
                    <Skeleton h={"10px"} w={"80px"} />
                    <Skeleton h={"8px"} w={"90%"} />
                  </Flex>
                </Flex>
              ))
            : conversations.map((conversation) => (
                <Conversation
                  key={conversation._id}
                  isOnline={onlineUsers.includes(
                    conversation.participants[0]._id
                  )}
                  conversation={conversation}
                />
              ))}
        </Flex>
        <Center height={"full"} display={{ base: "none", md: "block" }}>
          <Divider orientation={"vertical"} />
        </Center>

        {selectedConversation._id ? (
          <MessageContainer />
        ) : (
          <Flex flex={70} display={{ base: "none", md: "block" }}>
            <Flex
              borderRadius={"md"}
              p={2}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              height={"400px"}
              gap={2}
            >
              <RiMessengerLine size={70} />
              <Text fontSize={20}>Select a conversation to start chating</Text>
            </Flex>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default Chatpage;
