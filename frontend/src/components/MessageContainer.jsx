import {
  Avatar,
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

const MessageContainer = () => {
  return (
    <Flex
      flex={"70%"}
      bg={useColorModeValue("gray.200", "gray.dark")}
      borderRadius={"md"}
      flexDirection={"column"}
      p={2}
    >
      {/* Message header */}
      <Flex w={"full"} h={12} alignItems={"center"} gap={2} mb={1}>
        <Avatar src="" size={"sm"} />
        <Text display={"flex"} alignItems={"center"}>
          user.name <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
      </Flex>
      <Divider />

      <Flex
        flexDirection={"column"}
        gap={4}
        my={4}
        height={"400px"}
        overflowY={"auto"}
        sx={{
          scrollbarWidth: "thin", // For Firefox
        }}
        p={2}
        pr={4}
      >
        {true &&
          [...Array(5)].map((_, i) => (
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
          ))}
        <Message ownMessage={true} />
        <Message ownMessage={false} />
        <Message ownMessage={true} />
      </Flex>
      <MessageInput />
    </Flex>
  );
};

export default MessageContainer;
