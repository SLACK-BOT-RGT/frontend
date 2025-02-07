import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import {
  Download,
  Calendar as CalendarIcon,
  Filter,
  Search,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchStandUpResponses } from "../api/team_members";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { setStandupResponses } from "../store/channelsSlice";
import { useToast } from "../hooks/use-toast";
import { format } from "date-fns";

// const standupData = [
//   {
//     id: 1,
//     member: "John Doe",
//     team: "Frontend",
//     date: "2025-01-19",
//     status: "Completed",
//     yesterday: "Completed user authentication flow",
//     today: "Starting work on dashboard layout",
//     blockers: "None",
//     submittedAt: "09:15 AM",
//   },
//   {
//     id: 2,
//     member: "Jane Smith",
//     team: "Backend",
//     date: "2025-01-19",
//     status: "Missing",
//     submittedAt: "-",
//   },
//   {
//     id: 3,
//     member: "John Doe",
//     team: "Frontend",
//     date: "2024-01-19",
//     status: "Completed",
//     yesterday: "Completed user authentication flow",
//     today: "Starting work on dashboard layout",
//     blockers: "None",
//     submittedAt: "09:15 AM",
//   },
//   {
//     id: 4,
//     member: "John Doe",
//     team: "Frontend",
//     date: "2025-01-19",
//     status: "Completed",
//     yesterday: "Completed user authentication flow",
//     today: "Starting work on dashboard layout",
//     blockers: "None",
//     submittedAt: "09:15 AM",
//   },
// ];

interface StandupResponse {
  member: string;
  team: string;
  team_id: string;
  date: string;
  status: string;
  standup: {
    question: string;
    response: string;
  }[];
  submittedAt: string;
}

const StandupDashboard = () => {
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { standupResponses, channels } = useAppSelector(
    (state) => state.channels
  );

  const { data: standupResponsesData } = useQuery<StandupResponse[]>({
    queryFn: fetchStandUpResponses,
    queryKey: ["standups"],
  });

  useEffect(() => {
    if (!standupResponsesData) return;
    dispatch(setStandupResponses(standupResponsesData));
  }, [standupResponsesData, dispatch]);

  // const [standupResponses,setStandupResponses] = useState([]);

  // Sample data - replace with actual API data

  // Reset all filters
  const clearFilters = () => {
    setSelectedTeam("all");
    setSelectedDate(new Date());
    setSearchQuery("");
    setStatusFilter("all");
  };

  // Filter data using useMemo for performance
  const filteredData = useMemo(() => {
    if (!standupResponses.length) return [];
    return standupResponses?.filter((entry) => {
      // Team filter
      const teamMatch =
        selectedTeam === "all" ||
        entry.team.toLowerCase() === selectedTeam.toLowerCase();

      const entryDate = new Date(entry.submittedAt);
      const dateMatch = selectedDate
        ? format(entryDate, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
        : true;
      // Status filter
      const statusMatch =
        statusFilter === "all" ||
        entry.status.toLowerCase() === statusFilter.toLowerCase();

      // Search query
      const searchMatch =
        searchQuery === "" ||
        entry.member.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.team.toLowerCase().includes(searchQuery.toLowerCase());

      return teamMatch && dateMatch && statusMatch && searchMatch;
    });
  }, [selectedTeam, selectedDate, statusFilter, searchQuery, standupResponses]);

  const exportToCSV = (data: StandupResponse[], filename: string) => {
    // Define CSV headers
    const headers = ["Member", "Team", "Status", "Standup", "Submitted At"];

    // Convert data to CSV format
    const csvData = data.map((entry) => [
      entry.member,
      entry.team,
      entry.status,
      entry.standup
        .map((item) => `${item.question}: ${item.response}`)
        .join("; "),
      entry.submittedAt,
    ]);

    // Combine headers and data
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell || ""}"`).join(",")),
    ].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportToJSON = (data: StandupResponse[], filename: string) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExport = (fileFormat: "csv" | "json") => {
    const date = format(new Date(), "yyyy-MM-dd");
    const filename = `standup-data-${date}.${fileFormat}`;

    if (fileFormat === "csv") {
      exportToCSV(filteredData, filename);
    } else {
      exportToJSON(filteredData, filename);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">
            Standup Dashboard
          </h1>
          <p className="text-gray-400">View and manage team standups</p>
        </div>
        <div className="flex space-x-2">
          <Button
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={() => {
              toast({
                title: "Export data",
                description: (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4 text-gray-600" />
                    <span>Loading, please wait...</span>
                  </div>
                ),
              });
              handleExport("csv");
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <Card className="bg-custom-secondary border-custom-secondary">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-gray-100">Filters</CardTitle>
            <Button
              variant="outline"
              className="bg-gray-700 border-gray-600 text-gray-300"
              onClick={clearFilters}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Team</label>
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  {channels?.map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                  {/* <SelectItem value="backend">Backend</SelectItem> */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Date</label>
              <Popover>
                <PopoverTrigger asChild className="bg-gray-700 border-gray-600">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-gray-600 text-gray-300"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                  <SelectItem value="not responded">Not Responded</SelectItem>
                  <SelectItem value="missed">Missed</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
          </div>
        </CardContent>
      </Card>

      {/* Standup Entries */}
      <Card className="bg-custom-secondary border-custom-secondary">
        <CardHeader>
          <CardTitle className="text-gray-100">Standup Entries</CardTitle>
          <CardDescription className="text-gray-400">
            {format(selectedDate || new Date(), "MMMM d, yyyy")}
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
                        <p className="text-sm text-gray-400">#{entry.team}</p>
                      </div>
                    </div>
                    <Badge
                      className={
                        entry.status === "responded"
                          ? "bg-green-500/20 text-green-400"
                          : entry.status === "missed"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }
                    >
                      {entry.status}
                    </Badge>
                  </div>

                  {entry.status === "Completed" && (
                    <div className="space-y-3 text-sm">
                      {entry.standup.map((item, index) => {
                        console.log("====================================");
                        console.log("hey", item);
                        console.log("====================================");
                        return (
                          <div key={index}>
                            <p className="text-gray-400 mb-1">
                              {item.question}
                            </p>
                            <p className="text-gray-200">{item.response}</p>
                          </div>
                        );
                      })}
                      <div className="text-right">
                        <span className="text-xs text-gray-400">
                          Submitted at {entry.submittedAt}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                No entries found matching your filters
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StandupDashboard;
