import { Flex, Image, useColorMode } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import { RiMessengerLine } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoChevronBackOutline } from "react-icons/io5";
import { MdHomeFilled } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { MdKey } from "react-icons/md";
import useLogout from "../hooks/useLogout";
import { selectedConversationAtom } from "../atoms/messagesAtom";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  // eslint-disable-next-line
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const currentUser = useRecoilValue(userAtom);
  const { pathname } = useLocation();
  const logout = useLogout();
  const navigate = useNavigate();

  return (
    <Flex justifyContent={"space-between"} mt={6} mb={12}>
      {currentUser && pathname !== "/chat" && (
        <Link to={"/"}>
          <MdHomeFilled size={28} />
        </Link>
      )}
      {currentUser && pathname === "/chat" && (
        <IoChevronBackOutline
          size={28}
          onClick={() => {
            if (selectedConversation._id) {
              setSelectedConversation([]);
            } else {
              navigate(-1);
            }
          }}
          cursor={"pointer"}
        />
      )}

      <Image
        cursor={"pointer"}
        w={7}
        position={"absolute"}
        left="50%"
        transform="translateX(-50%)"
        alt="logo"
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />
      {currentUser && (
        <Flex alignItems={"center"} gap={4}>
          <Link to={`/chat`}>
            <RiMessengerLine size={28} />
          </Link>
          {pathname === `/${currentUser.username}` ? (
            <Menu>
              <MenuButton>
                <RxHamburgerMenu size={24} />
              </MenuButton>
              <MenuList
                bgColor={colorMode === "light" ? "gray.100" : "#101010"}
              >
                <MenuItem
                  justifyContent={"space-between"}
                  bgColor={colorMode === "light" ? "gray.100" : "#101010"}
                  _hover={{
                    bg: colorMode === "light" ? "gray.400" : "gray.600",
                  }}
                >
                  Change Password
                  <MdKey />
                </MenuItem>
                <MenuItem
                  onClick={logout}
                  bgColor={colorMode === "light" ? "gray.100" : "#101010"}
                  _hover={{
                    bg: colorMode === "light" ? "gray.400" : "gray.600",
                  }}
                  justifyContent={"space-between"}
                >
                  Logout
                  <MdLogout />
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Link to={`/${currentUser.username}`}>
              <RxAvatar size={28} />
            </Link>
          )}
        </Flex>
      )}
    </Flex>
  );
};

export default Header;
