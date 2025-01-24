export const calculateAverageResponseTime = (
    teamMembers: { name: string; status: string; time: string }[]
) => {
    // Helper function to convert ISO date string to minutes since midnight
    const isoTimeToMinutes = (isoString: string): number => {
        const date = new Date(isoString);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return hours * 60 + minutes;
    };

    // Filter team members who responded and map their response times to minutes
    const responseTimes = teamMembers
        .filter((member) => member.status === "responded")
        .map((member) => isoTimeToMinutes(member.time));

    if (responseTimes.length === 0) {
        return "No responses";
    }

    // Calculate the average time in minutes
    const averageTimeInMinutes =
        responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;

    // Convert average time in minutes back to HH:MM AM/PM format
    const minutes = Math.floor(averageTimeInMinutes % 60);
    let hours = Math.floor(averageTimeInMinutes / 60);
    const period = hours >= 12 ? "PM" : "AM";

    if (hours > 12) {
        hours -= 12;
    } else if (hours === 0) {
        hours = 12;
    }

    return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
};