import { Avatar, Flex, Text } from "@chakra-ui/react";

const Message = ({ ownMessage }) => {
  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={"end"}>
          <Text maxW={"350px"} bg={"blue.400"} p={1} borderRadius={"md"}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus,
            architecto. Error dolorem illum impedit laboriosam labore nulla,
            tempore praesentium corporis.
          </Text>
          <Avatar src="" w={7} h={7} />
        </Flex>
      ) : (
        <Flex gap={2}>
          <Avatar src="" w={7} h={7} />
          <Text maxW={"350px"} bg={"gray.600"} p={1} borderRadius={"md"}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus,
            architecto. Error dolorem illum impedit laboriosam labore nulla,
            tempore praesentium corporis.
          </Text>
        </Flex>
      )}
    </>
  );
};

export default Message;
