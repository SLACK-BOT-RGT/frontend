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
import { ITeamMember } from "@/types/interfaces";

const participationData = [
  { date: "Mon", rate: 92 },
  { date: "Tue", rate: 88 },
  { date: "Wed", rate: 95 },
  { date: "Thu", rate: 85 },
  { date: "Fri", rate: 90 },
];

const responseTimeData = [
  { time: "9 AM", count: 5 },
  { time: "10 AM", count: 8 },
  { time: "11 AM", count: 12 },
  { time: "12 PM", count: 3 },
  { time: "1 PM", count: 2 },
];

const teamMembers = [
  { name: "John Doe", status: "Responded", time: "9:15 AM" },
  { name: "Jane Smith", status: "Missed", time: "-" },
  { name: "Mike Johnson", status: "Responded", time: "9:45 AM" },
];

interface TeamOverviewProps {
  team_members: ITeamMember[];
}
const TeamOverview = ({ team_members }: TeamOverviewProps) => {
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
            <div className="text-2xl font-bold">92%</div>
            <div className="text-xs text-gray-500">11/12 members responded</div>
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
            <div className="text-2xl font-bold">9:45 AM</div>
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
            <div className="text-2xl font-bold">1</div>
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
            {teamMembers.map((member, index) => (
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
                      Submitted at {member.time}
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
