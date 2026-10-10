"use client";

import { useEffect, useState } from "react";

function getBangladeshDate() {
  return new Intl.DateTimeFormat("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());
}

export default function CurrentDate() {
  const [date, setDate] = useState("");

  useEffect(() => {
    function updateDate() {
      setDate(getBangladeshDate());
    }

    // Show the current date when the component loads.
    updateDate();

    // Check the date again every minute.
    const intervalId = window.setInterval(updateDate, 60_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <time aria-label="বাংলাদেশের বর্তমান তারিখ">
      {date}
    </time>
  );
}