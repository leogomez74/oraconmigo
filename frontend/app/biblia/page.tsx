
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuth as authCheck, apiRequest, getCsrfCookie } from '@/lib/auth';
import PremiumBanner from '@/components/PremiumBanner';

interface Book {
  names: string[];
  abrev: string;
  chapters: number;
  testament: string;
}

interface Verse {
  verse: string;
  number: number;
  study?: string;
  id: number;
}

export default function BiblePage() {
  const router = useRouter();
  const [view, setView] = useState<'books' | 'chapters' | 'verses'>('books');
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [chapterContent, setChapterContent] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await authCheck();

      if (!userData) {
        router.push('/');
        return;
      }

      setAuthLoading(false);
      fetchBooks();
    } catch (error) {
      console.error('Error:', error);
      router.push('/');
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://bible-api.deno.dev/api/books');
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const registerReading = async (book: Book, chapter: number) => {
    try {
      await getCsrfCookie();
      await apiRequest('/api/biblia/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          book: book.names[0],
          chapter: chapter,
        }),
      });
    } catch (error) {
      console.error('Error registrando lectura:', error);
    }
  };

  const fetchChapter = async (book: Book, chapter: number) => {
    setLoading(true);
    // Scroll to top
    window.scrollTo(0, 0);

    try {
      const res = await fetch(`https://bible-api.deno.dev/api/read/rv1960/${book.names[0]}/${chapter}`);
      const data = await res.json();

      if (data && data.vers && Array.isArray(data.vers)) {
        setChapterContent(data.vers);
        // Registrar la lectura en el backend
        registerReading(book, chapter);
      } else if (Array.isArray(data)) {
        setChapterContent(data);
        // Registrar la lectura en el backend
        registerReading(book, chapter);
      } else {
         setChapterContent([]);
      }
    } catch (error) {
      console.error('Error fetching chapter:', error);
      setChapterContent([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setView('chapters');
  };

  const handleChapterSelect = (chapter: number) => {
    setSelectedChapter(chapter);
    if (selectedBook) {
      fetchChapter(selectedBook, chapter);
      setView('verses');
    }
  };

  const handleBack = () => {
    if (view === 'verses') {
      setView('chapters');
      setChapterContent([]);
    } else if (view === 'chapters') {
      setView('books');
      setSelectedBook(null);
    } else {
      router.push('/dashboard');
    }
  };

  const handleNextChapter = () => {
    if (!selectedBook) return;

    if (selectedChapter < selectedBook.chapters) {
      const nextChapter = selectedChapter + 1;
      setSelectedChapter(nextChapter);
      fetchChapter(selectedBook, nextChapter);
    } else {
      // Find current book index
      const currentBookIndex = books.findIndex(b => b.abrev === selectedBook.abrev);
      if (currentBookIndex < books.length - 1) {
        const nextBook = books[currentBookIndex + 1];
        setSelectedBook(nextBook);
        setSelectedChapter(1);
        fetchChapter(nextBook, 1);
      }
    }
  };

  const handlePrevChapter = () => {
    if (!selectedBook) return;

    if (selectedChapter > 1) {
      const prevChapter = selectedChapter - 1;
      setSelectedChapter(prevChapter);
      fetchChapter(selectedBook, prevChapter);
    } else {
      // Find current book index
      const currentBookIndex = books.findIndex(b => b.abrev === selectedBook.abrev);
      if (currentBookIndex > 0) {
        const prevBook = books[currentBookIndex - 1];
        setSelectedBook(prevBook);
        setSelectedChapter(prevBook.chapters);
        fetchChapter(prevBook, prevBook.chapters);
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900 truncate max-w-[200px] sm:max-w-md">
              {view === 'books' && 'Santa Biblia'}
              {view === 'chapters' && selectedBook?.names[0]}
              {view === 'verses' && `${selectedBook?.names[0]} ${selectedChapter}`}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {loading && (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {!loading && view === 'books' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {books.map((book) => (
              <button
                key={book.abrev}
                onClick={() => handleBookSelect(book)}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all text-left"
              >
                <div className="font-semibold text-gray-900">{book.names[0]}</div>
                <div className="text-xs text-gray-500 mt-1">{book.chapters} caps</div>
              </button>
            ))}
          </div>
        )}

        {!loading && view === 'chapters' && selectedBook && (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
            {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((chapter) => (
              <button
                key={`cap-${chapter}`}
                onClick={() => handleChapterSelect(chapter)}
                className="aspect-square bg-white rounded-xl shadow-sm border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center font-bold text-gray-700"
              >
                {chapter}
              </button>
            ))}
          </div>
        )}

        {!loading && view === 'verses' && (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4 mb-6">
              {chapterContent.length > 0 ? (
                chapterContent.map((v) => (
                  <div key={`v-${selectedChapter}-${v.number}`} className="flex gap-3">
                    <span className="text-xs font-bold text-indigo-500 mt-1 select-none w-6 text-right flex-shrink-0">
                      {v.number}
                    </span>
                    <div className="space-y-1">
                      {v.study && (
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{v.study}</p>
                      )}
                      <p className="text-gray-800 leading-relaxed text-lg">
                        {v.verse}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No se pudo cargar el contenido del capítulo.</p>
              )}
            </div>

            <PremiumBanner variant="slim" className="mb-6" />

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center gap-4">
              <button
                onClick={handlePrevChapter}
                className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-medium shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={!selectedBook || (selectedChapter === 1 && books.findIndex(b => b.abrev === selectedBook?.abrev) === 0)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Anterior
              </button>
              
              <button
                onClick={handleNextChapter}
                className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-xl font-medium shadow-sm hover:bg-indigo-700 active:bg-indigo-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={!selectedBook || (selectedChapter === selectedBook.chapters && books.findIndex(b => b.abrev === selectedBook?.abrev) === books.length - 1)}
              >
                Siguiente
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
