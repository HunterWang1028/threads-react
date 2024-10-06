import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import ThreadCard from "../components/ThreadCard";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import { SuggestedUserCarousel } from "../components/SuggestedUserCards";
import SuggestedUsersPC from "../components/SuggestedUsersPC";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useShowToast();
  const [threads, setThreads] = useRecoilState(postsAtom);
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  useEffect(() => {
    const getFeedThreads = async () => {
      setIsLoading(true);
      setThreads([]);
      try {
        const res = await fetch(`/api/threads/feed`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        setThreads(data);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setIsLoading(false);
      }
    };

    getFeedThreads();
  }, [showToast, setThreads]);

  useEffect(() => {
    const getSuggestedUsers = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();
        if (data.error) {
          return showToast("Error", data.error, "error");
        }
        setSuggestedUsers(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setIsLoading(false);
      }
    };

    getSuggestedUsers();
  }, [showToast]);

  return (
    <Flex gap={10} alignItems={"flex-start"}>
      <Box flex={70}>
        {!isLoading && threads.length === 0 && (
          <h1>Follow someone to explore more Threads...</h1>
        )}

        {isLoading && (
          <Flex justify={"center"}>
            <Spinner size={"xl"} />
          </Flex>
        )}
        <Flex mt={5} display={{ base: "block", md: "none" }}>
          <SuggestedUserCarousel suggestedUsers={suggestedUsers} />
        </Flex>

        {threads.map((thread) => (
          <ThreadCard key={thread._id} thread={thread} author={thread.author} />
        ))}
      </Box>
      <Box flex={30} display={{ base: "none", md: "block" }}>
        <SuggestedUsersPC />
      </Box>
    </Flex>
  );
};

export default HomePage;
