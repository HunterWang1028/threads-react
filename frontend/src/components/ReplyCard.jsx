import { Avatar, Box, Divider, Flex, Image, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import PostActions from "./PostActions";
import { formatDistanceToNow } from "date-fns";

const ReplyCard = ({ thread, author, parent, parentAuthor }) => {
  const navigate = useNavigate();

  return (
    <>
      <Link to={`/${parentAuthor.username}/thread/${parent._id}`}>
        <Flex gap={3} pt={5} mr={3}>
          <Flex flexDirection={"column"} alignItems={"center"}>
            {/* TODO: can add a user info modal with follow button on the profile pic */}
            <Avatar
              size="md"
              name={parentAuthor.name}
              src={parentAuthor.profilePic}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${parentAuthor.username}`);
              }}
            />

            <Box width="1px" h={"100%"} bg={"gray.light"} my={2}></Box>
          </Flex>
          <Flex flex={1} flexDirection={"column"} gap={2}>
            <Flex justifyContent={"space-between"} w={"full"}>
              <Flex w={"full"} alignItems={"center"}>
                <Text
                  fontSize={"sm"}
                  fontWeight={"bold"}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/${parentAuthor.username}`);
                  }}
                >
                  {parentAuthor.name}
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
                  {formatDistanceToNow(new Date(parent.createdAt))}
                </Text>
              </Flex>
            </Flex>

            <Text fontSize={"sm"}>{parent.text}</Text>
            {parent.img && (
              <Box
                borderRadius={6}
                overflow={"hidden"}
                border={"1px solid"}
                borderColor={"gray.light"}
              >
                <Image src={parent.img} w={"full"} />
              </Box>
            )}

            <Flex gap={3}>
              <PostActions thread={parent} />
            </Flex>
          </Flex>
        </Flex>
      </Link>
      <Link to={`/${author.username}/thread/${thread._id}`}>
        <Flex gap={3} mr={3}>
          <Flex flexDirection={"column"} alignItems={"center"}>
            {/* TODO: can add a user info modal with follow button on the profile pic */}
            <Avatar
              size="md"
              name={author.name}
              src={author.profilePic}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${author.username}`);
              }}
            />
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

            <Flex gap={3}>
              <PostActions thread={thread} />
            </Flex>
          </Flex>
        </Flex>
        <Divider />
      </Link>
    </>
  );
};

export default ReplyCard;
