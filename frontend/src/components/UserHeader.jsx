import {
  Avatar,
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link } from "react-router-dom";
import { useState } from "react";

const UserHeader = ({ user }) => {
  const showToast = useShowToast();

  const currentUser = useRecoilValue(userAtom); // the logged in user
  const [following, setFollowing] = useState(
    user.followers.includes(currentUser._id)
  );
  const [isLoading, setIsLoading] = useState(false);

  const copyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      showToast("Success", "Link Copied", "success");
    });
  };

  const handleFollow = async () => {
    if (!currentUser) {
      showToast("Error", "Please login to follow", "error");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      // only render on client side to show the accurate follower count
      if (following) {
        user.followers.pop();
      } else {
        user.followers.push(currentUser._id);
      }

      setFollowing(!following);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user.username}</Text>
          </Flex>
        </Box>
        <Box>
          {user.profilePic ? (
            <Avatar
              name={user.name}
              src={user.profilePic}
              size={{
                base: "lg",
                md: "xl",
              }}
            />
          ) : (
            <Avatar
              name={user.name}
              src="https://bit.ly/broken-link"
              size={{
                base: "lg",
                md: "xl",
              }}
            />
          )}
        </Box>
      </Flex>
      <Text>{user.bio}</Text>
      {currentUser._id === user._id && (
        <Link to="/update">
          <Button size={"sm"}>Update Profile</Button>
        </Link>
      )}
      {currentUser._id !== user._id && (
        <Button size={"sm"} onClick={handleFollow} isLoading={isLoading}>
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyUrl}>
                    Copy Link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
