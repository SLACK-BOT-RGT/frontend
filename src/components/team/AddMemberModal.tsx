import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { UserPlus, Search, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";

import { useState, useEffect, SetStateAction } from "react";
import { fetchAllUsers, postTeamMembers } from "../../api/team_members";
import { ITeamMember, IUser } from "../../types/interfaces";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../hooks/use-toast";

interface AddMemberModalProps {
  team_members: ITeamMember[];
}

const AddMemberModal = ({ team_members }: AddMemberModalProps) => {
  // Sample users data - replace with API call
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { channel_id } = useParams();
  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Mutations
  const { mutateAsync: AddMemberMutation } = useMutation({
    mutationFn: postTeamMembers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
  });

  const { data: usersData } = useQuery<SetStateAction<IUser[]>>({
    queryFn: fetchAllUsers,
    queryKey: ["users"],
  });

  useEffect(() => {
    if (!usersData) return;
    setUsers(usersData);
  }, [usersData]);

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
      team_members.find((member) => member.user_id == user.id)?.team_id !=
        channel_id
    // user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleAddMembers() {
    toast({
      title: "Adding a team member",
      description: (
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin h-4 w-4 text-gray-600" />
          <span>Loading, please wait...</span>
        </div>
      ),
    });

    const data = selectedUsers.map((item) => {
      return {
        role: "member",
        user_id: item,
        team_id: channel_id || "",
      };
    });

    await AddMemberMutation(data);
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-custom-secondary">
        <SheetHeader>
          <SheetTitle className="text-gray-300">Add Team Members</SheetTitle>
          <SheetDescription>
            Select new team members. Click save when you're done.
          </SheetDescription>
        </SheetHeader>

        {/* Search and Select All */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 my-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="selectAll"
              checked={
                selectedUsers.length === filteredUsers.length &&
                filteredUsers.length > 0
              }
              onCheckedChange={handleSelectAll}
              className="border-gray-400 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
            />
            <label htmlFor="selectAll" className="text-sm text-gray-300">
              Select All
            </label>
          </div>
        </div>

        {/* Users List */}
        <ScrollArea className="h-[70%] w-[100%] p-4">
          <div className="border border-gray-700 rounded-lg overflow-hidden my-5">
            <div className="divide-y divide-gray-700">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-4 p-4 hover:bg-gray-700/50 transition-colors"
                >
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => handleSelectUser(user.id)}
                    className="border-gray-400 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                  />
                  <div className="flex items-center flex-1 space-x-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-100 truncate">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        <SheetFooter>
          <SheetClose asChild>
            <Button
              type="submit"
              className="bg-indigo-600"
              onClick={handleAddMembers}
            >
              Save changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AddMemberModal;
