export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-[480px] mx-auto bg-white min-h-screen">
                {children}
            </main>
        </div>
    );
}
