import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import ThreadCard from "../components/ThreadCard";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useShowToast();
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    const getFeedThreads = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/threads/feed`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        console.log(data);
        setThreads(data);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setIsLoading(false);
      }
    };

    getFeedThreads();
  }, [showToast]);

  return (
    <>
      {!isLoading && threads.length === 0 && (
        <h1>Follow someone to explore more Threads...</h1>
      )}
      {isLoading && (
        <Flex justify={"center"}>
          <Spinner size={"xl"} />
        </Flex>
      )}

      {threads.map((thread) => (
        <ThreadCard key={thread._id} thread={thread} author={thread.author} />
      ))}
    </>
  );
};

export default HomePage;