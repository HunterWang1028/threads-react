import {
  Avatar,
  Button,
  Flex,
  FormControl,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Portal,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import CommentCard from "./CommentCard";
import { AiOutlineLink } from "react-icons/ai";

const PostActions = ({ thread: currentThread }) => {
  const user = useRecoilValue(userAtom);
  const [liked, setLiked] = useState(currentThread.likes.includes(user?._id));
  const [thread, setThread] = useState(currentThread);
  const [reply, setReply] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const showToast = useShowToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const copyUrl = () => {
    const currentUrl = window.location.href + `/thread/${currentThread._id}`;
    navigator.clipboard.writeText(currentUrl).then(() => {
      showToast("Success", "Profile link copied", "success");
    });
  };

  const handleLike = async () => {
    if (!user)
      return showToast(
        "Error",
        "You must be logged in to like a post",
        "error"
      );
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await fetch("/api/threads/like/" + thread._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.error) return showToast("Error", data.error, "error");
      console.log(data);

      if (!liked) {
        // add the id of the current user to thread.likes array
        setThread({ ...thread, likes: [...thread.likes, user._id] });
        // const updatedThreads = threads.map((t) => {
        //   if (t._id === thread._id) {
        //     return { ...t, likes: [...t.likes, user._id] };
        //   }
        //   return t;
        // });
        // setThreads(updatedThreads);
      } else {
        // remove the id of the current user from thread.likes array
        setThread({
          ...thread,
          likes: thread.likes.filter((id) => id !== user._id),
        });
        // const updatedThreads = threads.map((t) => {
        //   if (t._id === thread._id) {
        //     return { ...t, likes: t.likes.filter((id) => id !== user._id) };
        //   }
        //   return t;
        // });
        // setThreads(updatedThreads);
      }
      setLiked(!liked);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsLiking(false);
    }
  };

  const handleReply = async () => {
    if (!user)
      return showToast(
        "Error",
        "You must be logged in to reply to a post",
        "error"
      );
    if (isReplying) return;
    setIsReplying(true);
    try {
      const res = await fetch("/api/threads/comment/" + currentThread._id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: reply }),
      });
      const data = await res.json();
      if (data.error) return showToast("Error", data.error, "error");

      setThread({ ...thread, children: [...thread.children, data.reply] });
      onClose();
      setReply("");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <Flex flexDirection="column">
      <Flex gap={2} my={2} onClick={(e) => e.preventDefault()}>
        <Image
          src={liked ? "/heart-filled.svg" : "/heart-gray.svg"}
          alt="like"
          w={6}
          h={6}
          onClick={handleLike}
          cursor={"pointer"}
        />
        <Text color={"gray.light"} fontSize="sm">
          {thread?.likes.length}
        </Text>

        <Image
          src="/reply.svg"
          alt="comment"
          w={6}
          h={6}
          onClick={onOpen}
          cursor={"pointer"}
        />
        <Text color={"gray.light"} fontSize="sm">
          {thread?.children.length}
        </Text>
        <Menu>
          <MenuButton>
            <Image src="/share.svg" alt="share" w={6} h={6} />
          </MenuButton>
          <Portal>
            <MenuList bgColor={useColorModeValue("gray.100", "#101010")}>
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
            </MenuList>
          </Portal>
        </Menu>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose} size={"lg"}>
        <ModalOverlay />
        <ModalContent bgColor={useColorModeValue("gray.300", "gray.dark")}>
          <Flex margin={4}>
            <CommentCard thread={currentThread} author={currentThread.author} />
          </Flex>
          <ModalBody>
            <FormControl>
              <Flex>
                <Avatar src={user.profilePic} size={"md"} right={2} />
                <Flex flex={1} flexDirection={"column"} gap={2} ml={2}>
                  <Flex w={"full"} alignItems={"center"}>
                    <Text fontSize={"sm"} fontWeight={"bold"}>
                      {user.name}
                    </Text>

                    <Image src="/verified.png" w={4} h={4} ml={1} />
                  </Flex>
                  <Textarea
                    placeholder={`Reply to @${currentThread?.author?.username} `}
                    value={reply}
                    _placeholder={{
                      color: useColorModeValue("gray.800", "gray.400"),
                    }}
                    border={"none"}
                    _focusVisible={"none"}
                    onChange={(e) => setReply(e.target.value)}
                    fontSize={"sm"}
                    padding={0}
                  />
                </Flex>
              </Flex>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              color={useColorModeValue("gray.800", "gray.400")}
              colorScheme="none"
              _hover={"none"}
              border={"1px"}
              size={"sm"}
              mr={3}
              isLoading={isReplying}
              onClick={handleReply}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default PostActions;
