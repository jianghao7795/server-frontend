export const colorItem = [
  "primary",
  "info",
  "success",
  "warning",
  "default",
  "error",
];

export const colorIndex = (
  index: number
): "default" | "primary" | "info" | "success" | "warning" | "error" => {
  return colorItem[index % 6] as
    | "default"
    | "primary"
    | "info"
    | "success"
    | "warning"
    | "error";
};

export const Base_URL = import.meta.env.VITE_BASE_API + "/";
