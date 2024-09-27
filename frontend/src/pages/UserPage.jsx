import {
  Flex,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import UserHeader from "../components/UserHeader";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const showToast = useShowToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        setUser(data);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, [username, showToast]);

  if (!user && isLoading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!user && !isLoading) {
    return <h1>User not found</h1>;
  }

  return (
    <>
      <UserHeader user={user} />
      <Tabs>
        <TabList>
          <Tab w={"full"} fontWeight={"bold"}>
            Threads
          </Tab>
          <Tab w={"full"} fontWeight={"bold"}>
            Replies
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel></TabPanel>
          <TabPanel>
            <p>123456</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default UserPage;
