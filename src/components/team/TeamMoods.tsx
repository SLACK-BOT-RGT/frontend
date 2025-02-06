import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";
import { TabsContent } from "../ui/tabs";
import { ITeamMember } from "../../types/interfaces";
import { fetchTeamMoods } from "../../api/team_members";
import Loading from "../Loading";

interface TeamMoodsProps {
  channel_id: string;
  teamMembers: ITeamMember[];
}

// Interface for individual mood entries
interface MoodEntry {
  date: string;
  mood: number;
  note: string;
}

// Interface for the overall user moods structure
interface UserMoods {
  [userId: string]: MoodEntry[];
}

const TeamMoods = ({ channel_id, teamMembers }: TeamMoodsProps) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedPerson, setSelectedPerson] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UserMoods>({});

  useEffect(() => {
    getTeamMoods(new Date());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("====================================");
  console.log("selectedMonth=>", selectedMonth);
  console.log("====================================");

  const getTeamMoods = async (newDate: Date) => {
    setLoading(true);
    const response = await fetchTeamMoods({
      team_id: channel_id,
      month: newDate,
    });
    console.log("====================================");
    console.log("fetchTeamMoods=>", response);
    console.log("====================================");
    setData(response);
    setLoading(false);
  };

  console.log("====================================");
  console.log("teamMembers=>", teamMembers);
  console.log("====================================");
  // const team = [
  //   { id: "1", name: "Sarah Parker", role: "Designer" },
  //   { id: "2", name: "John Davis", role: "Developer" },
  //   { id: "3", name: "Lisa Wong", role: "Product Manager" },
  // ];

  const getMoodEmoji = (mood: number) => {
    if (mood == 4) return "😄";
    if (mood == 3) return "🙂";
    if (mood == 2) return "😐";
    return "😢";
  };

  const selectedPersonData = data[selectedPerson] || [];
  const averageMood =
    selectedPersonData.reduce((acc, cur) => acc + cur.mood, 0) /
    selectedPersonData.length;

  const navigateMonth = (direction: string) => {
    const newDate = new Date(selectedMonth);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedMonth(newDate);
    getTeamMoods(newDate.toISOString() as unknown as Date);
  };

  const formatMonth = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(date);
  };
  return (
    <TabsContent value="moods">
      <Card className="bg-custom-secondary border-custom-secondary w-full">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-gray-100">
              Personal Mood Trends
            </CardTitle>
            <div className="flex gap-4">
              <div className="flex items-center space-x-4 text-gray-300">
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
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-100" />
                <select
                  className="p-2 border border-gray-800 rounded bg-gray-700 text-gray-200"
                  value={selectedPerson}
                  onChange={(e) => setSelectedPerson(e.target.value)}
                >
                  {teamMembers.map((person) => (
                    <option key={person.id} value={person.user_id}>
                      {person.User.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        {Object.entries(data).length > 0 ? (
          <CardContent className="pt-6 text-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-500/20 rounded-lg">
                <div className="text-sm text-gray-300">Average Mood</div>
                <div className="text-2xl font-bold flex items-center gap-2">
                  {!isNaN(averageMood) ? averageMood.toFixed(1) : 0}{" "}
                  {!isNaN(averageMood)
                    ? getMoodEmoji(averageMood)
                    : getMoodEmoji(2)}
                </div>
              </div>
              <div className="p-4 bg-green-500/20 rounded-lg">
                <div className="text-sm text-gray-300">Highest Mood</div>
                <div className="text-2xl font-bold flex items-center gap-2">
                  {Math.max(...selectedPersonData.map((d) => d.mood)) ===
                  -Infinity
                    ? 0
                    : Math.max(...selectedPersonData.map((d) => d.mood))}{" "}
                  😄
                </div>
              </div>
              <div className="p-4 bg-purple-500/20 rounded-lg">
                <div className="text-sm text-gray-300">Mood Entries</div>
                <div className="text-2xl font-bold">
                  {selectedPersonData.length}
                </div>
              </div>
            </div>

            {!loading ? (
              <div className="h-64 ">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedPersonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip
                      content={({ payload }) => {
                        if (!payload || !payload[0]) return null;
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2 border rounded shadow text-gray-600">
                            <div className="font-bold">
                              {getMoodEmoji(data.mood)} {data.mood}
                            </div>
                            <div className="text-sm text-gray-500">
                              {data.note}
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="#60A5FA"
                      strokeWidth={2}
                      dot={{ fill: "#60A5FA" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 ">
                <Loading />
              </div>
            )}
          </CardContent>
        ) : (
          <CardContent className="pt-6 text-gray-200">
            <h3>No data</h3>
          </CardContent>
        )}
      </Card>
    </TabsContent>
  );
};

export default TeamMoods;
