import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
// import { BsThreeDots } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import PostActions from "./PostActions";
import { formatDistanceToNow } from "date-fns";
// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalFooter,
//   ModalBody,
//   ModalCloseButton,
// } from "@chakra-ui/react";

const ThreadCard = ({ thread, author }) => {
  const navigate = useNavigate();
  //   const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Link to={`/${author.username}/thread/${thread._id}}`}>
      <Flex gap={3} mb={4} py={5}>
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
            // onClick={onOpen}
          />
          {/* <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Modal Title</ModalHeader>
              <ModalCloseButton />
              <ModalBody>123</ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button variant="ghost">Secondary Action</Button>
              </ModalFooter>
            </ModalContent>
          </Modal> */}

          <Box width="1px" h={"78%"} bg={"gray.light"} my={2}></Box>
          <Box position={"relative"} w={"full"}>
            {thread.children.length > 0 &&
              thread.children
                .slice(0, 2)
                .map((children, index) => (
                  <Avatar
                    key={index}
                    src={children.author.profilePic}
                    name={children.author.name}
                    size={"sm"}
                    position={"absolute"}
                    objectFit={"cover"}
                    right={(index - 1) * -5}
                  />
                ))}
          </Box>
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
              {/* <BsThreeDots /> */}
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

          <Flex gap={3} my={1}>
            <PostActions thread={thread} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default ThreadCard;
