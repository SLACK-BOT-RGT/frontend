import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { HiMiniPlusSmall } from "react-icons/hi2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddChannel } from "../api/team_members";
import { useToast } from "../hooks/use-toast";
import { Loader2 } from "lucide-react";

const AddTeam = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Mutations
  const { mutateAsync: AddTeamMutation } = useMutation({
    mutationFn: AddChannel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
  });

  async function handleAddTeam() {
    setIsOpen(false);
    toast({
      title: "Adding a team",
      description: (
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin h-4 w-4 text-gray-600" />
          <span>Loading, please wait...</span>
        </div>
      ),
    });
    await AddTeamMutation({
      name: name,
      description: description,
    });
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* <Button variant="outline">Edit Profile</Button> */}
        <div
          className="bg-gray-400 rounded-sm"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <HiMiniPlusSmall className="text-white text-lg" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Team</DialogTitle>
          <DialogDescription>Create a slack change</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              className="col-span-3"
              onChange={(e) => setName(e.currentTarget.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Description
            </Label>
            <Input
              id="username"
              value={description}
              className="col-span-3"
              onChange={(e) => setDescription(e.currentTarget.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleAddTeam}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeam;
