import {
  Avatar,
  Box,
  Divider,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { AiOutlineLink } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import PostActions from "./PostActions";
import { formatDistanceToNow } from "date-fns";
import useShowToast from "../hooks/useShowToast";
import { BsThreeDots } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import { DeleteIcon } from "@chakra-ui/icons";

const ThreadCard = ({ thread, author, lastThread }) => {
  const navigate = useNavigate();
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [threads, setThreads] = useRecoilState(postsAtom);
  const copyUrl = () => {
    const currentUrl = window.location.href + `/thread/${thread._id}`;
    navigator.clipboard.writeText(currentUrl).then(() => {
      showToast("Success", "Link Copied", "success");
    });
  };

  const handleDelete = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/threads/${thread._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post deleted", "success");
      setThreads(threads.filter((t) => t._id !== threads._id));
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return (
    <Link to={`/${author.username}/thread/${thread._id}`}>
      <Flex gap={3} py={5}>
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
          {/* {thread.children.length > 0 && (
            <Box width="1px" h={"78%"} bg={"gray.light"} my={2}></Box>
          )}{" "}
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
                ))} */}
          {/* </Box> */}
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
              <Box onClick={(e) => e.preventDefault()}>
                <Menu>
                  <MenuButton>
                    <BsThreeDots />
                  </MenuButton>
                  <Portal>
                    <MenuList
                      bgColor={useColorModeValue("gray.100", "#101010")}
                    >
                      <MenuItem
                        bgColor={useColorModeValue("gray.100", "#101010")}
                        onClick={copyUrl}
                        _hover={{
                          bg: useColorModeValue("gray.400", "gray.600"),
                        }}
                        justifyContent={"space-between"}
                      >
                        Copy Link
                        <AiOutlineLink />
                      </MenuItem>
                      {currentUser?._id === thread.author._id && (
                        <MenuItem
                          //eslint-disable-next-line
                          bgColor={useColorModeValue("gray.100", "#101010")}
                          onClick={handleDelete}
                          _hover={{
                            //eslint-disable-next-line
                            bg: useColorModeValue("gray.400", "gray.600"),
                          }}
                          justifyContent={"space-between"}
                        >
                          Delete Thread
                          <DeleteIcon />
                        </MenuItem>
                      )}
                    </MenuList>
                  </Portal>
                </Menu>
              </Box>
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
      {!lastThread ? <Divider /> : null}
    </Link>
  );
};

export default ThreadCard;
