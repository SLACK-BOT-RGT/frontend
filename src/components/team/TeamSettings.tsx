import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { Clock, Save, Plus, Trash2, Loader2 } from "lucide-react";
import { TabsContent } from "../ui/tabs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchStandUpConfig,
  RemoveChannel,
  updateStandUpConfig,
} from "../../api/team_members";
// import Loading from "../Loading";
import { IStandupConfig } from "../../types/interfaces";
import { DAYS_OF_THE_WEEK } from "../../config/constants";
import { useAppSelector } from "../../hooks/hooks";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";

// Sample data - replace with actual API call
const initialConfig = {
  team_id: "",
  questions: [],
  reminder_time: "",
  due_time: "",
  reminder_days: [],
  is_active: false,
};

interface TeamSettingsProps {
  channel_id: string;
}
const TeamSettings = ({ channel_id }: TeamSettingsProps) => {
  const [config, setConfig] = useState<IStandupConfig | null>(initialConfig);
  const [questions, setQuestions] = useState<string[]>([]);
  const [deleteTeamName, setDeleteTeamName] = useState<string>("");

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { channels } = useAppSelector((state) => state.channels);
  const channel = channels?.find((channel) => channel.id === channel_id);

  // const handleFetchStandUpConfig = async () => {
  //   // Assuming fetchStandUpConfig returns a Promise<IStandupConfig>
  //   console.log("====================================");
  //   console.log("channel_id");
  //   console.log("====================================");

  //   return (await fetchStandUpConfig({ team_id: channel_id })) || initialConfig;
  // };

  // const { data: standupConfig, isLoading } = useQuery<IStandupConfig>({
  //   queryFn: handleFetchStandUpConfig,
  //   queryKey: ["standup-config"],
  // });

  const { mutateAsync: UpdateStandUpConfigMutation } = useMutation({
    mutationFn: updateStandUpConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
  });

  useEffect(() => {
    async function fetchData() {
      const standupConfig =
        (await fetchStandUpConfig({ team_id: channel_id })) || initialConfig;
      setConfig(standupConfig);
      setQuestions(standupConfig.questions);
    }
    fetchData();
  }, [channel_id]);

  const handleAddQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleDayToggle = (day: string) => {
    if (!config) return;
    const newDays = config.reminder_days.includes(day)
      ? config.reminder_days.filter((d) => d !== day)
      : [...config.reminder_days, day];
    setConfig({ ...config, reminder_days: newDays });
  };

  const handleSaveChanges = async () => {
    const data = {
      team_id: channel_id,
      questions: questions,
      reminder_days: config?.reminder_days,
      reminder_time: config?.reminder_time,
      due_time: config?.due_time,
      is_active: config?.is_active,
    } as IStandupConfig;

    toast({
      title: "Updating Configuration",
      description: (
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin h-4 w-4 text-gray-600" />
          <span>Loading, please wait...</span>
        </div>
      ),
    });

    await UpdateStandUpConfigMutation({
      config_id: config?.id as number,
      data,
    });

    const standupConfig =
      (await fetchStandUpConfig({ team_id: channel_id })) || initialConfig;
    setConfig(standupConfig);
    setQuestions(standupConfig.questions);
  };
  // if (isLoading) return <Loading />;

  // Mutations
  const { mutateAsync: AddTeamMutation } = useMutation({
    mutationFn: RemoveChannel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
  });

  async function handleAddTeam() {
    if (!channel) return;
    if (channel.name !== deleteTeamName) {
      alert("Name missmatch");
      return;
    }
    await AddTeamMutation({ channel_id });
    navigate("/");
  }

  return (
    <TabsContent value="settings">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">
            Standup Configuration
          </h2>
          <p className="text-gray-300">
            Manage your team's standup settings and questions
          </p>
        </div>

        <Card className="bg-custom-secondary border-custom-secondary">
          <CardHeader>
            <CardTitle className="text-gray-300">General Settings</CardTitle>
            <CardDescription className="text-gray-400">
              Configure basic standup parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-gray-300">Enable Standups</Label>
                <div className="text-sm text-gray-400">
                  Toggle daily standup reminders
                </div>
              </div>
              <Switch
                checked={config?.is_active}
                onCheckedChange={(checked) => {
                  if (!config) return;
                  setConfig({ ...config, is_active: checked });
                }}
                className="data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-gray-600 data-[state=checked]:hover:bg-indigo-700"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Reminder Time</Label>
              <div className="flex items-center space-x-2 w-[50%]">
                <Clock className="h-4 w-4 text-gray-400" />
                <Input
                  type="time"
                  value={config?.reminder_time}
                  onChange={(e) => {
                    if (!config) return;
                    setConfig({ ...config, reminder_time: e.target.value });
                  }}
                  className="bg-gray-700 border-gray-600 text-gray-200"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Due Time</Label>
              <div className="flex items-center space-x-2 w-[50%]">
                <Clock className="h-4 w-4 text-gray-400" />
                <Input
                  type="time"
                  value={config?.due_time}
                  onChange={(e) => {
                    if (!config) return;
                    setConfig({ ...config, due_time: e.target.value });
                  }}
                  className="bg-gray-700 border-gray-600 text-gray-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-200">Active Days</Label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_THE_WEEK.map((day) => (
                  <Button
                    key={day}
                    variant={
                      config?.reminder_days.includes(day)
                        ? "default"
                        : "outline"
                    }
                    onClick={() => handleDayToggle(day)}
                    className={
                      config?.reminder_days.includes(day)
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "border-gray-600 text-gray-600"
                    }
                  >
                    {day.substring(0, 3)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-custom-secondary border-custom-secondary">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-gray-300">
                  Standup Questions
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Customize your daily standup questions
                </CardDescription>
              </div>
              <Button
                onClick={handleAddQuestion}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((question, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="flex-grow">
                  <Textarea
                    value={question}
                    onChange={(e) =>
                      handleQuestionChange(index, e.target.value)
                    }
                    placeholder="Enter your question"
                    className="bg-gray-700 border-gray-600 text-gray-200"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveQuestion(index)}
                  className="text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={handleSaveChanges}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Card className="bg-custom-secondary border-custom-secondary">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-red-300">Delete Channel</CardTitle>
                <CardDescription className="text-gray-400">
                  You can delete channel{" "}
                  <strong className="text-gray-300">({channel?.name})</strong>{" "}
                  here; To proceed type the name in the filed and submit.
                </CardDescription>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4 text-gray-300">
                    <Input
                      id="username"
                      value={deleteTeamName}
                      className="col-span-3 border-red-300"
                      onChange={(e) => setDeleteTeamName(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAddTeam}
                  className="bg-red-500 hover:bg-red-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Remove Team
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </TabsContent>
  );
};

export default TeamSettings;
