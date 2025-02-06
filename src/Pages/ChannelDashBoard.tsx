import { Loader2 } from "lucide-react";
import { startOfWeek, endOfWeek } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
  fetchMembersResponsesStatusToday,
  fetchMembersResponsesStatusWeek,
  fetchTeamMembers,
} from "../api/team_members";
import { Button } from "../components/ui/button";
import { handleGenerateReport } from "../utils";
import { IStatus, ITeamMember, IUser } from "../types/interfaces";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useAppSelector } from "../hooks/hooks";
import { useToast } from "../hooks/use-toast";
import TeamKudos from "../components/team/TeamKudos";
import TeamMembers from "../components/team/TeamMembers";
import TeamOverview from "../components/team/TeamOverview";
import TeamPollAnalytics from "../components/team/TeamPollsAnalytics";
import TeamResponses from "../components/team/TeamResponses";
import TeamSettings from "../components/team/TeamSettings";
import TeamMoods from "../components/team/TeamMoods";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: { finalY: number }; // Add the lastAutoTable property
  }
}

const ChannelDashBoard = () => {
  const [teamMembers, setTeamMembers] = useState<ITeamMember[]>([]);
  const [teamMembersStatusToday, setTeamMembersStatusToday] = useState<
    IStatus[]
  >([]);
  const [teamMembersStatusWeek, setTeamMembersStatusWeek] = useState<IStatus[]>(
    []
  );

  const { channel_id } = useParams();
  const { toast } = useToast();
  const { channels } = useAppSelector((state) => state.channels);
  const { standupResponses } = useAppSelector((state) => state.channels);

  const storedUserData = localStorage.getItem("userData");
  let userData: IUser | null = null;
  if (storedUserData) {
    try {
      userData = JSON.parse(storedUserData);
    } catch (error) {
      console.error("Failed to parse userData from localStorage", error);
    }
  }

  const channel = channels?.find((item) => item.id.toString() === channel_id);

  const filteredData = useMemo(() => {
    return standupResponses.filter((entry) => {
      const filterByTeam = entry.team_id === channel_id;

      // Define the date range
      const startDate = startOfWeek(new Date());
      const endDate = endOfWeek(new Date());

      // Ensure `entry.submittedAt` is a valid date
      const submittedDate = new Date(entry.submittedAt);

      // Check if the entry's submission date is within the range
      const isWithinDateRange =
        submittedDate >= startDate && submittedDate <= endDate;
      // Return only entries that match all filters
      return filterByTeam && isWithinDateRange;
    });
  }, [standupResponses, channel_id]);

  const { data: team_members } = useQuery<ITeamMember[]>({
    queryFn: fetchTeamMembers,
    queryKey: ["team-members"],
  });

  useEffect(() => {
    if (team_members) {
      setTeamMembers(team_members.filter((item) => item.team_id == channel_id));
    }
  }, [channel_id, team_members]);

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

  return (
    <div className="min-h-screen bg-custom-primary p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100">#{channel?.name}</h1>
          <div className="flex flex-row items-center justify-between">
            <p className="text-gray-300 tracking-wider my-1">
              Monitor team standup participation and engagements
            </p>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={async () => {
                toast({
                  title: "Export data",
                  description: (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin h-4 w-4 text-gray-600" />
                      <span>Loading, please wait...</span>
                    </div>
                  ),
                });
                await handleGenerateReport({
                  filteredData,
                  teamMembers,
                  teamMembersStatusToday,
                });
              }}
            >
              Generate Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-custom-secondary p-1 rounded-lg">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="responses">Responses</TabsTrigger>
            <TabsTrigger value="kudos">Kudos</TabsTrigger>
            <TabsTrigger value="polls">Polls</TabsTrigger>
            {userData?.is_admin && (
              <TabsTrigger value="moods">Moods</TabsTrigger>
            )}
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TeamOverview
            team_members={teamMembers}
            channel_id={channel_id || ""}
            team_members_status_today={teamMembersStatusToday || []}
            team_members_status_week={teamMembersStatusWeek || []}
          />

          <TeamMembers team_members={teamMembers} />

          <TeamResponses channel_id={channel_id || ""} />

          <TeamKudos channel_id={channel_id || ""} />

          <TeamPollAnalytics
            channel_id={channel_id || ""}
            teamMembers={teamMembers}
          />

          <TeamMoods channel_id={channel_id || ""} teamMembers={teamMembers} />

          <TeamSettings channel_id={channel_id || ""} />
        </Tabs>
      </div>
    </div>
  );
};

export default ChannelDashBoard;
