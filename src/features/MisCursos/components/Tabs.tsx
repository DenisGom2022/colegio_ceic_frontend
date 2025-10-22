import styles from "../pages/MisCursosDetailPage.module.css";

interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Tabs = ({ activeTab, onTabChange }: TabsProps) => {
  const tabs = [
    { id: "info", label: "Información General" },
    { id: "tasks", label: "Tareas" },
    { id: "notes", label: "Notas" },
    { id: "students", label: "Alumnos" }
  ];

  return (
    <div className={styles.tabGroup}>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};
