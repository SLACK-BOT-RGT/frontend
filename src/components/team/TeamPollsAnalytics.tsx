import { Fragment, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Users, Clock, TrendingUp, Filter } from "lucide-react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TabsContent } from "../../components/ui/tabs";
import CreatePollModal from "./CreatePollModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IPoll, ITeamMember, IUser } from "../../types/interfaces";
import { fetchTeamPolls } from "../../api/team_members";
import RemovePollModal from "./RemovePollModal";

interface TeamPollAnalyticsProps {
  channel_id: string;
  teamMembers: ITeamMember[];
}
const TeamPollAnalytics = ({
  channel_id,
  teamMembers,
}: TeamPollAnalyticsProps) => {
  const queryClient = useQueryClient();
  const [expandedPoll, setExpandedPoll] = useState<number | null | undefined>(
    null
  );
  const [expandedVoters, setExpandedVoters] = useState<
    string | null | undefined
  >(null);
  const [selectedTeam, setSelectedTeam] = useState("all");

  const storedUserData = localStorage.getItem("userData");
  let userData: IUser | null = null;
  if (storedUserData) {
    try {
      userData = JSON.parse(storedUserData);
    } catch (error) {
      console.error("Failed to parse userData from localStorage", error);
    }
  }

  const { data: team_polls } = useQuery<IPoll[]>({
    queryFn: () => fetchTeamPolls({ team_id: channel_id }),
    queryKey: ["team-polls"],
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["team-polls"] });
  }, [channel_id, queryClient]);

  const filteredPolls = team_polls?.filter((poll) => {
    const currentTime = new Date();

    const isActive =
      new Date(poll.start_time) <= currentTime &&
      currentTime <= new Date(poll.end_time);

    if (selectedTeam === "all") {
      return true;
    } else if (selectedTeam === "active") {
      return isActive;
    } else if (selectedTeam === "closed") {
      return !isActive;
    }

    return false;
  });

  const calculatePercentage = (votes: number, total: number) => {
    if (votes == 0 && total == 0) return 0;
    return ((votes / total) * 100).toFixed(1);
  };

  const totalVotes = team_polls
    ? team_polls.reduce((sum, poll) => sum + (poll.total_votes || 0), 0)
    : 0;

  const totalPolls = team_polls ? team_polls.length : 0;
  const totalTeamMembers = teamMembers?.length ?? 0;

  const averageParticipation = (
    (totalVotes / (totalTeamMembers * totalPolls)) *
    100
  ).toFixed(1);

  const totalActivePolls = team_polls
    ? team_polls.filter((poll) => {
        const now = new Date();
        const startTime = new Date(poll.start_time);
        const endTime = new Date(poll.end_time);

        return now >= startTime && now <= endTime;
      }).length
    : 0;

  return (
    <TabsContent value="polls">
      <div className="space-y-6 w-full">
        {/* Header with time range selector */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-100">Poll Analytics</h1>
          <CreatePollModal channel_id={channel_id} />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-custom-secondary border-custom-secondary text-gray-300">
            <CardContent className="pt-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-500">Total Polls</span>
              </div>
              <p className="text-2xl font-bold mt-2">
                {team_polls ? team_polls.length : 0}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-custom-secondary border-custom-secondary text-gray-300">
            <CardContent className="pt-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-500">Total Votes</span>
              </div>
              <p className="text-2xl font-bold mt-2">{totalVotes}</p>
            </CardContent>
          </Card>
          <Card className="bg-custom-secondary border-custom-secondary text-gray-300">
            <CardContent className="pt-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-500">Avg Participation</span>
              </div>
              <p className="text-2xl font-bold mt-2">
                {isNaN(parseFloat(averageParticipation))
                  ? 0
                  : averageParticipation}
                %
              </p>
            </CardContent>
          </Card>
          <Card className="bg-custom-secondary border-custom-secondary text-gray-300">
            <CardContent className="pt-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-gray-500">Active Polls</span>
              </div>
              <p className="text-2xl font-bold mt-2">{totalActivePolls}</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"></div>
      </div>

      <Card className="w-full bg-custom-secondary border-custom-secondary text-gray-300">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle>Recent Polls</CardTitle>
            <div className="relative w-[10%]">
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredPolls && filteredPolls.length > 0 ? (
              filteredPolls?.map((poll) => {
                const currentTime = new Date();
                const isActive =
                  new Date(poll.start_time) <= currentTime &&
                  currentTime <= new Date(poll.end_time);
                return (
                  <div key={poll.id} className="p-4">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() =>
                        setExpandedPoll(
                          expandedPoll === poll.id ? null : poll.id
                        )
                      }
                    >
                      <div className="flex-1">
                        <h3 className="font-medium">{poll.question}</h3>
                        <div className="flex gap-4 text-sm text-gray-500 mt-1">
                          <span>{poll.total_votes} votes</span>
                          <span>•</span>
                          <span>
                            {poll.start_time.toString().slice(0, 10)}
                            {" to "}
                            {poll.end_time.toString().slice(0, 10)}
                          </span>
                          <span>•</span>
                          <span
                            className={`${
                              isActive ? "text-green-500" : "text-gray-500"
                            }`}
                          >
                            {isActive ? "Active" : "Closed"}
                          </span>
                        </div>
                      </div>
                      {expandedPoll === poll.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    {expandedPoll === poll.id && (
                      <div className="mt-4 space-y-3">
                        {poll.options.map((option, index) => {
                          return (
                            <Fragment key={index}>
                              <div
                                className="space-y-1"
                                onClick={() =>
                                  setExpandedVoters(
                                    expandedVoters === option.id
                                      ? null
                                      : option.id
                                  )
                                }
                              >
                                <div className="flex justify-between text-sm">
                                  <span>{option.text}</span>
                                  <span className="text-gray-400">
                                    {option.votes} votes (
                                    {calculatePercentage(
                                      option.votes,
                                      poll.total_votes
                                    )}
                                    %)
                                  </span>
                                </div>
                                <div className="w-full bg-gray-400 rounded-full h-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{
                                      width: `${
                                        option.votes == 0 ||
                                        poll.total_votes == 0
                                          ? 0
                                          : (option.votes / poll.total_votes) *
                                            100
                                      }%`,
                                    }}
                                  />
                                </div>
                              </div>
                              {expandedVoters === option.id &&
                                (!poll.is_anonymous ||
                                  (poll.is_anonymous && userData?.is_admin)) &&
                                option.voters?.map((item) => (
                                  <div key={item.id} className="pl-5">
                                    @{item.name}
                                  </div>
                                ))}
                            </Fragment>
                          );
                        })}
                        {userData?.is_admin && (
                          <div className="flex justify-end">
                            <RemovePollModal poll={poll} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-4">
                <h3>No Data</h3>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default TeamPollAnalytics;
