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
// import { useQuery } from "@tanstack/react-query";
// import Loading from "../components/Loading";
import TeamMembers from "../components/team/TeamMembers";
import TeamOverview, { IStatus } from "../components/team/TeamOverview";
import TeamSettings from "../components/team/TeamSettings";
import TeamResponses from "../components/team/TeamResponses";
import { useEffect, useState } from "react";
import { ITeamMember } from "../types/interfaces";
import { useQuery } from "@tanstack/react-query";

const ChannelDashBoard = () => {
  const [teamMembers, setTeamMembers] = useState<ITeamMember[]>([]);
  const [teamMembersStatusToday, setTeamMembersStatusToday] = useState<
    IStatus[]
  >([]);
  const [teamMembersStatusWeek, setTeamMembersStatusWeek] = useState<IStatus[]>(
    []
  );

  const { channel_id } = useParams();

  const { channels } = useAppSelector((state) => state.channels);

  const channel = channels?.find((item) => item.id.toString() === channel_id);

  const { data: team_members } = useQuery<ITeamMember[]>({
    queryFn: fetchTeamMembers,
    queryKey: ["team-members"],
  });

  // const { data: team_members_status_today } = useQuery<IStatus[]>({
  //   queryFn: handleMembersResponsesStatusToday,
  //   queryKey: ["team-members-status-today"],
  // });

  // const { data: team_members_status_week } = useQuery<IStatus[]>({
  //   queryFn: handleMembersResponsesStatusWeek,
  //   queryKey: ["team-members-status-week"],
  // });

  // async function handleMembersResponsesStatusToday() {
  //   return await fetchMembersResponsesStatusToday({
  //     team_id: channel_id as string,
  //   });
  // }
  // async function handleMembersResponsesStatusWeek() {
  //   return await fetchMembersResponsesStatusWeek({
  //     team_id: channel_id as string,
  //   });
  // }

  useEffect(() => {
    if (team_members) {
      setTeamMembers(team_members.filter((item) => item.team_id == channel_id));
    }
    // if()
    // setTeamMembersStatusToday(team_members_status_today || []);
    // setTeamMembersStatusWeek(team_members_status_week || []);
  }, [
    channel_id,
    team_members,
    // team_members_status_today,
    // team_members_status_week,
  ]);
  // useEffect(() => {
  //   queryClient.invalidateQueries({ queryKey: ["team-members"] });
  //   queryClient.invalidateQueries({ queryKey: ["eam-members-status-today"] });
  //   queryClient.invalidateQueries({ queryKey: ["team-members-status-week"] });
  // }, [channel_id, queryClient]);
  // useEffect(() => {
  //   async function fetchData() {
  //     const team_members: ITeamMember[] = await fetchTeamMembers();
  //     setTeamMembers(team_members.filter((item) => item.team_id == channel_id));
  //   }
  //   fetchData();
  // }, [channel_id]);

  useEffect(() => {
    async function fetchData() {
      const team_members_status_today = await fetchMembersResponsesStatusToday({
        team_id: channel_id as string,
      });
      setTeamMembersStatusToday(team_members_status_today);
    }
    fetchData();
  }, [channel_id]);

  useEffect(() => {
    async function fetchData() {
      const team_members_status_week = await fetchMembersResponsesStatusWeek({
        team_id: channel_id as string,
      });
      setTeamMembersStatusWeek(team_members_status_week);
    }
    fetchData();
  }, [channel_id]);

  // if (isLoading) return <Loading />;

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
            team_members={teamMembers}
            channel_id={channel_id || ""}
            team_members_status_today={teamMembersStatusToday || []}
            team_members_status_week={teamMembersStatusWeek || []}
          />

          <TeamMembers team_members={teamMembers} />

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
