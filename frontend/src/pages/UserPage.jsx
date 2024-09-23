import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";

const UserPage = () => {
  return (
    <>
      <UserHeader />
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
          <TabPanel>
            <UserPost />
          </TabPanel>
          <TabPanel>
            <p>123456</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default UserPage;
