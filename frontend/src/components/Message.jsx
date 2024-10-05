import { Avatar, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import DateIndicator from "./DateIndicator.jsx";
// import userAtom from "../atoms/userAtom";

const Message = ({ ownMessage, message, previousMessage }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  // const user = useRecoilValue(userAtom);

  const formatTime = (date) => {
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return date.toLocaleString("zh-tw", options);
  };

  const formattedTime = formatTime(new Date(message.createdAt));

  return (
    <>
      <DateIndicator message={message} previousMessage={previousMessage} />
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"}>
          <Flex direction={"column"} alignSelf={"flex-end"}>
            <Text
              fontSize={{ base: "2xs", md: "sm" }}
              color="gray.500"
              alignSelf={"flex-end"}
            >
              {message.seen && "Seen"}
            </Text>
            <Text fontSize={{ base: "2xs", md: "sm" }} color="gray.500">
              {formattedTime}
            </Text>
          </Flex>
          <Text
            maxW={{ base: "180px", md: "350px" }}
            // eslint-disable-next-line
            bg={useColorModeValue("blue.200", "blue.400")}
            py={1}
            px={3}
            borderRadius={"xl"}
            alignContent={"center"}
            fontSize={{ base: "sm", md: "md", lg: "lg" }}
          >
            {message.text}
          </Text>
          {/* <Avatar src={user.profilePic} /> */}
        </Flex>
      ) : (
        <Flex alignItems={"center"}>
          <Avatar
            src={selectedConversation.userProfilePic}
            size={{ base: "sm", md: "md", lg: "lg" }}
          />
          <Flex>
            <Text
              maxW={{ base: "180px", md: "350px" }}
              // eslint-disable-next-line
              bg={useColorModeValue("gray.200", "gray.600")}
              ml={2}
              py={1}
              px={3}
              borderRadius={"xl"}
              alignContent={"center"}
              fontSize={{ base: "sm", md: "md", lg: "lg" }}
            >
              {message.text}
            </Text>
            <Text
              fontSize={{ base: "2xs", md: "sm" }}
              color="gray.500"
              alignSelf={"flex-end"}
              ml={2}
            >
              {formattedTime}
            </Text>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default Message;
