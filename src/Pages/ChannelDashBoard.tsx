import {
  Tabs,
  TabsList,
  TabsTrigger,
  // TabsContent,
} from "../components/ui/tabs";
import {
  fetchMembersResponsesStatusToday,
  fetchMembersResponsesStatusWeek,
  fetchTeamMembers,
} from "../api/team_members";
import { useAppSelector } from "../hooks/hooks";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";
import TeamMembers from "../components/team/TeamMembers";
import TeamOverview from "../components/team/TeamOverview";
import TeamSettings from "../components/team/TeamSettings";
import TeamResponses from "../components/team/TeamResponses";

const ChannelDashBoard = () => {
  const { channel_id } = useParams();

  const { channels } = useAppSelector((state) => state.channels);

  const channel = channels?.find((item) => item.id.toString() === channel_id);

  const { data: team_members, isLoading } = useQuery({
    queryFn: fetchTeamMembers,
    queryKey: ["team-members"],
  });

  const { data: team_members_status_today } = useQuery({
    queryFn: handleMembersResponsesStatusToday,
    queryKey: ["team-members-status-today"],
  });
  const { data: team_members_status_week } = useQuery({
    queryFn: handleMembersResponsesStatusWeek,
    queryKey: ["team-members-status-week"],
  });

  async function handleMembersResponsesStatusToday() {
    return await fetchMembersResponsesStatusToday({
      team_id: channel_id as string,
    });
  }
  async function handleMembersResponsesStatusWeek() {
    return await fetchMembersResponsesStatusWeek({
      team_id: channel_id as string,
    });
  }

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
            {/* <TabsTrigger value="participation">Participation</TabsTrigger> */}
            <TabsTrigger value="responses">Responses</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TeamOverview
            team_members={team_members}
            channel_id={channel_id || ""}
            team_members_status_today={team_members_status_today || []}
            team_members_status_week={team_members_status_week || []}
          />

          <TeamMembers team_members={team_members} />

          {/* Add detailed participation analytics */}
          {/* <TabsContent value="participation">
          </TabsContent> */}

          <TeamResponses channel_id={channel_id || ""} />

          {/* <TabsContent value="settings">
           
          </TabsContent> */}
          <TeamSettings channel_id={channel_id || ""} />
        </Tabs>
      </div>
    </div>
  );
};

export default ChannelDashBoard;
