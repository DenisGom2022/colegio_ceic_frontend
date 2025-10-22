import { useState, useEffect } from "react";
import type { Tarea } from "../../../interfaces/interfaces";

interface ModificarNotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  tarea: Tarea | null;
  alumnoNombre: string;
  punteoActual: number;
  tareaAlumnoId: number | null;
  onSubmit: (tareaAlumnoId: number, nuevoPunteo: number) => void;
  loading: boolean;
  error: string | null;
}

export const ModificarNotaModal = ({ 
  isOpen, 
  onClose, 
  tarea, 
  alumnoNombre, 
  punteoActual,
  tareaAlumnoId,
  onSubmit, 
  loading, 
  error 
}: ModificarNotaModalProps) => {
  const [punteo, setPunteo] = useState("");

  useEffect(() => {
    if (isOpen && punteoActual !== null) {
      setPunteo(punteoActual.toString());
    }
  }, [isOpen, punteoActual]);

  if (!isOpen || !tarea || !tareaAlumnoId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(tareaAlumnoId, Number(punteo));
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "24px",
        minWidth: "400px",
        maxWidth: "500px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}>
        <h2 style={{ marginTop: 0, marginBottom: "20px", fontSize: "1.5rem", color: "#1f2937" }}>
          Modificar Nota
        </h2>
        
        <div style={{ marginBottom: "16px", padding: "12px", backgroundColor: "#f3f4f6", borderRadius: "8px" }}>
          <div style={{ marginBottom: "8px" }}>
            <strong style={{ color: "#374151" }}>Alumno:</strong> <span style={{ color: "#6b7280" }}>{alumnoNombre}</span>
          </div>
          <div>
            <strong style={{ color: "#374151" }}>Tarea:</strong> <span style={{ color: "#6b7280" }}>{tarea.titulo}</span>
          </div>
          <div style={{ marginTop: "4px", fontSize: "0.875rem", color: "#9ca3af" }}>
            Punteo máximo: {tarea.punteo} pts
          </div>
          <div style={{ marginTop: "8px", padding: "8px", backgroundColor: "#dbeafe", borderRadius: "6px" }}>
            <strong style={{ color: "#1e40af", fontSize: "0.875rem" }}>Punteo actual:</strong> 
            <span style={{ color: "#1e40af", fontSize: "0.875rem", marginLeft: "6px", fontWeight: "600" }}>
              {punteoActual} pts
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#374151" }}>
              Nuevo punteo:
            </label>
            <input
              type="number"
              min={0}
              max={tarea.punteo}
              step="0.01"
              value={punteo}
              onChange={(e) => setPunteo(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                boxSizing: "border-box"
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: "12px",
              marginBottom: "16px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "6px",
              color: "#dc2626",
              fontSize: "0.875rem"
            }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: "10px 20px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                backgroundColor: "white",
                color: "#374151",
                fontWeight: "500",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.5 : 1
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "6px",
                backgroundColor: loading ? "#9ca3af" : "#f59e0b",
                color: "white",
                fontWeight: "500",
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Actualizando..." : "Actualizar Nota"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
