import {
  Flex,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
} from "@chakra-ui/react";
import UserHeader from "../components/UserHeader";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import useGetUserProfile from "../hooks/useGetUserProfile";
import ThreadCard from "../components/ThreadCard";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const UserPage = () => {
  const { user, isLoading } = useGetUserProfile();
  const { username } = useParams();
  const showToast = useShowToast();
  const [threads, setThreads] = useRecoilState(postsAtom);
  const [isFetchingThreads, setIsFetchingThreads] = useState(true);

  useEffect(() => {
    const getThreads = async () => {
      if (!user) return;
      setIsFetchingThreads(true);
      try {
        const res = await fetch(`/api/threads/user/${username}`);
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setThreads(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setThreads([]);
      } finally {
        setIsFetchingThreads(false);
      }
    };

    getThreads();
  }, [username, showToast, setThreads, user]);

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
        <TabList
          position={"sticky"}
          top={0}
          zIndex={50}
          //eslint-disable-next-line
          bg={useColorModeValue("gray.100", "#101010")}
        >
          <Tab w={"full"} fontWeight={"bold"}>
            Threads
          </Tab>
          <Tab w={"full"} fontWeight={"bold"}>
            Replies
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {!isFetchingThreads && threads.length === 0 && (
              <h1>{user.name} have no threads yet...</h1>
            )}
            {isFetchingThreads && (
              <Flex justifyContent={"center"} my={12}>
                <Spinner size={"xl"} />
              </Flex>
            )}
            {threads.map((thread) => (
              <ThreadCard
                key={thread._id}
                thread={thread}
                author={thread.author}
              />
            ))}
          </TabPanel>
          <TabPanel>
            {/* TODO: fetch all user comments and their parent threads <CommentCard/> */}
            <p>123456</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default UserPage;
