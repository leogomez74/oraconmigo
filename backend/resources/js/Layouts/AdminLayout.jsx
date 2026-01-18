import { useMemo, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

function NavItem({ href, label, active, onClick }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={classNames(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
            )}
        >
            <span className="h-2 w-2 rounded-full bg-indigo-600 opacity-70" />
            <span>{label}</span>
        </Link>
    );
}

function LogoutButton({ className = '', onClick }) {
    return (
        <Link
            href="/admin/logout"
            method="post"
            as="button"
            onClick={onClick}
            className={classNames(
                'w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                'text-red-700 hover:bg-red-50',
                className
            )}
        >
            <span className="h-2 w-2 rounded-full bg-red-600 opacity-70" />
            <span>Cerrar sesión</span>
        </Link>
    );
}

export default function AdminLayout({ title, children }) {
    const [isOpen, setIsOpen] = useState(false);
    const { url } = usePage();

    const nav = useMemo(
        () => [
            { href: '/admin/dashboard', label: 'Dashboard', active: url.startsWith('/admin/dashboard') || url === '/admin' },
            { href: '/admin/users', label: 'Usuarios', active: url.startsWith('/admin/users') },
            { href: '/admin/funnel', label: 'Funnel', active: url.startsWith('/admin/funnel') },
            { href: '/admin/content', label: 'Contenido', active: url.startsWith('/admin/content') },
            { href: '/admin/encuesta-analytics', label: 'Encuesta', active: url.startsWith('/admin/encuesta-analytics') },
        ],
        [url]
    );

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile top bar */}
            <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between px-4 py-3">
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label="Abrir menú"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="text-sm font-semibold text-gray-900">ORA Admin</div>
                    <div className="w-10" />
                </div>
            </div>

            {/* Mobile drawer */}
            {isOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setIsOpen(false)}
                        aria-label="Cerrar menú"
                    />
                    <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="font-bold text-gray-900">ORA Admin</div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                aria-label="Cerrar"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <nav className="space-y-1">
                            {nav.map((item) => (
                                <NavItem
                                    key={item.href}
                                    href={item.href}
                                    label={item.label}
                                    active={item.active}
                                    onClick={() => setIsOpen(false)}
                                />
                            ))}
                            <div className="pt-2 mt-2 border-t border-gray-200">
                                <LogoutButton onClick={() => setIsOpen(false)} />
                            </div>
                        </nav>
                    </div>
                </div>
            )}

            <div className="flex">
                {/* Desktop sidebar */}
                <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white border-r border-gray-200">
                    <div className="h-16 flex items-center px-6 border-b border-gray-200">
                        <div className="font-bold text-gray-900">ORA Admin</div>
                    </div>
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {nav.map((item) => (
                            <NavItem
                                key={item.href}
                                href={item.href}
                                label={item.label}
                                active={item.active}
                            />
                        ))}
                        <div className="pt-2 mt-2 border-t border-gray-200">
                            <LogoutButton />
                        </div>
                    </nav>
                </aside>

                <div className="flex-1 lg:pl-64">
                    <main className="px-4 py-6 sm:px-6 lg:px-8">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            {title ? (
                                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                            ) : (
                                <div />
                            )}
                            <div className="hidden sm:block">
                                <LogoutButton className="!w-auto" />
                            </div>
                        </div>
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
