import { useMemo, useState } from "react";
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
} from "lucide-react";
import { format } from "date-fns";

const standupData = [
  {
    id: 1,
    member: "John Doe",
    team: "Frontend",
    date: "2025-01-19",
    status: "Completed",
    yesterday: "Completed user authentication flow",
    today: "Starting work on dashboard layout",
    blockers: "None",
    submittedAt: "09:15 AM",
  },
  {
    id: 2,
    member: "Jane Smith",
    team: "Backend",
    date: "2025-01-19",
    status: "Missing",
    submittedAt: "-",
  },
  {
    id: 3,
    member: "John Doe",
    team: "Frontend",
    date: "2024-01-19",
    status: "Completed",
    yesterday: "Completed user authentication flow",
    today: "Starting work on dashboard layout",
    blockers: "None",
    submittedAt: "09:15 AM",
  },
  {
    id: 4,
    member: "John Doe",
    team: "Frontend",
    date: "2025-01-19",
    status: "Completed",
    yesterday: "Completed user authentication flow",
    today: "Starting work on dashboard layout",
    blockers: "None",
    submittedAt: "09:15 AM",
  },
];
const StandupDashboard = () => {
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
    return standupData.filter((entry) => {
      // Team filter
      const teamMatch =
        selectedTeam === "all" ||
        entry.team.toLowerCase() === selectedTeam.toLowerCase();

      console.log("====================================");
      console.log(teamMatch);
      console.log("====================================");

      // Date filter
      const dateMatch = selectedDate
        ? entry.date === format(selectedDate, "yyyy-MM-dd")
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
  }, [selectedTeam, selectedDate, statusFilter, searchQuery]);

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
          <Button className="bg-indigo-600 hover:bg-indigo-700">
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
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
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
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="missing">Missing</SelectItem>
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
            {filteredData.length > 0 ? (
              filteredData.map((entry) => (
                <div
                  key={entry.id}
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
                        entry.status === "Completed"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }
                    >
                      {entry.status}
                    </Badge>
                  </div>

                  {entry.status === "Completed" && (
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-400 mb-1">Yesterday</p>
                        <p className="text-gray-200">{entry.yesterday}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Today</p>
                        <p className="text-gray-200">{entry.today}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Blockers</p>
                        <p className="text-gray-200">{entry.blockers}</p>
                      </div>
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
