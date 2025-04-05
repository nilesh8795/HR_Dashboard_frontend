import React, { useState } from "react";

export const Calendar = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  return (
    <input
      type="date"
      value={date}
      onChange={(e) => setDate(e.target.value)}
      className="border px-3 py-2 rounded"
    />
  );
};
