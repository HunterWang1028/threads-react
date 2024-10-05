import {
  Avatar,
  AvatarBadge,
  Flex,
  Image,
  Stack,
  Text,
  useColorModeValue,
  WrapItem,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";

import { selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";

const Conversation = ({ conversation, isOnline }) => {
  // we filtered out ourself from the participants array in the backend
  const user = conversation.participants[0];
  const lastMessage = conversation.lastMessage;
  const currentUser = useRecoilValue(userAtom);
  // const unseenCount = conversation.unseenCount;

  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );

  return (
    <Flex
      w={"100%"}
      gap={4}
      alignItems={"center"}
      p={2}
      _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.300", "gray.dark"),
        color: useColorModeValue("black", "white"),
      }}
      onClick={() =>
        setSelectedConversation({
          _id: conversation._id,
          userId: user._id,
          userProfilePic: user.profilePic,
          username: user.username,
          name: user.name,
          mock: conversation.mock,
        })
      }
      bg={
        selectedConversation?._id === conversation._id
          ? // eslint-disable-next-line
            useColorModeValue("gray.300", "gray.dark")
          : ""
      }
      borderRadius={"md"}
    >
      <WrapItem>
        <Avatar size={{ base: "sm", md: "md", lg: "lg" }} src={user.profilePic}>
          {isOnline && (
            <AvatarBadge
              boxSize={{ base: "1rem", md: "1.5rem" }}
              bg={"green.500"}
            />
          )}
        </Avatar>
      </WrapItem>
      <Stack direction={"column"} fontSize={{ base: "sm", md: "md" }}>
        <Text fontWeight={"700"} display={"flex"} alignItems={"center"}>
          {user.name} <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
        <Text
          fontSize={{ base: "xs", md: "sm" }}
          display={"flex"}
          alignItems={"center"}
          gap={1}
        >
          {lastMessage && currentUser._id === lastMessage.sender
            ? lastMessage.seen
              ? "Seen"
              : "Sent"
            : lastMessage.text.length > 18
            ? lastMessage.text.slice(0, 30) + "..."
            : lastMessage.text}
        </Text>
      </Stack>
    </Flex>
  );
};

export default Conversation;

// TODO: message sent from ourself show seen if seen, sent otherwise

{
  /* {lastMessage.text.length > 18
? lastMessage.text.substring(0, 18) + "..."
: lastMessage.text} */
}
