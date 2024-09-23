import { Avatar, Box, Divider, Flex, Image, Text } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
// import PostActions from "../components/PostActions";

const Postpage = () => {
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src="" size={"md"} name="poset.username" />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              post.username
            </Text>
            <Image src="/verified.png" w={4} h={4} ml={1} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"sm"} color={"gray.light"}>
            TODO:time
          </Text>
          <BsThreeDots />
        </Flex>
      </Flex>

      <Text my={3}>currentPost.text</Text>

      <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"gray.light"}
      >
        <Image src={""} w={"full"} />
      </Box>

      <Flex gap={3} my={3}>
        {/* <PostActions post={currentPost} /> */}
      </Flex>

      <Divider my={4} />

      {/* {currentPost.replies.map((reply) => (
				<Comment
					key={reply._id}
					reply={reply}
					lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id}
				/>
			))} */}
    </>
  );
};

export default Postpage;
