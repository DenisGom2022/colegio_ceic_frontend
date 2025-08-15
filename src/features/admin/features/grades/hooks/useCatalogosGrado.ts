import { useState, useEffect } from 'react';
import { fetchNivelesAcademicos, fetchJornadas, type NivelAcademico, type Jornada } from '../services/catalogosService';

export const useCatalogosGrado = () => {
  const [niveles, setNiveles] = useState<NivelAcademico[]>([]);
  const [jornadas, setJornadas] = useState<Jornada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCatalogos = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Cargar niveles primero
        let nivelesData: NivelAcademico[] = [];
        try {
          nivelesData = await fetchNivelesAcademicos();
          console.log('Niveles cargados:', nivelesData);
        } catch (nivelesErr: any) {
          console.error('Error al cargar niveles académicos:', nivelesErr);
          setError('Error al cargar niveles académicos: ' + (nivelesErr.message || 'Error desconocido'));
          throw nivelesErr;
        }
        
        // Luego cargar jornadas
        let jornadasData: Jornada[] = [];
        try {
          jornadasData = await fetchJornadas();
          console.log('Jornadas cargadas:', jornadasData);
        } catch (jornadasErr: any) {
          console.error('Error al cargar jornadas:', jornadasErr);
          setError('Error al cargar jornadas: ' + (jornadasErr.message || 'Error desconocido'));
          throw jornadasErr;
        }
        
        if (nivelesData.length === 0) {
          console.warn('No se encontraron niveles académicos');
        }
        
        if (jornadasData.length === 0) {
          console.warn('No se encontraron jornadas');
        }
        
        setNiveles(nivelesData);
        setJornadas(jornadasData);
        
      } catch (err: any) {
        console.error('Error general al cargar catálogos:', err);
        if (!error) {
          setError('Error al cargar los catálogos necesarios. Por favor, intente nuevamente.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogos();
  }, []);

  return { niveles, jornadas, loading, error };
};
