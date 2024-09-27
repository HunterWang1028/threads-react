import {
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
} from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const PostActions = ({ thread: currentThread }) => {
  const user = useRecoilValue(userAtom);
  const [liked, setLiked] = useState(currentThread.likes.includes(user?._id));
  const [thread, setThread] = useState(currentThread);
  // const [comment, setComment] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  // const [isCommenting, setIsCommenting] = useState(false);
  const showToast = useShowToast();
  // const { isOpen, onOpen, onClose } = useDisclosure();

  const copyUrl = () => {
    const currentUrl = window.location.href; // TODO: change to post url
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

  return (
    <Flex flexDirection="column">
      <Flex gap={2} my={2} onClick={(e) => e.preventDefault()}>
        <Image
          src={liked ? "/public/heart-filled.svg" : "/public/heart-gray.svg"}
          alt="like"
          w={6}
          h={6}
          onClick={handleLike}
        />
        <Text color={"gray.light"} fontSize="sm">
          {thread?.likes.length}
        </Text>

        <Image src="/public/reply.svg" alt="comment" w={6} h={6} />
        <Text color={"gray.light"} fontSize="sm">
          {thread?.children.length}
        </Text>
        <Menu>
          <MenuButton>
            <Image src="/public/share.svg" alt="share" w={6} h={6} />
          </MenuButton>
          <Portal>
            <MenuList bg={"gray.dark"}>
              <MenuItem bg={"gray.dark"} onClick={copyUrl}>
                Copy Link
              </MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      </Flex>

      {/* <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize="sm">
          post.replies.length replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize="sm">
          post.likes.length likes
        </Text>
      </Flex> */}

      {/* <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Input
                placeholder="Reply goes here.."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              size={"sm"}
              mr={3}
              isLoading={isReplying}
              onClick={handleReply}
            >
              Reply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}
    </Flex>
  );
};

export default PostActions;
