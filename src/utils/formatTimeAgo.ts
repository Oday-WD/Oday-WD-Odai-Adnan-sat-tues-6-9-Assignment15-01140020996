import {
  differenceInSeconds,
  formatDistanceToNowStrict,
  isValid,
  type Locale,
} from "date-fns";
import { enUS } from "date-fns/locale";

const UNITS: Record<string, string> = {
  xSeconds: "s",
  xMinutes: "m",
  xHours: "h",
  xDays: "d",
  xMonths: "mo",
  xYears: "y",
};

const shortLocale: Locale = {
  ...enUS,
  formatDistance: (token, count, options) => {
    const unit = UNITS[token];
    if (!unit) return enUS.formatDistance(token, count, options);

    const text = `${count}${unit}`;
    if (!options?.addSuffix) return text;

    return options.comparison && options.comparison > 0
      ? `in ${text}`
      : `${text} ago`;
  },
};

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);

  if (!isValid(date)) return "";
  if (differenceInSeconds(new Date(), date) < 1) return "Just now";

  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: shortLocale,
  });
}
