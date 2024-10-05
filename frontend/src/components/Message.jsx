import {
  Avatar,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Skeleton,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import DateIndicator from "./DateIndicator.jsx";
import { useState } from "react";
// import userAtom from "../atoms/userAtom";

const Message = ({ ownMessage, message, previousMessage }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  // const user = useRecoilValue(userAtom);

  const formatTime = (date) => {
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return date.toLocaleString("zh-tw", options);
  };

  const formattedTime = formatTime(new Date(message.createdAt));
  const [imgLoaded, setImgLoaded] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <DateIndicator message={message} previousMessage={previousMessage} />
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"}>
          <Flex direction={"column"} alignSelf={"flex-end"}>
            <Text
              fontSize={{ base: "2xs", md: "sm" }}
              color="gray.500"
              alignSelf={"flex-end"}
            >
              {message.seen && "Seen"}
            </Text>
            <Text fontSize={{ base: "2xs", md: "sm" }} color="gray.500">
              {formattedTime}
            </Text>
          </Flex>
          {message.text && (
            <Text
              maxW={{ base: "180px", md: "350px" }}
              // eslint-disable-next-line
              bg={useColorModeValue("blue.200", "blue.400")}
              py={1}
              px={3}
              borderRadius={"xl"}
              alignContent={"center"}
              fontSize={{ base: "sm", md: "md", lg: "lg" }}
            >
              {message.text}
            </Text>
          )}
          {message.img && !imgLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image
                src={message.img}
                alt="Message image"
                hidden
                onLoad={() => setImgLoaded(true)}
                borderRadius={4}
              />
              <Skeleton w={"150px"} h={"150px"} />
            </Flex>
          )}
          {message.img && imgLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image
                src={message.img}
                alt="Message image"
                borderRadius={4}
                onClick={onOpen}
                cursor={"pointer"}
              />
            </Flex>
          )}
        </Flex>
      ) : (
        <Flex alignItems={"center"}>
          <Avatar
            src={selectedConversation.userProfilePic}
            size={{ base: "sm", md: "md", lg: "lg" }}
          />
          <Flex>
            {message.text && (
              <Text
                maxW={{ base: "180px", md: "350px" }}
                // eslint-disable-next-line
                bg={useColorModeValue("gray.200", "gray.600")}
                ml={2}
                py={1}
                px={3}
                borderRadius={"xl"}
                alignContent={"center"}
                fontSize={{ base: "sm", md: "md", lg: "lg" }}
              >
                {message.text}
              </Text>
            )}
            {message.img && !imgLoaded && (
              <Flex mt={5} w={"200px"}>
                <Image
                  src={message.img}
                  alt="Message image"
                  hidden
                  onLoad={() => setImgLoaded(true)}
                  borderRadius={4}
                />
                <Skeleton w={"150px"} h={"150px"} />
              </Flex>
            )}
            {message.img && imgLoaded && (
              <Flex mt={5} w={"200px"} ml={2}>
                <Image
                  src={message.img}
                  alt="Message image"
                  borderRadius={4}
                  onClick={onOpen}
                  cursor={"pointer"}
                />
              </Flex>
            )}

            <Text
              fontSize={{ base: "2xs", md: "sm" }}
              color="gray.500"
              alignSelf={"flex-end"}
              ml={2}
            >
              {formattedTime}
            </Text>
          </Flex>
        </Flex>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        {/* eslint-disable-next-line */}
        <ModalContent bgColor={useColorModeValue("gray.200", "gray.dark")}>
          <ModalCloseButton />
          <ModalBody>
            <Flex mt={12} mb={5}>
              <Image src={message.img} />
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Message;
