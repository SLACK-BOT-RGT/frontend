import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

import { TabsContent } from "../../components/ui/tabs";

const TeamKudos = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // Sample data - replace with your actual data
  const leaderboardData = [
    {
      id: 1,
      name: "Sarah Parker",
      avatar: "/api/placeholder/32/32",
      kudosReceived: 45,
      topCategory: "Helpful",
      kudosGiven: 12,
      highlights: ["Excellent team support", "Outstanding code reviews"],
    },
    {
      id: 2,
      name: "John Davis",
      avatar: "/api/placeholder/32/32",
      kudosReceived: 38,
      topCategory: "Innovation",
      kudosGiven: 15,
      highlights: ["Creative problem solving", "Great mentorship"],
    },
    {
      id: 3,
      name: "Lisa Wong",
      avatar: "/api/placeholder/32/32",
      kudosReceived: 32,
      topCategory: "Teamwork",
      kudosGiven: 20,
      highlights: ["Cross-team collaboration", "Positive attitude"],
    },
    {
      id: 4,
      name: "QQQQ Wong",
      avatar: "/api/placeholder/32/32",
      kudosReceived: 32,
      topCategory: "Teamwork",
      kudosGiven: 20,
      highlights: ["Cross-team collaboration", "Positive attitude"],
    },
  ];

  const navigateMonth = (direction: string) => {
    const newDate = new Date(selectedMonth);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedMonth(newDate);
  };

  const formatMonth = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const getTrophyIcon = (position: number, name: string) => {
    switch (position) {
      case 0:
        return (
          <img
            src="/src/assets/gold.png"
            // alt={user.name}
            className="w-12 h-12 rounded-full"
          />
        );
      case 1:
        return (
          <img
            src="/src/assets/silver.png"
            // alt={user.name}
            className="w-12 h-12 rounded-full"
          />
        );
      case 2:
        return (
          <img
            src="/src/assets/bronze.png"
            // alt={user.name}
            className="w-12 h-12 rounded-full"
          />
        );
      default:
        return (
          <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
            {name.charAt(0)}
          </div>
        );
    }
  };

  return (
    <TabsContent value="kudos">
      <Card className="w-full bg-custom-secondary border-custom-secondary text-gray-300">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              Kudos Leaderboard
            </CardTitle>
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
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {leaderboardData.map((user, index) => (
              <div
                key={user.id}
                className={`flex items-start p-4 rounded-lg ${
                  index === 0
                    ? "bg-green-500/20"
                    : index === 1
                    ? "bg-blue-500/20"
                    : index === 2
                    ? "bg-red-500/20"
                    : "bg-slate-800/20"
                }`}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    {getTrophyIcon(index, user.name)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{user.name}</h3>
                      <span className="text-2xl font-bold text-blue-600">
                        {user.kudosReceived}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-sm text-gray-400">
                        <span className="bg-blue-100 px-2 py-1 rounded-full text-blue-700">
                          {user.topCategory}
                        </span>
                        <span className="mx-2">•</span>
                        <span>{user.kudosGiven} kudos given</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {user.highlights.join(" • ")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default TeamKudos;
