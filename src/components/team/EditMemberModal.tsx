import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

import { updateTeamMember } from "../../api/team_members";
import { ITeamMember } from "../../types/interfaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit } from "lucide-react";
import { useState } from "react";

interface EditMemberModalProps {
  team_member: ITeamMember;
}

const EditMemberModal = ({ team_member }: EditMemberModalProps) => {
  const [selectedRole, setSelectedRole] = useState(team_member.role);
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutateAsync: EditMemberMutation } = useMutation({
    mutationFn: updateTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
  });

  async function handleUpdate() {
    setIsOpen(false);
    await EditMemberMutation({ id: team_member.id, role: selectedRole });
  }

  const handleChange = (value: string) => {
    setSelectedRole(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-red-400"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Member</DialogTitle>
          <DialogDescription>
            You are about to Edit <strong>{team_member.User.name}</strong> from
            this team. Enter <strong>{team_member.User.email}</strong> to
            confirm
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Select onValueChange={handleChange} value={selectedRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Developer">Developer</SelectItem>
                <SelectItem value="Team Lead">Team Lead</SelectItem>
                <SelectItem value="Designer">Designer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleUpdate}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditMemberModal;
