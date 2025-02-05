import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { TabsContent } from "../../components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart, Bar } from "recharts";
import {
  CheckCircle,
  Clock,
  Users,
  XCircle,
  Smile,
  Award,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ITeamMember } from "../../types/interfaces";
import { calculateAverageResponseTime } from "../../utils";

import { PieChart, Pie, Cell } from "recharts";
import { useEffect, useState } from "react";
import { getMetrics } from "../../api/team_members";

// const participationData = [
//   { date: "Mon", rate: 92 },
//   { date: "Tue", rate: 88 },
//   { date: "Wed", rate: 95 },
//   { date: "Thu", rate: 85 },
//   { date: "Fri", rate: 90 },
// ];

// const responseTimeData = [
//   { time: "9 AM", count: 5 },
//   { time: "10 AM", count: 8 },
//   { time: "11 AM", count: 12 },
//   { time: "12 PM", count: 3 },
//   { time: "1 PM", count: 2 },
// ];

// const teamMembers = [
//   { name: "John Doe", status: "Responded", time: "9:15 AM" },
//   { name: "Jane Smith", status: "Missed", time: "-" },
//   { name: "Mike Johnson", status: "Responded", time: "9:45 AM" },
// ];

// Sample data - replace with actual data
// const trendData = [
//   { week: "W1", mood: 85, kudos: 45, pollParticipation: 90 },
//   { week: "W2", mood: 78, kudos: 52, pollParticipation: 85 },
//   { week: "W3", mood: 88, kudos: 38, pollParticipation: 92 },
//   { week: "W4", mood: 92, kudos: 60, pollParticipation: 88 },
// ];

// const kudosCategories = [
//   { name: "Teamwork", value: 35 },
//   { name: "Innovation", value: 25 },
//   { name: "Leadership", value: 20 },
//   { name: "Support", value: 20 },
// ];
export interface IStatus {
  name: string;
  status: string;
  time: string;
}
interface TeamOverviewProps {
  team_members: ITeamMember[];
  channel_id: string;
  team_members_status_today: IStatus[];
  team_members_status_week: IStatus[];
}
interface DataProps {
  trendData: {
    week: string;
    mood: number;
    kudos: number;
    pollParticipation: number;
  }[];
  kudosCategories: {
    name: string;
    value: number;
  }[];
  quickestResponder: {
    userId: string;
    name: string;
    avgResponseTime: number;
  };
  topPerformer: {
    id: string;
    name: string;
    kudosReceived: number;
    kudosGiven: number;
    topCategory: string;
    highlights: string[];
  };
  collaboration: {
    id: string;
    name: string;
    kudosReceived: number;
    avgKudosGiven: number;
    kudosGiven: number;
    topCategory: string;
    highlights: string[];
  };
  moods: {
    mood: string;
    count: number;
  }[];
}
const TeamOverview = ({
  team_members,
  team_members_status_today,
  team_members_status_week,
  channel_id,
}: TeamOverviewProps) => {
  // const [timeRange, setTimeRange] = useState("month");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  // const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataProps>();

  useEffect(() => {
    fetchLeaderBoard(selectedMonth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel_id]);

  const fetchLeaderBoard = async (newDate: Date) => {
    // setLoading(true);
    const response = await getMetrics({
      team_id: channel_id,
      month: newDate,
    });
    setData(response);
    // setLoading(false);
  };

  const complete_members = team_members_status_today.filter(
    (item) => item.status == "responded"
  ).length;

  const teamMembers = team_members.filter(
    (member) => member.team_id == channel_id
  );

  // const generateResponseTimeData = (
  //   teamMembers: { name: string; status: string; time: string }[]
  // ) => {
  //   // Helper function to extract the hour in 12-hour format with AM/PM
  //   const extractHour = (isoString: string): string => {
  //     const date = new Date(isoString);
  //     const hours = date.getHours();
  //     const period = hours >= 12 ? "PM" : "AM";
  //     const hour12 = hours % 12 || 12; // Convert 24-hour to 12-hour format
  //     return `${hour12} ${period}`;
  //   };

  //   // Initialize an object to count responses per hour
  //   const hourlyCounts: Record<string, number> = {};

  //   // Process each member's response time
  //   teamMembers.forEach((member) => {
  //     if (member.status === "responded") {
  //       const hour = extractHour(member.time); // Properly format the time
  //       hourlyCounts[hour] = (hourlyCounts[hour] || 0) + 1;
  //     }
  //   });

  //   // Convert the counts object to an array of { time, count } objects
  //   return Object.entries(hourlyCounts).map(([time, count]) => ({
  //     time,
  //     count,
  //   }));
  // };

  const generateParticipationData = (
    teamMembers: { name: string; status: string; time: string }[]
  ) => {
    // Helper function to extract the day of the week from the ISO string
    const getDayOfWeek = (isoString: string): string => {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const date = new Date(isoString);
      return days[date.getDay()];
    };

    // Initialize an object to track response counts and totals for each day
    const dayStats: Record<string, { responded: number; total: number }> = {
      Mon: { responded: 0, total: 0 },
      Tue: { responded: 0, total: 0 },
      Wed: { responded: 0, total: 0 },
      Thu: { responded: 0, total: 0 },
      Fri: { responded: 0, total: 0 },
      Sat: { responded: 0, total: 0 },
      Sun: { responded: 0, total: 0 },
    };

    // Process each team member's data
    teamMembers.forEach((member) => {
      if (member.time !== "-") {
        const day = getDayOfWeek(member.time);
        if (dayStats[day]) {
          dayStats[day].total += 1;
          if (member.status === "responded") {
            dayStats[day].responded += 1;
          }
        }
      }
    });

    // Convert dayStats into the final participationData array
    return Object.entries(dayStats).map(([day, stats]) => ({
      date: day,
      rate:
        stats.total > 0 ? Math.round((stats.responded / stats.total) * 100) : 0,
    }));
  };

  const participationData = generateParticipationData(team_members_status_week);

  console.log("====================================");
  console.log("participationData=>", participationData);
  console.log("====================================");
  // const responseTimeData = generateResponseTimeData(team_members_status_today);

  const COLORS = ["#60A5FA", "#34D399", "#F87171", "#A78BFA", "#FF8C00E7"];

  const navigateMonth = (direction: string) => {
    const newDate = new Date(selectedMonth);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedMonth(newDate);
    fetchLeaderBoard(newDate);
  };

  const formatMonth = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <TabsContent value="overview">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-custom-secondary border-custom-secondary text-gray-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <div className="text-xs text-gray-500">Active members</div>
          </CardContent>
        </Card>

        <Card className="bg-custom-secondary border-custom-secondary text-gray-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Participation
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isNaN(
                (complete_members / team_members_status_today.length) * 100
              )
                ? 0
                : (
                    (complete_members / team_members_status_today.length) *
                    100
                  ).toFixed(2)}
              %
            </div>
            <div className="text-xs text-gray-500">
              {complete_members}/{team_members_status_today.length} members
              responded
            </div>
          </CardContent>
        </Card>

        <Card className="bg-custom-secondary border-custom-secondary text-gray-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Average Response Time
            </CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculateAverageResponseTime(team_members_status_today)}
            </div>
            <div className="text-xs text-gray-500">Today's average</div>
          </CardContent>
        </Card>

        <Card className="bg-custom-secondary border-custom-secondary text-gray-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Missing Responses
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {team_members_status_today.length - complete_members}
            </div>
            <div className="text-xs text-gray-500">Pending response</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="md:col-span-2 bg-custom-secondary border-custom-secondary text-gray-300 flex items-center justify-between">
          <CardHeader>
            <CardTitle>Monthly stats</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigateMonth("prev")}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">
                    {formatMonth(selectedMonth)}
                  </span>
                </div>
                <button
                  onClick={() => navigateMonth("next")}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Team Insights */}
        <Card className="md:col-span-2 bg-custom-secondary border-custom-secondary text-gray-300">
          <CardHeader>
            <CardTitle>Team Insights</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.collaboration &&
            data?.topPerformer &&
            data?.quickestResponder ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-500/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Smile className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">Quick Responder</span>
                  </div>
                  <p className="mt-2 text-sm">
                    <strong className="tracking-wider">
                      @{data.quickestResponder?.name}
                    </strong>{" "}
                    has the fastest average response time of{" "}
                    {data.quickestResponder?.avgResponseTime} hrs.
                  </p>
                </div>
                <div className="p-4 bg-green-500/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Top Performer</span>
                  </div>
                  <p className="mt-2 text-sm">
                    <strong className="tracking-wider">
                      @{data.topPerformer?.name}
                    </strong>{" "}
                    is the top performer with {data.topPerformer?.kudosReceived}{" "}
                    kudos.
                  </p>
                </div>
                <div className="p-4 bg-purple-500/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    <span className="font-medium">Collaboration</span>
                  </div>
                  <p className="mt-2 text-sm">
                    <strong className="tracking-wider">
                      @{data.collaboration?.name}
                    </strong>{" "}
                    is the best collaborator with{" "}
                    {data.collaboration?.avgKudosGiven} points.
                  </p>
                </div>
              </div>
            ) : (
              <div className="">
                <p>No data</p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="bg-custom-secondary border-custom-secondary text-gray-300">
          <CardHeader>
            <CardTitle>Weekly Participation Rate</CardTitle>
            {/* <CardDescription>
              Team response rate over the past week
            </CardDescription> */}
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={participationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip contentStyle={{ color: "#000" }} />
                <Line
                  type="bump"
                  dataKey="rate"
                  stroke="#4f46e5"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* <Card className="bg-custom-secondary border-custom-secondary text-gray-300">
          <CardHeader>
            <CardTitle>Response Time Distribution</CardTitle>
            <CardDescription>
              When team members submit their standups
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip contentStyle={{ color: "#000" }} />
                <Bar dataKey="count" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}
        {/* Combined Trend Chart */}
        <Card className="bg-custom-secondary border-custom-secondary text-gray-300">
          <CardHeader>
            <CardTitle>Combined Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#60A5FA"
                    name="Team Mood"
                  />
                  <Line
                    type="monotone"
                    dataKey="kudos"
                    stroke="#34D399"
                    name="Kudos"
                  />
                  <Line
                    type="monotone"
                    dataKey="pollParticipation"
                    stroke="#F87171"
                    name="Poll Participation"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Team Mood Distribution */}
        <Card className="bg-custom-secondary border-custom-secondary text-gray-300">
          <CardHeader>
            <CardTitle>Mood Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.moods}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mood" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#60A5FA" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Kudos Distribution */}
        <Card className="bg-custom-secondary border-custom-secondary text-gray-300">
          <CardHeader>
            <CardTitle>Kudos Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.kudosCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data?.kudosCategories.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-custom-secondary border-custom-secondary mt-6 text-gray-300">
        <CardHeader>
          <CardTitle>Today's Status</CardTitle>
          <CardDescription>Individual team member responses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {team_members_status_today?.map((member, index) => (
              <div
                key={index}
                className="py-3 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-gray-500">
                      Submitted at {member.time.slice(0, 10)}
                      {", "}
                      {member.time.slice(11, 16)}
                    </div>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm ${
                    member.status === "responded"
                      ? "bg-green-100 text-green-800"
                      : member.status === "missed"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {member.status}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default TeamOverview;
