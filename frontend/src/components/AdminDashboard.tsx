import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import MediaUpload from "./MediaUpload";
import Reports from "./Reports";
import Bookings from "./Bookings";
import Calendar from "./Calender";
import BlogEditor from "./BlogEditor";
import PageEditor from "./PageEditor";

const AdminDashboard = () => {
  return (
    <div className="p-6 mt-20">
      <Tabs>
        <TabList>
          <Tab>Media</Tab>
          <Tab>Reports</Tab>
          <Tab>Bookings</Tab>
          <Tab>Calendar</Tab>
          <Tab>Blog</Tab>
          <Tab>Page Editor</Tab>
        </TabList>
        <TabPanel>
          <MediaUpload />
        </TabPanel>
        <TabPanel>
          <Reports />
        </TabPanel>
        <TabPanel>
          <Bookings />
        </TabPanel>
        <TabPanel>
          <Calendar />
        </TabPanel>
        <TabPanel>
          <BlogEditor />
        </TabPanel>
        <TabPanel>
          <PageEditor />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
