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
import repliesAtom from "../atoms/repliesAtom";
import ReplyCard from "../components/ReplyCard";

const UserPage = () => {
  const { user, isLoading } = useGetUserProfile();
  const { username } = useParams();
  const showToast = useShowToast();
  const [threads, setThreads] = useRecoilState(postsAtom);
  const [replies, setReplies] = useRecoilState(repliesAtom);
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

  useEffect(() => {
    const getReplies = async () => {
      if (!user) return;
      setIsFetchingThreads(true);
      try {
        const res = await fetch(`/api/threads/user/replies/${username}`);
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setReplies(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setReplies([]);
      } finally {
        setIsFetchingThreads(false);
      }
    };

    getReplies();
  }, [username, showToast, setReplies, user]);

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
            {!isFetchingThreads && threads.length === 0 && (
              <h1>{user.name} does&apos;t reply to anyone yet...</h1>
            )}
            {isFetchingThreads && (
              <Flex justifyContent={"center"} my={12}>
                <Spinner size={"xl"} />
              </Flex>
            )}
            {replies.map((reply) => (
              <ReplyCard
                key={reply._id}
                thread={reply}
                author={reply.author}
                parent={reply.parentId}
                parentAuthor={reply.parentId.author}
              />
            ))}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default UserPage;
