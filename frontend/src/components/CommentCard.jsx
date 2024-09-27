import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
// import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const CommentCard = ({ thread, author }) => {
  const navigate = useNavigate();

  return (
    <Flex gap={3} py={2}>
      <Flex flexDirection={"column"} alignItems={"center"}>
        <Avatar
          size="md"
          name={author.name}
          src={author.profilePic}
          onClick={(e) => {
            e.preventDefault();
            navigate(`/${author.username}`);
          }}
        />

        <Box width="1px" h={"full"} bg={"gray.light"} my={2}></Box>
        <Box position={"relative"} w={"full"}></Box>
      </Flex>
      <Flex flex={1} flexDirection={"column"} gap={2}>
        <Flex justifyContent={"space-between"} w={"full"}>
          <Flex w={"full"} alignItems={"center"}>
            <Text
              fontSize={"sm"}
              fontWeight={"bold"}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${author.username}`);
              }}
            >
              {author.name}
            </Text>

            <Image src="/verified.png" w={4} h={4} ml={1} />
          </Flex>
          <Flex gap={4} alignItems={"center"}>
            <Text
              fontSize={"xs"}
              color={"gray.light"}
              width={36}
              textAlign={"right"}
            >
              {formatDistanceToNow(new Date(thread.createdAt))}
            </Text>
          </Flex>
        </Flex>

        <Text fontSize={"sm"}>{thread.text}</Text>
        {thread.img && (
          <Box
            borderRadius={6}
            overflow={"hidden"}
            border={"1px solid"}
            borderColor={"gray.light"}
          >
            <Image src={thread.img} w={"full"} />
          </Box>
        )}
      </Flex>
    </Flex>
  );
};

export default CommentCard;
