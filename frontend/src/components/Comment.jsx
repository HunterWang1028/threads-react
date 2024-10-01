import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import PostActions from "./PostActions";
import { Link } from "react-router-dom";

const Comment = ({ reply, lastReply }) => {
  return (
    <>
      <Link to={`/${reply.author.username}/thread/${reply._id}`}>
        <Flex gap={4} py={2} my={2} w={"full"}>
          <Avatar src={reply.author.profilePic} size={"sm"} />
          <Flex gap={1} w={"full"} flexDirection={"column"}>
            <Flex
              w={"full"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Text fontSize="sm" fontWeight="bold">
                {reply.author.username}
              </Text>
            </Flex>
            <Text>{reply.text}</Text>
            <Flex gap={1}>
              <PostActions thread={reply} />
            </Flex>
          </Flex>
        </Flex>
        {!lastReply ? <Divider /> : null}
      </Link>
    </>
  );
};

export default Comment;
