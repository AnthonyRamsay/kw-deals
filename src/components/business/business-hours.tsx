const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const DAY_LABELS: Record<string, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

interface BusinessHoursProps {
  hours: Record<string, { open: string; close: string } | null> | null;
}

export function BusinessHours({ hours }: BusinessHoursProps) {
  if (!hours) return null;

  const today = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  return (
    <div className="space-y-1.5">
      <h3 className="text-sm font-semibold text-stone-900 mb-2">Hours</h3>
      {DAYS.map((day) => {
        const schedule = hours[day];
        const isToday = day === today;

        return (
          <div
            key={day}
            className={`flex justify-between text-sm py-1 px-2 rounded ${
              isToday ? "bg-brand-50 font-medium" : ""
            }`}
          >
            <span className={isToday ? "text-brand-700" : "text-stone-600"}>
              {DAY_LABELS[day]}
            </span>
            <span className={isToday ? "text-brand-700" : "text-stone-900"}>
              {schedule ? `${schedule.open} - ${schedule.close}` : "Closed"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
