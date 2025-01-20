
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ExportToExcel = () => {
  const data = [
    { Response: "I enjoy the standup", Rate: "50%" ,Polls: "I participated in the stand up"},
    { Response: "I didn't participate in  the standup", Rate: "50%" ,Polls: "I participated in the stand up"},
    { Response: "I enjoy the standup", Rate: "70%" ,Polls: "I participated in the stand up"},
    { Response: "I enjoy the standup", Rate: "90%" ,Polls: "I participated in the stand up"},
    { Response: "I didn't enjoy  the standup due to internet connnection", Rate: "30%" ,Polls: "I  diidn't participate fully  in the stand up"},
  ];

  const exportToExcel = () => {
    
    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  
    const fileName = "ExportedData.xlsx";
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, fileName);
  };

  return (
    <div>
      <button onClick={exportToExcel}>Export to Excel</button>
    </div>
  );
};

export default ExportToExcel;
