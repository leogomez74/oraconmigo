import { useState, useCallback, useEffect } from 'react';
import { router, Link, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';

export default function Users({ users, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Form handling
    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        nombre: '',
        email: '',
        pais: '',
        whatsapp: '',
        is_admin: false,
    });

    // Simple debounce implementation
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    // Debounce search requests
    const debouncedSearch = useCallback(
        debounce((value) => {
            router.get(
                '/admin/users',
                { search: value, filter: filters.filter },
                { preserveState: true, replace: true }
            );
        }, 300),
        [filters.filter]
    );

    const onSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        debouncedSearch(value);
    };

    // Modal Handlers
    const openCreateModal = () => {
        setModalMode('create');
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setModalMode('edit');
        setSelectedUser(user);
        setData({
            nombre: user.nombre,
            email: user.email,
            pais: user.pais || '',
            whatsapp: user.whatsapp || '',
            is_admin: user.is_admin,
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        reset();
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modalMode === 'create') {
            post('/admin/users', {
                onSuccess: () => closeModal(),
            });
        } else {
            put(`/admin/users/${selectedUser.id}`, {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = () => {
        if (userToDelete) {
            destroy(`/admin/users/${userToDelete.id}`, {
                onSuccess: () => {
                    closeDeleteModal();
                    router.reload({ only: ['users'] });
                },
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                             <a href="/admin/dashboard" className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </a>
                            <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
                        </div>
                        <div className="flex gap-4">
                            <a href="/admin/dashboard" className="text-sm text-indigo-600 hover:text-indigo-800">
                                Dashboard
                            </a>
                            <a href="/admin/funnel" className="text-sm text-indigo-600 hover:text-indigo-800">
                                Funnel
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Filters & Search & Create Button */}
                <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="w-full md:w-1/3 relative">
                        <input
                            type="text"
                            value={search}
                            onChange={onSearchChange}
                            placeholder="Buscar usuarios..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    
                    <div className="flex gap-2 items-center">
                        {/* Filter Tabs */}
                        <div className="flex gap-2 mr-4">
                            <Link 
                                href="/admin/users"
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!filters.filter ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                Todos
                            </Link>
                            <Link 
                                href="/admin/users?filter=active"
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filters.filter === 'active' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                Activos
                            </Link>
                             <Link 
                                href="/admin/users?filter=admin"
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filters.filter === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                Admins
                            </Link>
                        </div>
                        
                        {/* Create Button */}
                        <button
                            onClick={openCreateModal}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Crear Usuario
                        </button>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Usuario
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        País
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tipo
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Registrado
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Acciones</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.data.length > 0 ? (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                                        {user.nombre.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{user.nombre}</div>
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{user.pais || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.is_admin ? (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                                        Admin
                                                    </span>
                                                ) : (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        Usuario
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button 
                                                    onClick={() => openEditModal(user)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    Editar
                                                </button>
                                                <button 
                                                    onClick={() => openDeleteModal(user)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                            No se encontraron usuarios
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {users.links && users.links.length > 3 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Mostrando <span className="font-medium">{users.from}</span> a <span className="font-medium">{users.to}</span> de{' '}
                                        <span className="font-medium">{users.total}</span> resultados
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        {users.links.map((link, i) => (
                                             <Link
                                                key={i}
                                                href={link.url || '#'}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    link.active
                                                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                preserveState
                                            />
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={modalMode === 'create' ? 'Crear Nuevo Usuario' : 'Editar Usuario'}
                footer={
                    <>
                        <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={handleSubmit}
                            disabled={processing}
                        >
                            {processing ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={closeModal}
                        >
                            Cancelar
                        </button>
                    </>
                }
            >
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            id="nombre"
                            value={data.nombre}
                            onChange={e => setData('nombre', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="pais" className="block text-sm font-medium text-gray-700">País</label>
                        <input
                            type="text"
                            name="pais"
                            id="pais"
                            value={data.pais}
                            onChange={e => setData('pais', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.pais && <p className="mt-1 text-sm text-red-600">{errors.pais}</p>}
                    </div>

                    <div>
                        <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">WhatsApp</label>
                        <input
                            type="text"
                            name="whatsapp"
                            id="whatsapp"
                            value={data.whatsapp}
                            onChange={e => setData('whatsapp', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.whatsapp && <p className="mt-1 text-sm text-red-600">{errors.whatsapp}</p>}
                    </div>

                    <div className="flex items-center">
                        <input
                            id="is_admin"
                            name="is_admin"
                            type="checkbox"
                            checked={data.is_admin}
                            onChange={e => setData('is_admin', e.target.checked)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="is_admin" className="ml-2 block text-sm text-gray-900">
                            Es Administrador
                        </label>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                title="Eliminar Usuario"
                footer={
                    <>
                         <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={handleDelete}
                            disabled={processing}
                        >
                            {processing ? 'Eliminando...' : 'Eliminar'}
                        </button>
                        <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={closeDeleteModal}
                        >
                            Cancelar
                        </button>
                    </>
                }
            >
                <div className="mt-2">
                    <p className="text-sm text-gray-500">
                        ¿Estás seguro de que deseas eliminar al usuario <strong>{userToDelete?.nombre}</strong>? Esta acción no se puede deshacer.
                    </p>
                </div>
            </Modal>
        </div>
    );
}
