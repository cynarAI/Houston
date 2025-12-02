import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CalendarViewProps {
  items: any[];
  type: "goals" | "tasks";
}

export default function CalendarView({ items, type }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getItemsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return items.filter((item) => {
      const itemDate = type === "goals" ? item.deadline : item.dueDate;
      if (!itemDate) return false;
      const itemDateStr = new Date(itemDate).toISOString().split("T")[0];
      return itemDateStr === dateStr;
    });
  };

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 bg-base-5/30 rounded-lg" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayItems = getItemsForDate(day);
    const isToday =
      day === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear();

    days.push(
      <Card
        key={day}
        className={`h-24 overflow-hidden ${
          isToday ? "border-accent-blue bg-accent-blue/5" : "bg-base-0/30 border-base-20"
        }`}
      >
        <CardContent className="p-2 h-full flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-medium ${isToday ? "text-accent-blue" : ""}`}>{day}</span>
            {dayItems.length > 0 && (
              <Badge variant="secondary" className="text-xs px-1 py-0">
                {dayItems.length}
              </Badge>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-1">
            {dayItems.slice(0, 2).map((item) => (
              <div
                key={item.id}
                className="text-xs p-1 bg-accent-blue/10 rounded truncate"
                title={item.title}
              >
                {item.title}
              </div>
            ))}
            {dayItems.length > 2 && (
              <div className="text-xs text-muted-foreground">+{dayItems.length - 2} more</div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {monthNames[month]} {year}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-2">
        {dayNames.map((name) => (
          <div key={name} className="text-center text-sm font-medium text-muted-foreground">
            {name}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">{days}</div>
    </div>
  );
}
