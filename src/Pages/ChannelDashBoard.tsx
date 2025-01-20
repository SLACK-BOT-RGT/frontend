import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import { fetchTeamMembers } from "../api/team_members";
import { useAppSelector } from "../hooks/hooks";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";
import TeamMembers from "../components/team/TeamMembers";
import TeamOverview from "../components/team/TeamOverview";
import TeamSettings from "../components/team/TeamSettings";

const ChannelDashBoard = () => {
  const { channel_id } = useParams();

  const { channels } = useAppSelector((state) => state.channels);
  const channel = channels?.find((item) => item.id.toString() === channel_id);

  const { data: team_members, isLoading } = useQuery({
    queryFn: fetchTeamMembers,
    queryKey: ["team-members"],
  });

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-custom-primary p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100">
            {channel?.name} Dashboard
          </h1>
          <p className="text-gray-300 tracking-wider my-1">
            Monitor team standup participation and engagement
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-custom-secondary p-1 rounded-lg">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="participation">Participation</TabsTrigger>
            <TabsTrigger value="responses">Responses</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TeamOverview team_members={team_members} />

          <TeamMembers team_members={team_members} />

          <TabsContent value="participation">
            {/* Add detailed participation analytics */}
          </TabsContent>

          <TabsContent value="responses">
            {/* Add response details and history */}
          </TabsContent>

          {/* <TabsContent value="settings">
           
          </TabsContent> */}
          <TeamSettings channel_id={channel_id || ""} />
        </Tabs>
      </div>
    </div>
  );
};

export default ChannelDashBoard;
