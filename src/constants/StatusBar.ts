interface StatusColorMap {
  [key: string]: string;
}

export const getStatusColor = (status: string): string => {
  const colorMap: StatusColorMap = {
    pending: "text-orange-500",
    completed: "text-emerald-500",
    delayed: "text-orange-500",
    "on schedule": "text-teal-500",
  };

  return colorMap[status.toLowerCase()] || "text-gray-500";
};

interface ProgressColors {
  bg: string;
  bar: string;
}

export const getProgressColors = (status: string): ProgressColors => {
  switch (status.toLowerCase()) {
    case "completed":
    case "on schedule":
      return {
        bg: "bg-emerald-200",
        bar: "bg-emerald-500",
      };
    case "delayed":
    case "pending":
      return {
        bg: "bg-red-200",
        bar: "bg-red-500",
      };
    default:
      return {
        bg: "bg-gray-200",
        bar: "bg-gray-500",
      };
  }
};