import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  // DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Plus, Minus, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { IUser } from "../../types/interfaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTeamPolls } from "../../api/team_members";
import { useToast } from "../../hooks/use-toast";
interface CreatePollModalProps {
  channel_id: string;
}

const CreatePollModal = ({ channel_id }: CreatePollModalProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [pollData, setPollData] = useState({
    question: "",
    options: ["", ""],
    isAnonymous: true,
    duration: "24",
    teamId: "",
  });

  const { mutateAsync: CreatePollMutation } = useMutation({
    mutationFn: addTeamPolls,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-polls"] });
    },
  });

  const storedUserData = localStorage.getItem("userData");

  let userData: IUser | null = null;
  if (storedUserData) {
    try {
      userData = JSON.parse(storedUserData);
    } catch (error) {
      console.error("Failed to parse userData from localStorage", error);
    }
  }

  const addOption = () => {
    if (pollData.options.length < 6) {
      setPollData({
        ...pollData,
        options: [...pollData.options, ""],
      });
    }
  };

  const removeOption = (index: number) => {
    if (pollData.options.length > 2) {
      const newOptions = pollData.options.filter((_, i) => i !== index);
      setPollData({
        ...pollData,
        options: newOptions,
      });
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...pollData.options];
    newOptions[index] = value;
    setPollData({
      ...pollData,
      options: newOptions,
    });
  };

  const handleSubmit = async () => {
    setIsOpen(false);
    toast({
      title: "Creating a poll",
      description: (
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin h-4 w-4 text-gray-600" />
          <span>Loading, please wait...</span>
        </div>
      ),
    });
    // Get the current time as start_time
    const start_time = new Date();

    // Convert duration from hours (pollData.duration) to milliseconds
    const durationInMs = parseInt(pollData.duration, 10) * 60 * 60 * 1000;

    // Calculate end_time by adding duration to start_time
    const end_time = new Date(start_time.getTime() + durationInMs);

    // Prepare data for submission
    const preparedData = {
      team_id: channel_id,
      start_time: start_time.toISOString(), // Convert to ISO string for consistency
      end_time: end_time.toISOString(), // Convert to ISO string for consistency
      creator_id: userData?.id,
      is_anonymous: pollData.isAnonymous,
      options: pollData.options.map((item) => ({
        text: item,
      })),
      question: pollData.question,
    };
    console.log("====================================");
    console.log(preparedData);
    console.log("====================================");

    await CreatePollMutation(preparedData);

    setPollData({
      question: "",
      options: ["", ""],
      isAnonymous: true,
      duration: "24",
      teamId: "",
    });
    console.log("====================================");
    console.log("DONE!!!!");
    console.log("====================================");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-indigo-600/70 hover:bg-indigo-600 text-gray-300 hover:text-gray-200"
          variant="ghost"
        >
          Create Poll
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[50%] bg-custom-secondary border-custom-secondary text-gray-300">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Card className="w-full bg-custom-secondary border-custom-secondary text-gray-300">
          <CardHeader>
            <CardTitle>Create Team Poll</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                {/* <label className="block text-sm font-medium mb-1">
                  Poll Question
                </label> */}
                <Label className="text-gray-300">Poll Question</Label>
                {/* <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={pollData.question}
                  onChange={(e) =>
                    setPollData({ ...pollData, question: e.target.value })
                  }
                  placeholder="What's your question?"
                /> */}

                <Input
                  type="text"
                  // className="w-full p-2 border rounded"
                  value={pollData.question}
                  onChange={(e) =>
                    setPollData({ ...pollData, question: e.target.value })
                  }
                  placeholder="What's your question?"
                  className="bg-gray-700 border-gray-600 text-gray-200"
                />
              </div>

              <div>
                {/* <label className="block text-sm font-medium mb-1">
                  Options
                </label> */}
                <Label className="text-gray-300">Options</Label>
                {pollData.options.map((option, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    {/* <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      placeholder={`Option ${index + 1}`}
                    /> */}
                    <Input
                      type="text"
                      // className="w-full p-2 border rounded"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      placeholder={`Option ${index + 1}`}
                      className="bg-gray-700 border-gray-600 text-gray-200"
                    />
                    {index >= 2 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeOption(index)}
                        className="bg-gray-700 border-gray-600"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {pollData.options.length < 4 && (
                  <Button
                    variant="outline"
                    className="mt-2 bg-gray-700 border-gray-600 hover:bg-gray-800 hover:text-gray-400"
                    onClick={addOption}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                )}
              </div>

              <div className="flex items-end gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Duration (hours)
                  </label>
                  <Select
                    value={pollData.duration}
                    onValueChange={(text) => {
                      setPollData({ ...pollData, duration: text });
                    }}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24">24 hours</SelectItem>
                      <SelectItem value="48">48 hours</SelectItem>
                      <SelectItem value="72">72 hours</SelectItem>
                      <SelectItem value="168">1 week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={pollData.isAnonymous}
                    onChange={(e) =>
                      setPollData({
                        ...pollData,
                        isAnonymous: e.target.checked,
                      })
                    }
                  />
                  <label htmlFor="anonymous">Anonymous Voting</label>
                </div>
              </div>

              <Button
                className="w-full bg-indigo-600/70 hover:bg-indigo-600 text-gray-300 hover:text-gray-200"
                onClick={handleSubmit}
              >
                Create Poll
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePollModal;
