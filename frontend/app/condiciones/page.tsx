'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function Privacidad() {
    const [accepted, setAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAccept = async () =>{
        setLoading(true);
        if(!accepted){
            alert("Debe aceptar los términos de privacidad para continuar.");
            setLoading(false);
            return;
        }
        try {

        }catch(err){
            setError(`Error al aceptar los términos de privacidad. Por favor, inténtalo de nuevo. ${err}`);
        }
    }
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-gray-50 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Política de Privacidad</h1>
        <p className="mb-4">
          Aquí va el contenido de la política de privacidad...
        </p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {!accepted ? (
          <button
            onClick={handleAccept}
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Procesando...' : 'Aceptar'}
          </button>
        ) : (
          <p className="text-green-600 font-semibold">Has aceptado los términos de privacidad.</p>
        )}
      </div>
    </div>
  );
}
