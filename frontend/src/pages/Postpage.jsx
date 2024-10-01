import { Divider, Flex, Spinner, Text } from "@chakra-ui/react";
import postsAtom from "../atoms/postsAtom";
import { useRecoilState } from "recoil";
import useShowToast from "../hooks/useShowToast.js";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import useGetUserProfile from "../hooks/useGetUserProfile.js";

import ThreadCard from "../components/ThreadCard.jsx";

const Postpage = () => {
  const { user, isLoading } = useGetUserProfile();
  const [threads, setThreads] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const { tid } = useParams();

  const currentThread = threads[0];

  useEffect(() => {
    const getThread = async () => {
      setThreads([]);
      try {
        const res = await fetch(`/api/threads/${tid}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        setThreads([data]);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    getThread();
  }, [showToast, tid, setThreads]);

  if (!user && isLoading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner />
      </Flex>
    );
  }

  if (!currentThread) return null;

  return (
    <>
      <ThreadCard thread={currentThread} author={currentThread.author} />
      <Text my={4}>Comments</Text>
      <Divider my={4} />

      {currentThread.children.map((children) => (
        <ThreadCard
          key={children._id}
          thread={children}
          author={children.author}
          lastReply={
            children._id ===
            currentThread.children[currentThread.children.length - 1]._id
          }
        />
      ))}
    </>
  );
};

export default Postpage;
