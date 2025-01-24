import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";

import { deleteTeamMember } from "../../api/team_members";
import { ITeamMember } from "../../types/interfaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "../../hooks/use-toast";
interface RemoveMemberModalProps {
  team_member: ITeamMember;
}

const RemoveMemberModal = ({ team_member }: RemoveMemberModalProps) => {
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Mutations
  const { mutateAsync: RemoveMemberMutation } = useMutation({
    mutationFn: deleteTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
  });

  async function handleDelete() {
    setIsOpen(false);
    if (text.trim() == team_member.User.email.trim()) {
      toast({
        title: "Removing a team member",
        description: (
          <div className="flex items-center gap-2">
            <Loader2 className="animate-spin h-4 w-4 text-gray-600" />
            <span>Loading, please wait...</span>
          </div>
        ),
      });
      await RemoveMemberMutation({ id: team_member.id });
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* <Button variant="outline">Edit Profile</Button> */}
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-red-400"
          // onClick={async () => {
          //   try {
          //     RemoveMemberMutation({ id: team_member.id });
          //   } catch (error) {
          //     console.log(error);
          //   }
          // }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Member</DialogTitle>
          <DialogDescription>
            You are about to remove <strong>{team_member.User.name}</strong>{" "}
            from this team. Enter <strong>{team_member.User.email}</strong> to
            confirm
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="username"
              value={text}
              className="col-span-3"
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleDelete}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveMemberModal;
