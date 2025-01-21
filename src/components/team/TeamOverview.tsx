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
import { CheckCircle, Clock, Users, XCircle } from "lucide-react";
import { ITeamMember } from "../../types/interfaces";

const participationData = [
  { date: "Mon", rate: 92 },
  { date: "Tue", rate: 88 },
  { date: "Wed", rate: 95 },
  { date: "Thu", rate: 85 },
  { date: "Fri", rate: 90 },
];

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

interface IStatus {
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
const TeamOverview = ({
  team_members,
  team_members_status_today,
  team_members_status_week,
}: TeamOverviewProps) => {
  const complete_members = team_members_status_today.filter(
    (item) => item.status == "Responded"
  ).length;

  console.log("=======team_members_status_today=============");
  console.log(complete_members);
  console.log("=======team_members_status_today==============");

  const calculateAverageResponseTime = (
    teamMembers: { name: string; status: string; time: string }[]
  ) => {
    // Helper function to convert ISO date string to minutes since midnight
    const isoTimeToMinutes = (isoString: string): number => {
      const date = new Date(isoString);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return hours * 60 + minutes;
    };

    // Filter team members who responded and map their response times to minutes
    const responseTimes = teamMembers
      .filter((member) => member.status === "Responded")
      .map((member) => isoTimeToMinutes(member.time));

    if (responseTimes.length === 0) {
      return "No responses to calculate average time.";
    }

    // Calculate the average time in minutes
    const averageTimeInMinutes =
      responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;

    // Convert average time in minutes back to HH:MM AM/PM format
    const minutes = Math.floor(averageTimeInMinutes % 60);
    let hours = Math.floor(averageTimeInMinutes / 60);
    const period = hours >= 12 ? "PM" : "AM";

    if (hours > 12) {
      hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }

    return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const generateResponseTimeData = (
    teamMembers: { name: string; status: string; time: string }[]
  ) => {
    // Helper function to extract the hour in 12-hour format with AM/PM
    const extractHour = (isoString: string): string => {
      const date = new Date(isoString);
      const hours = date.getHours();
      const period = hours >= 12 ? "PM" : "AM";
      const hour12 = hours % 12 || 12; // Convert 24-hour to 12-hour format
      return `${hour12} ${period}`;
    };

    // Initialize an object to count responses per hour
    const hourlyCounts: Record<string, number> = {};

    // Process each member's response time
    teamMembers.forEach((member) => {
      if (member.status === "Responded") {
        const hour = extractHour(member.time); // Properly format the time
        hourlyCounts[hour] = (hourlyCounts[hour] || 0) + 1;
      }
    });

    // Convert the counts object to an array of { time, count } objects
    return Object.entries(hourlyCounts).map(([time, count]) => ({
      time,
      count,
    }));
  };

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
          if (member.status === "Responded") {
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

  const responseTimeData = generateResponseTimeData(team_members_status_today);

  return (
    <TabsContent value="overview">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-custom-secondary border-custom-secondary text-gray-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{team_members.length}</div>
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
              {(complete_members / team_members_status_today.length) * 100}%
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
        <Card className="bg-custom-secondary border-custom-secondary text-gray-300">
          <CardHeader>
            <CardTitle>Weekly Participation Rate</CardTitle>
            <CardDescription>
              Team response rate over the past week
            </CardDescription>
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

        <Card className="bg-custom-secondary border-custom-secondary text-gray-300">
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
                    member.status === "Responded"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
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
