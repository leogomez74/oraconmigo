import { useForm, usePage } from '@inertiajs/react';

export default function Register() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        email: '',
        pais: '',
        whatsapp: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    Register
                </h1>

                {flash?.success && (
                    <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                        {flash.success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.nombre && (
                            <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="pais" className="block text-sm font-medium text-gray-700 mb-2">
                            País
                        </label>
                        <input
                            type="text"
                            id="pais"
                            value={data.pais}
                            onChange={(e) => setData('pais', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.pais && (
                            <p className="mt-1 text-sm text-red-600">{errors.pais}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                            WhatsApp (opcional)
                        </label>
                        <input
                            type="text"
                            id="whatsapp"
                            value={data.whatsapp}
                            onChange={(e) => setData('whatsapp', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.whatsapp && (
                            <p className="mt-1 text-sm text-red-600">{errors.whatsapp}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Registering...' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
}
