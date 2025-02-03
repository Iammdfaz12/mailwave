import axios from "axios";
import { useState } from "react";
import * as XLSX from "xlsx";

export const Home = () => {
  const [senderName, setSenderName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [toEmailList, setToEmailList] = useState([]);

  const [sendStatus, setSendStatus] = useState(false);

  const inputFileHandle = (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const workSheet = workbook.Sheets[sheetName];
      const emailList = XLSX.utils.sheet_to_json(workSheet, { header: "A" });
      const totalEmail = emailList.map((item, index) => {
        return item.A;
      });
      console.log(totalEmail);
      setToEmailList(totalEmail);
    };
    reader.readAsBinaryString(file);
  };

  function sendEmail() {
    setSendStatus(true);
    axios
      .post(`${import.meta.env.VITE_APP_BACKEND_URL}/sendemail`, {
        senderName: senderName,
        fromEmail: fromEmail,
        toEmail: toEmailList,
        subject: subject,
        emailMessage: emailContent,
      })
      .then((response) => {
        if (response.data === true) {
          alert("Email sent successfully...");
          setSendStatus(false);
        } else {
          alert("Email send failed...");
        }
      });
  }

  return (
    <>
      <div className="flex min-h-screen flex-col justify-center items-center w-full p-8 gap-10 md:flex-row">
        <div className="flex w-full flex-col gap-5 md:w-[75%] pt-6">
          <h1 className=" text-3xl text-center md:text-left font-bold">Mail Wave</h1>
          <p className="mt-5 text-xl md:text-left text-justify text-[#FBFBFB]">
            Effortlessly streamline your communication with our Bulk Email
            Sender project. Designed to enhance productivity, this tool enables
            users to send personalized emails to multiple recipients
            simultaneously, ensuring efficient and effective outreach for
            businesses, marketing campaigns, and professional networks.
          </p>
        </div>

        {/* Email Inputs */}

        <div className="flex flex-col gap-7 w-full md:w-[75%] items-center bg-[#ffffff34] p-10 rounded-xl shadow-[rgba(0,0,0,0.35)_0px_5px_15px]">
          <h1 className="text-3xl font-bold">Mail Wave</h1>

          {/* Sender Name */}
          <input
            type="text"
            name="sender-name"
            id="sender-name"
            placeholder="Enter sender name"
            className="bg-white border-[2px] outline-blue-50 rounded-sm w-full p-1.5"
            value={senderName}
            onChange={(event) => {
              setSenderName(event.target.value);
            }}
          />

          {/* Sender Email */}
          <input
            type="email"
            name="from-email"
            id="from-email"
            placeholder="Enter sender Email Id (From)"
            className="bg-white border-[2px] outline-blue-50 rounded-sm w-full p-1.5"
            value={fromEmail}
            onChange={(event) => {
              setFromEmail(event.target.value);
            }}
          />

          {/* File Input */}
          <input
            type="file"
            name="email-file"
            id="email-file"
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-black hover:file:bg-blue-100"
            onChange={inputFileHandle}
          />
          <input
            type="text"
            name="subject"
            id="subject"
            placeholder="Enter the subject"
            className="bg-white border-[2px] outline-blue-50 rounded-sm w-full p-1.5"
            value={subject}
            onChange={(event) => {
              setSubject(event.target.value);
            }}
          />
          <textarea
            name="email-content"
            id="email-content"
            value={emailContent}
            onChange={(event) => {
              setEmailContent(event.target.value);
            }}
            placeholder="Write your email here..."
            className="bg-white w-full h-24 resize-none border-[2px] p-1.5 outline-blue-50 rounded-md"
          ></textarea>

          <p className="font-medium">
            Total Emails in the file: {toEmailList.length}
          </p>

          <div>
            <button
              onClick={sendEmail}
              className=" bg-blue-950 px-[25px] py-[9px] text-center text-amber-50 rounded-md cursor-pointer"
            >
              {sendStatus ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
