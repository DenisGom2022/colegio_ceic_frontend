import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface UserDeleteModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
    confirmButtonText?: string;
}

export const UserDeleteModal: React.FC<UserDeleteModalProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    isLoading = false,
    confirmButtonText = 'Eliminar'
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
                <div className="bg-red-50 p-4 flex items-center gap-3 border-b border-red-100">
                    <div className="text-red-500">
                        <FaExclamationTriangle size={24} />
                    </div>
                    <h2 className="text-lg font-bold text-red-800">{title}</h2>
                </div>
                
                <div className="p-6">
                    <p className="text-gray-700">{message}</p>
                </div>
                
                <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    />
                                </svg>
                                Eliminando...
                            </>
                        ) : (
                            confirmButtonText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
