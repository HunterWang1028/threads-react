import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { useRef } from "react";

export const SuggestedUserPC = ({ user }) => {
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

  return (
    <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
      {/* left side */}
      <Flex gap={2} as={Link} to={`${user.username}`}>
        <Avatar src={user.profilePic} />
        <Box>
          <Text fontSize={"sm"} fontWeight={"bold"}>
            {user.username}
          </Text>
          <Text color={"gray.light"} fontSize={"sm"}>
            {user.name}
          </Text>
        </Box>
      </Flex>
      {/* right side */}
      <Button
        size={"sm"}
        color={following ? "black" : "white"}
        bg={following ? "white" : "blue.400"}
        onClick={handleFollowUnfollow}
        isLoading={updating}
        _hover={{
          color: following ? "black" : "white",
          opacity: ".8",
        }}
      >
        {following ? "Unfollow" : "Follow"}
      </Button>
    </Flex>
  );
};

export const SuggestedUserMobile = ({ user }) => {
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

  return (
    <Flex
      m={1}
      p={4}
      w={"125px"}
      direction={"column"}
      alignItems={"center"}
      borderRadius={"lg"}
      bg={useColorModeValue("gray.600", "gray.dark")}
    >
      <Flex as={Link} to={`${user.username}`}>
        <Avatar src={user.profilePic} size={"sm"} />
      </Flex>

      <Text fontSize={"sm"} fontWeight={"bold"} mt={2}>
        {user.username.length > 12
          ? user.username.slice(0, 12) + "..."
          : user.username}
      </Text>
      <Text color={"gray.light"} fontSize={"sm"} mb={2}>
        {user.name.length > 12 ? user.name.slice(0, 12) + "..." : user.name}
      </Text>

      <Button
        w={"full"}
        h={8}
        color={following ? "black" : "white"}
        bg={following ? "white" : "blue.400"}
        onClick={handleFollowUnfollow}
        isLoading={updating}
        _hover={{
          color: following ? "black" : "white",
          opacity: ".8",
        }}
      >
        {following ? "Unfollow" : "Follow"}
      </Button>
    </Flex>
  );
};

export const SuggestedUserCarousel = ({ suggestedUsers }) => {
  const scrollRef = useRef(null);

  // Function to scroll left
  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  // Function to scroll right
  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <Box position="relative" width="100%">
      {/* Left Arrow */}
      <IconButton
        icon={<ArrowBackIcon />}
        position="absolute"
        top="50%"
        left="0"
        zIndex="1"
        transform="translateY(-50%)"
        onClick={scrollLeft}
        aria-label="Scroll Left"
        borderRadius={50}
        size={"xs"}
        // bg="transparent" // No background color
        // _hover={{ bg: "transparent" }} // No hover background
        // _focus={{ boxShadow: "none" }} // No focus outline
      />

      {/* Card Container */}
      <Flex
        ref={scrollRef}
        overflowX="auto"
        gap={4}
        p={2}
        alignItems="center"
        scrollSnapType="x mandatory"
        scrollBehavior="smooth"
        css={{
          "::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {suggestedUsers.map((user) => (
          <SuggestedUserMobile key={user._id} user={user} />
        ))}
      </Flex>

      {/* Right Arrow */}
      <IconButton
        icon={<ArrowForwardIcon />}
        position="absolute"
        top="50%"
        right="0"
        zIndex="1"
        transform="translateY(-50%)"
        onClick={scrollRight}
        aria-label="Scroll Right"
        borderRadius={50}
        size={"xs"}
        // bg="transparent" // No background color
        // _hover={{ bg: "transparent" }} // No hover background
        // _focus={{ boxShadow: "none" }} // No focus outline
      />
    </Box>
  );
};
