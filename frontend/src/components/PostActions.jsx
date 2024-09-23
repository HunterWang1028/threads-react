import {
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  useToast,
} from "@chakra-ui/react";

const PostActions = ({ liked, setLiked }) => {
  const toast = useToast();
  const copyUrl = () => {
    const currentUrl = window.location.href; // TODO: change to post url
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast({
        title: "Success.",
        status: "success",
        description: "Profile link copied.",
        duration: 3000,
        isClosable: true,
      });
    });
  };
  return (
    <Flex flexDirection="column">
      <Flex gap={1} my={2} onClick={(e) => e.preventDefault()}>
        <Image
          src={liked ? "/public/heart-filled.svg" : "/public/heart-gray.svg"}
          alt="like"
          w={5}
          h={5}
          onClick={() => setLiked(!liked)}
        />

        <Image src="/public/reply.svg" alt="comment" w={5} h={5} />
        <Menu>
          <MenuButton>
            <Image src="/public/share.svg" alt="share" w={5} h={5} />
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
