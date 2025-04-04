import React from 'react';

interface DeletedParcela {
  id: number;
  nombre: string;
  ubicacion: string;
  tipo_cultivo: string;
  fechaEliminacion: string;
}

interface DeletedParcelasProps {
  deletedParcelas: DeletedParcela[] | undefined;
}

export default function DeletedParcelas({ deletedParcelas }: DeletedParcelasProps) {
  if (!deletedParcelas || deletedParcelas.length === 0) {
    return null;
  }

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Parcelas Eliminadas</h2>
        <div className="space-y-4">
          {deletedParcelas.map((parcela) => (
            <div key={parcela.id} className="bg-red-50 p-4 rounded">
              <h3 className="font-semibold text-red-700">{parcela.nombre}</h3>
              <p className="text-red-600">Ubicación: {parcela.ubicacion}</p>
              <p className="text-red-600">Cultivo: {parcela.tipo_cultivo}</p>
              <p className="text-red-600">Fecha de eliminación: {new Date(parcela.fechaEliminacion).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
