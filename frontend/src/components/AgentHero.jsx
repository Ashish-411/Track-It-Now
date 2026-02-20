import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function AgentHero({ totalDeliveries = 0}) {
  const { user } = useAuth();
  const [displayCount, setDisplayCount] = useState(0);

useEffect(() => {
  if (totalDeliveries === 0) return;

  let start = 0;
  const duration = 1200; // ms
  const stepTime = 16;   // ~60fps
  const steps = duration / stepTime;
  const increment = totalDeliveries / steps;

  const timer = setInterval(() => {
    start += increment;
    if (start >= totalDeliveries) {
      setDisplayCount(totalDeliveries);
      clearInterval(timer);
    } else {
      setDisplayCount(Math.floor(start));
    }
  }, stepTime);

  return () => clearInterval(timer);
}, [totalDeliveries]);


  return (
    <div className="ah-hero">
      {/* decorative circles */}
      <div className="ah-hero-circle-top" />
      <div className="ah-hero-circle-bottom" />

      {/* Top row */}
      <div className="ah-hero-top">
        <div>
          <div className="ah-greeting">{getGreeting()}</div>
          <div className="ah-name">{user?.name || "Agent"}</div>
        </div>

      </div>

      {/* Count row */}
      <div className="ah-count-row">
        <div className="ah-count-number">{displayCount}</div>
          <div className="ah-count-label">Total Deliveries</div>
        <div className="ah-count-info">
        </div>
      </div>
    </div>
  );
}

export default AgentHero;