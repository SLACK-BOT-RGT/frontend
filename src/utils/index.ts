import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { IDataProps, IStatus, ITeamMember, StandupResponse } from "../types/interfaces";
import { format, startOfWeek, endOfWeek } from "date-fns";

declare module "jspdf" {
    interface jsPDF {
        lastAutoTable: { finalY: number }; // Add the lastAutoTable property
    }
}

interface TeamStats {
    totalMembers: number;
    averageParticipation: number;
    onTimeSubmissions: number;
    averageResponseTime: string;
    missedStandups: number;
}

interface TeamReport {
    teamName: string;
    period: string;
    members: ITeamMember[];
    standupEntries: StandupResponse[];
    stats: TeamStats;
}

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

export const generateTeamReport = async (teamData: TeamReport, data: IDataProps | undefined): Promise<Blob> => {
    // Create new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Add header
    doc.setFontSize(20);
    doc.text(`Team Report: ${teamData.teamName}`, pageWidth / 2, 20, {
        align: "center",
    });
    doc.setFontSize(12);
    doc.text(`Report Period: ${teamData.period}`, pageWidth / 2, 30, {
        align: "center",
    });

    // Add team statistics
    doc.setFontSize(14);
    doc.text("Team Statistics", 14, 45);

    const stats = [
        ["Total Members", teamData.members.length],
        ["Average Participation", `${teamData.stats.averageParticipation}%`],
        ["Total Submissions", teamData.stats.onTimeSubmissions],
        ["Average Response Time", teamData.stats.averageResponseTime],
        ["Missed Standups", teamData.stats.missedStandups],
        ["Quick Responder", data?.quickestResponder.name || ''],
        ["Top Performer", data?.topPerformer.name || ''],
        ["Best Collaborator", data?.collaboration.name || ''],
        ["Kudos Categories", data?.kudosCategories.map((item) => `${item.name}:${item.value}`) || ''],
    ];

    autoTable(doc, {
        startY: 50,
        head: [["Metric", "Value"]],
        body: stats,
        theme: "grid",
        headStyles: { fillColor: [79, 70, 229] }, // indigo-600
    });

    // Add team members section
    doc.text("Team Members", 14, doc.lastAutoTable.finalY + 15);

    const memberData = teamData.members.map((member) => [
        member.User.name,
        member.role,
    ]);

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        head: [["Name", "Role"]],
        body: memberData,
        theme: "grid",
        headStyles: { fillColor: [79, 70, 229] },
    });

    // Add standup completion summary
    doc.text("Standup Summary", 14, doc.lastAutoTable.finalY + 15);

    const standupData = teamData.standupEntries.map((entry) => [
        entry.member,
        entry.status,
        entry.submittedAt,
        entry.standup
            .map(
                (item: { question: string; response: string }, index) =>
                    `${index + 1 + "." + item.question}: ${item.response}`
            )
            .join("; "),
    ]);

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        head: [["Member", "Status", "Submitted At", "Standups"]],
        body: standupData,
        theme: "grid",
        headStyles: { fillColor: [79, 70, 229] },
    });

    // Add footer
    const footer = `Generated on ${format(new Date(), "PPP")}`;
    doc.setFontSize(10);
    doc.text(footer, pageWidth / 2, doc.internal.pageSize.height - 10, {
        align: "center",
    });

    // Return the PDF as a blob
    return doc.output("blob");
};

export const handleGenerateReport = async ({ teamMembers, filteredData, teamMembersStatusToday, data }: { teamMembers: ITeamMember[]; filteredData: StandupResponse[]; teamMembersStatusToday: IStatus[]; data: IDataProps | undefined; }) => {
    try {
        // Get current week's date range
        const startDate = startOfWeek(new Date());
        const endDate = endOfWeek(new Date());
        const period = `${format(startDate, "PPP")} - ${format(endDate, "PPP")}`;

        // Sample data - replace with actual data from your application
        const teamData: TeamReport = {
            teamName: "Frontend Team",
            period: period,
            members: teamMembers,
            standupEntries: filteredData,
            stats: {
                /* will be calculated */
            } as TeamStats,
        };

        // Calculate statistics
        teamData.stats = calculateTeamStats(
            teamData.standupEntries,
            teamData.members,
            teamMembersStatusToday
        );

        // Generate and download the report
        const pdfBlob = await generateTeamReport(teamData, data);
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${teamData.teamName}-Report-${format(
            new Date(),
            "yyyy-MM-dd"
        )}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error generating report:", error);
        // Handle error appropriately
    }
};

const calculateTeamStats = (
    entries: StandupResponse[],
    members: ITeamMember[],
    teamMembersStatusToday: IStatus[]
) => {
    const totalEntries = entries.length;

    // const participation =
    //   (complete_members / teamMembersStatusToday.length) * 100 || 0;
    const completedEntries = entries.filter(
        (entry) => entry.status === "responded"
    ).length;
    const onTimeEntries = completedEntries;

    const averageResponseTime = calculateAverageResponseTime(
        teamMembersStatusToday
    );

    return {
        totalMembers: members.length,
        averageParticipation: (completedEntries / totalEntries) * 100,
        onTimeSubmissions: onTimeEntries,
        averageResponseTime: averageResponseTime,
        missedStandups: totalEntries - completedEntries,
    };
};