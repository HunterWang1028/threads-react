import { Flex, Image, useColorMode } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import { RiMessengerLine } from "react-icons/ri";
const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const currentUser = useRecoilValue(userAtom);

  return (
    <Flex justifyContent={"space-between"} mt={6} mb={12}>
      {currentUser && (
        <Link to={"/"}>
          <Image src="/public/home.svg" size={24} />
        </Link>
      )}
      <Image
        cursor={"pointer"}
        w={7}
        alt="logo"
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />
      {currentUser && (
        <Flex alignItems={"center"} gap={4}>
          <Link to={`/${currentUser.username}`}>
            <RxAvatar size={28} />
            {/* <Avatar src={currentUser.profilePic} size={"sm"} /> */}
          </Link>
          <Link to={`/chat`}>
            <RiMessengerLine size={28} />
          </Link>
        </Flex>
      )}
    </Flex>
  );
};

export default Header;
