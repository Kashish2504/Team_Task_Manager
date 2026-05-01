export default function Badge({ children, variant = "gray" }) {
  const variants = {
    gray: "bg-gray-100 text-gray-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
    purple: "bg-purple-100 text-purple-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

export function statusVariant(status) {
  return { TODO: "gray", IN_PROGRESS: "blue", DONE: "green" }[status] || "gray";
}

export function priorityVariant(priority) {
  return { LOW: "gray", MEDIUM: "yellow", HIGH: "red" }[priority] || "gray";
}