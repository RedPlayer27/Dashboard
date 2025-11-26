import React, { useEffect, useState } from "react";
import { format } from "date-fns";

export default function ClockWidget() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = format(now, "hh:mm:ss a");
  const dateString = format(now, "EEEE, MMMM d, yyyy");

  return (
    <div className="widget-card text-center h-100">
      <h5 className="widget-title">Current Time</h5>
      <h1 className="display-6 fw-bold mb-1">{timeString}</h1>
      <p className="text-muted mb-0">{dateString}</p>
    </div>
  );
}
