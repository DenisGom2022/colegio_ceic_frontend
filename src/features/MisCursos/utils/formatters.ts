export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
};

export const getInitials = (firstName: string, lastName: string) => {
  return (firstName?.charAt(0) || "") + (lastName?.charAt(0) || "");
};
