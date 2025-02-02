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
import { Button } from "../components/ui/button";
import { calculateAverageResponseTime } from "../utils";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { ITeamMember, StandupResponse } from "../types/interfaces";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "../hooks/use-toast";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import TeamMembers from "../components/team/TeamMembers";
import TeamOverview, { IStatus } from "../components/team/TeamOverview";
import TeamResponses from "../components/team/TeamResponses";
import TeamSettings from "../components/team/TeamSettings";
import TeamKudos from "../components/team/TeamKudos";
import TeamPollAnalytics from "../components/team/TeamPollsAnalytics";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: { finalY: number }; // Add the lastAutoTable property
  }
}

interface TeamStats {
  totalMembers: number;
  averageParticipation: number;
  onTimeSubmissions: number;
  averageResponseTime: string;
  missedStandups: number;
}

interface TeamReport {
  teamName: string;
  period: string;
  members: ITeamMember[];
  standupEntries: StandupResponse[];
  stats: TeamStats;
}

const ChannelDashBoard = () => {
  const [teamMembers, setTeamMembers] = useState<ITeamMember[]>([]);
  const [teamMembersStatusToday, setTeamMembersStatusToday] = useState<
    IStatus[]
  >([]);
  const [teamMembersStatusWeek, setTeamMembersStatusWeek] = useState<IStatus[]>(
    []
  );
  console.log("====================================");
  console.log("teamMembersStatusToday=>", teamMembersStatusToday);
  console.log("====================================");

  const { channel_id } = useParams();
  const { toast } = useToast();
  const { channels } = useAppSelector((state) => state.channels);

  const channel = channels?.find((item) => item.id.toString() === channel_id);

  const [searchQuery, setSearchQuery] = useState("");

  const { standupResponses } = useAppSelector((state) => state.channels);

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

      // Search query match
      const searchMatch =
        searchQuery === "" ||
        entry.member.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.submittedAt.toLowerCase().includes(searchQuery.toLowerCase());

      // Return only entries that match all filters
      return searchMatch && filterByTeam && isWithinDateRange;
    });
  }, [searchQuery, standupResponses, channel_id]);

  console.log("====================================");
  console.log("standupResponses=>standupResponses=>", standupResponses);
  console.log("====================================");

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

  const generateTeamReport = async (teamData: TeamReport): Promise<Blob> => {
    // Create new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Add header
    doc.setFontSize(20);
    doc.text(`Team Report: ${teamData.teamName}`, pageWidth / 2, 20, {
      align: "center",
    });
    doc.setFontSize(12);
    doc.text(`Report Period: ${teamData.period}`, pageWidth / 2, 30, {
      align: "center",
    });

    // Add team statistics
    doc.setFontSize(14);
    doc.text("Team Statistics", 14, 45);

    const stats = [
      ["Total Members", teamData.members.length],
      ["Average Participation", `${teamData.stats.averageParticipation}%`],
      ["Total Submissions", teamData.stats.onTimeSubmissions],
      ["Average Response Time", teamData.stats.averageResponseTime],
      ["Missed Standups", teamData.stats.missedStandups],
    ];

    autoTable(doc, {
      startY: 50,
      head: [["Metric", "Value"]],
      body: stats,
      theme: "grid",
      headStyles: { fillColor: [79, 70, 229] }, // indigo-600
    });

    // Add team members section
    doc.text("Team Members", 14, doc.lastAutoTable.finalY + 15);

    const memberData = teamData.members.map((member) => [
      member.User.name,
      member.role,
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Name", "Role"]],
      body: memberData,
      theme: "grid",
      headStyles: { fillColor: [79, 70, 229] },
    });

    // Add standup completion summary
    doc.text("Standup Summary", 14, doc.lastAutoTable.finalY + 15);

    const standupData = teamData.standupEntries.map((entry) => [
      entry.member,
      entry.status,
      entry.submittedAt,
      entry.standup
        .map(
          (item: { question: string; response: string }, index) =>
            `${index + 1 + "." + item.question}: ${item.response}`
        )
        .join("; "),
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Member", "Status", "Submitted At", "Standups"]],
      body: standupData,
      theme: "grid",
      headStyles: { fillColor: [79, 70, 229] },
    });

    // Add footer
    const footer = `Generated on ${format(new Date(), "PPP")}`;
    doc.setFontSize(10);
    doc.text(footer, pageWidth / 2, doc.internal.pageSize.height - 10, {
      align: "center",
    });

    // Return the PDF as a blob
    return doc.output("blob");
  };

  const calculateTeamStats = (
    entries: StandupResponse[],
    members: ITeamMember[]
  ) => {
    const totalEntries = entries.length;

    // const participation =
    //   (complete_members / teamMembersStatusToday.length) * 100 || 0;
    const completedEntries = entries.filter(
      (entry) => entry.status === "responded"
    ).length;
    const onTimeEntries = completedEntries;

    const averageResponseTime = calculateAverageResponseTime(
      teamMembersStatusToday
    );

    return {
      totalMembers: members.length,
      averageParticipation: (completedEntries / totalEntries) * 100,
      onTimeSubmissions: onTimeEntries,
      averageResponseTime: averageResponseTime,
      missedStandups: totalEntries - completedEntries,
    };
  };

  // Example usage in your component:
  const handleGenerateReport = async () => {
    try {
      // Get current week's date range
      const startDate = startOfWeek(new Date());
      const endDate = endOfWeek(new Date());
      const period = `${format(startDate, "PPP")} - ${format(endDate, "PPP")}`;

      // Sample data - replace with actual data from your application
      const teamData: TeamReport = {
        teamName: "Frontend Team",
        period: period,
        members: teamMembers,
        standupEntries: filteredData,
        stats: {
          /* will be calculated */
        } as TeamStats,
      };

      // Calculate statistics
      teamData.stats = calculateTeamStats(
        teamData.standupEntries,
        teamData.members
      );

      // Generate and download the report
      const pdfBlob = await generateTeamReport(teamData);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${teamData.teamName}-Report-${format(
        new Date(),
        "yyyy-MM-dd"
      )}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating report:", error);
      // Handle error appropriately
    }
  };

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
                await handleGenerateReport();
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

          <TeamKudos />

          <TeamPollAnalytics
            channel_id={channel_id || ""}
            teamMembers={teamMembers}
          />

          <TeamSettings channel_id={channel_id || ""} />
        </Tabs>
      </div>
    </div>
  );
};

export default ChannelDashBoard;
