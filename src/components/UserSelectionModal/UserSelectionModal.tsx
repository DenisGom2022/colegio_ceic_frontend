import React, { useState } from 'react';
import { FaSearch, FaSpinner, FaTimes, FaCheck } from 'react-icons/fa';
import { useTablaUsuario } from '../../hooks/useTablaUsuario';
import styles from './UserSelectionModal.module.css';

interface UserSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectUser: (usuario: any) => void;
}

const UserSelectionModal: React.FC<UserSelectionModalProps> = ({ isOpen, onClose, onSelectUser }) => {
    // Estados para el modal
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 10;

    // Hook para cargar usuarios
    const { usuarios, totalPages, cargando: cargandoUsuarios, error: errorUsuarios } = 
        useTablaUsuario(page, pageSize, searchQuery);

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>Seleccionar Usuario</h2>
                    <button 
                        className={styles.modalClose}
                        onClick={onClose}
                    >
                        <FaTimes size={18} />
                    </button>
                </div>
                
                <div className={styles.modalBody}>
                    {/* Buscador de usuarios */}
                    <div className={styles.searchContainer}>
                        <div className={styles.searchInputContainer}>
                            <FaSearch className={styles.searchIcon} />
                            <input
                                type="text"
                                className={styles.searchInput}
                                placeholder="Buscar usuario por nombre o código"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    if (e.target.value === "") {
                                        setPage(1);
                                    }
                                }}
                            />
                        </div>
                        <button 
                            className={styles.searchButton}
                            onClick={() => setPage(1)} // Resetear la página al buscar
                        >
                            <FaSearch size={14} />
                            Buscar
                        </button>
                    </div>
                    
                    {/* Lista de usuarios */}
                    <div className={styles.userListContainer}>
                        {cargandoUsuarios ? (
                            <div className={styles.loadingUsers}>
                                <FaSpinner className={styles.spinnerIcon} />
                                <p>Cargando usuarios...</p>
                            </div>
                        ) : errorUsuarios ? (
                            <div className={styles.errorUsers}>
                                <p>{errorUsuarios}</p>
                            </div>
                        ) : usuarios.length === 0 ? (
                            <div className={styles.noUsersFound}>
                                <p>No se encontraron usuarios que coincidan con la búsqueda.</p>
                            </div>
                        ) : (
                            <div className={styles.userList}>
                                {usuarios.map(usuario => (
                                    <div 
                                        key={usuario.usuario}
                                        className={styles.userItem}
                                        onClick={() => onSelectUser(usuario)}
                                    >
                                        <div className={styles.userAvatar}>
                                            {usuario.primerNombre?.charAt(0)}{usuario.primerApellido?.charAt(0)}
                                        </div>
                                        <div className={styles.userInfo}>
                                            <div className={styles.userName}>
                                                {usuario.primerNombre} {usuario.segundoNombre} {usuario.primerApellido} {usuario.segundoApellido}
                                            </div>
                                            <div className={styles.userCode}>
                                                {usuario.usuario} - {usuario.tipoUsuario?.descripcion || 'Sin rol'}
                                            </div>
                                        </div>
                                        <div className={styles.userSelect}>
                                            <FaCheck size={14} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Paginación */}
                    {!cargandoUsuarios && usuarios.length > 0 && (
                        <div className={styles.pagination}>
                            <button
                                className={styles.pageButton}
                                disabled={page === 1}
                                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                            >
                                Anterior
                            </button>
                            
                            <span className={styles.pageInfo}>
                                Página {page} de {totalPages || 1}
                            </span>
                            
                            <button
                                className={styles.pageButton}
                                disabled={page >= (totalPages || 1)}
                                onClick={() => setPage(prev => prev + 1)}
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </div>
                
                <div className={styles.modalFooter}>
                    <button 
                        className={styles.cancelButton}
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserSelectionModal;
