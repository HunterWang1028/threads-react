import { Avatar, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/messagesAtom";
// import userAtom from "../atoms/userAtom";

const Message = ({ ownMessage, message }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  // const user = useRecoilValue(userAtom);
  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"}>
          <Text
            maxW={"350px"}
            // eslint-disable-next-line
            bg={useColorModeValue("blue.200", "blue.400")}
            py={2}
            px={3}
            borderRadius={"md"}
            alignContent={"center"}
            fontSize={{ base: "sm", md: "md", lg: "lg" }}
          >
            {message.text}
          </Text>
          {/* <Avatar src={user.profilePic} /> */}
        </Flex>
      ) : (
        <Flex>
          <Avatar
            src={selectedConversation.userProfilePic}
            size={{ base: "sm", md: "md", lg: "lg" }}
          />
          <Text maxW={"350px"} bg={"gray.600"} borderRadius={"md"}>
            {message.text}
          </Text>
        </Flex>
      )}
    </>
  );
};

export default Message;
