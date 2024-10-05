import { Text, Flex } from "@chakra-ui/react";
import { getRelativeDateTime, isSameDay } from "../utils/utils.js";

const DateIndicator = ({ message, previousMessage }) => {
  return (
    <>
      {!previousMessage ||
      !isSameDay(previousMessage.createdAt, message.createdAt) ? (
        <Flex justify="center" mb={2}>
          <Text
            fontSize="sm"
            color="gray.500"
            bg="white"
            p={1}
            px={2}
            borderRadius="xl"
            zIndex={50}
            _dark={{ bg: "gray.700", color: "gray.400" }} // Adjust for dark mode
          >
            {getRelativeDateTime(message, previousMessage)}
          </Text>
        </Flex>
      ) : null}
    </>
  );
};

export default DateIndicator;
