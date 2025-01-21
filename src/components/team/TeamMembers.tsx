import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { TabsContent } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import AddMemberModal from "./AddMemberModal";
import { ITeamMember, IUser } from "../../types/interfaces";
import RemoveMemberModal from "./RemoveMemberModal";
import EditMemberModal from "./EditMemberModal";

interface TeamMembersProps {
  team_members: ITeamMember[];
}

const TeamMembers = ({ team_members }: TeamMembersProps) => {
  const storedUserData = localStorage.getItem("userData");

  let userData: IUser | null = null;
  if (storedUserData) {
    try {
      userData = JSON.parse(storedUserData);
    } catch (error) {
      console.error("Failed to parse userData from localStorage", error);
    }
  }

  return (
    <TabsContent value="members">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-100">Team Members</h2>
            <p className="text-gray-300">
              Manage your team members and their roles
            </p>
          </div>
          {userData?.is_admin && <AddMemberModal team_members={team_members} />}
        </div>

        <Card className="bg-custom-secondary border-custom-secondary">
          <CardHeader>
            <CardTitle className="text-gray-300">Current Members</CardTitle>
            <CardDescription>
              Total members: {team_members.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-gray-700">
              {team_members.map((member, index) => (
                <div
                  key={index}
                  className="py-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                      {member.User.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-100">
                        {member.User.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {member.User.email}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className="bg-indigo-600">{member.role}</Badge>
                        <span className="text-xs text-gray-400">
                          Joined {member.createdAt.slice(0, 10)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {userData?.is_admin && (
                      <EditMemberModal team_member={member} />
                    )}
                    {userData?.is_admin && (
                      <RemoveMemberModal team_member={member} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};

export default TeamMembers;
