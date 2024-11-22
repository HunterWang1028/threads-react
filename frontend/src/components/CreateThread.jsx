import { AddIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";

const MAX_CHAR = 500;

const CreateThread = () => {
  const currentUser = useRecoilValue(userAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const fileRef = useRef(null);
  const showToast = useShowToast();

  const [threadText, setThreadText] = useState("");
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const [isLoading, setIsLoading] = useState(false);
  const [threads, setThreads] = useRecoilState(postsAtom);
  const { username } = useParams();

  const handleTextChange = (e) => {
    const inputText = e.target.value;

    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setThreadText(truncatedText);
      setRemainingChar(0);
    } else {
      setThreadText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  const handleCreateThread = async () => {
    setIsLoading(true);
    try {
      if (!currentUser) {
        showToast("Error", "Please login to create a Thread", "error");
        return;
      }

      const res = await fetch(`/api/threads/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          author: currentUser._id,
          text: threadText,
          img: imgUrl,
        }),
      });

      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Thread created successfully", "success");

      if (username === currentUser.username) {
        setThreads([data, ...threads]);
      }

      onClose();
      setThreadText("");
      setImgUrl("");
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={10}
        size={{ base: "md", md: "lg" }}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
        _hidden={"/chat"}
      >
        <AddIcon />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bgColor={useColorModeValue("gray.200", "gray.dark")}>
          <ModalHeader>Create Thread</ModalHeader>
          <ModalBody pb={6}>
            <FormControl>
              <Flex>
                <Avatar src={currentUser.profilePic} size={"md"} right={2} />
                <Flex flex={1} flexDirection={"column"} gap={2} ml={2}>
                  <Flex w={"full"} alignItems={"center"}>
                    <Text fontSize={"sm"} fontWeight={"bold"}>
                      {currentUser.name}
                    </Text>

                    <Image src="/verified.png" w={4} h={4} ml={1} />
                  </Flex>
                  <Textarea
                    placeholder="What's new?"
                    _placeholder={{
                      color: useColorModeValue("gray.800", "gray.500"),
                    }}
                    border={"none"}
                    _focusVisible={"none"}
                    onChange={handleTextChange}
                    value={threadText}
                    fontSize={"md"}
                    padding={0}
                  />
                </Flex>
              </Flex>
              <Text
                fontSize={"xs"}
                textAlign={"right"}
                m={1}
                color={useColorModeValue("gray.600", "gray.400")}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>
              <Input
                type="file"
                hidden
                ref={fileRef}
                onChange={handleImageChange}
              />
              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => fileRef.current.click()}
              />
            </FormControl>

            {imgUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imgUrl} alt="Selected img" />
                <CloseButton
                  onClick={() => {
                    setImgUrl("");
                  }}
                  color={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="none"
              color={useColorModeValue("gray.800", "gray.400")}
              _hover={"none"}
              border={"1px"}
              mr={3}
              size={"md"}
              onClick={handleCreateThread}
              isLoading={isLoading}
              isDisabled={!threadText}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateThread;
