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

const PostActions = ({ liked, setLiked, thread }) => {
  const showToast = useShowToast();
  const copyUrl = () => {
    const currentUrl = window.location.href; // TODO: change to post url
    navigator.clipboard.writeText(currentUrl).then(() => {
      showToast("Success", "Profile link copied", "success");
    });
  };
  return (
    <Flex flexDirection="column">
      <Flex gap={2} my={2} onClick={(e) => e.preventDefault()}>
        <Image
          src={liked ? "/public/heart-filled.svg" : "/public/heart-gray.svg"}
          alt="like"
          w={6}
          h={6}
          onClick={() => setLiked(!liked)}
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
