import { TabsContent } from "../../components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useMemo, useState } from "react";
import { useAppSelector } from "../../hooks/hooks";
import { Badge } from "../../components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "../../components/ui/input";

interface TeamResponsesProps {
  channel_id: string;
}
const TeamResponses = ({ channel_id }: TeamResponsesProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const { standupResponses } = useAppSelector((state) => state.channels);

  // Filter data using useMemo for performance
  const filteredData = useMemo(() => {
    if (!standupResponses.length) return [];
    return standupResponses?.filter((entry) => {
      const filterByTeam = entry.team_id == channel_id;
      // Search query
      const searchMatch =
        searchQuery === "" ||
        entry.member.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.submittedAt.toLowerCase().includes(searchQuery.toLowerCase());

      return searchMatch && filterByTeam;
    });
  }, [searchQuery, standupResponses, channel_id]);

  return (
    <TabsContent value="responses">
      {/* Add response details and history */}
      <Card className="bg-custom-secondary border-custom-secondary">
        <CardHeader>
          <CardTitle className="text-gray-100">Standup Entries</CardTitle>
          <CardDescription className="text-gray-400">
            {/* {format(selectedDate || new Date(), "MMMM d, yyyy")} */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-gray-200"
                />
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredData?.length > 0 ? (
              filteredData?.map((entry, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-gray-700 hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                        {entry.member
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <h3 className="text-gray-100 font-medium">
                          {entry.member}
                        </h3>
                        <p className="text-sm text-gray-400">{entry.team}</p>
                      </div>
                    </div>
                    <Badge
                      className={
                        entry.status === "responded"
                          ? "bg-green-500/20 text-green-400"
                          : entry.status == "missed"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }
                    >
                      {entry.status}
                    </Badge>
                  </div>

                  {entry.status === "responded" && (
                    <div className="space-y-3 text-sm">
                      {entry.standup.map((item, index) => (
                        <div key={index}>
                          <p className="text-gray-400 mb-1">{item.question}</p>
                          <p className="text-gray-200">{item.response}</p>
                        </div>
                      ))}
                      <div className="text-right">
                        <span className="text-xs text-gray-400">
                          Submitted on{" "}
                          {new Date(entry.date).toLocaleDateString("en-US")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                No entries found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default TeamResponses;
