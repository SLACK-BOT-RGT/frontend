import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { Button } from "../ui/button";
import { deletePoll } from "../../api/team_members";
import { IPoll } from "../../types/interfaces";
import { Trash2, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "../../hooks/use-toast";

interface RemovePollModalProps {
  poll: IPoll;
}

const RemovePollModal = ({ poll }: RemovePollModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Mutations
  const { mutateAsync: RemoveMemberMutation } = useMutation({
    mutationFn: deletePoll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-polls"] });
    },
  });

  async function handleDelete() {
    setIsOpen(false);
    toast({
      title: "Removing a poll",
      description: (
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin h-4 w-4 text-gray-600" />
          <span>Loading, please wait...</span>
        </div>
      ),
    });
    await RemoveMemberMutation({ poll_id: poll.id });
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-red-400"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete A Poll</DialogTitle>
          <DialogDescription>
            You are about to remove poll with the question:{" "}
            <strong>{poll.question}</strong>. Click on <strong>confirm</strong>{" "}
            to proceed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit" onClick={handleDelete}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemovePollModal;
