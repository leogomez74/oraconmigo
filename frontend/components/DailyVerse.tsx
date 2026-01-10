'use client';

import { useState, useEffect } from 'react';

interface VerseResponse {
  verse: string;
  study?: string;
  number: number;
  id: number;
}

// Lista de versículos inspiradores para rotar
const POPULAR_VERSES = [
  { book: 'Juan', chapter: 3, verse: 16 },
  { book: 'Salmos', chapter: 23, verse: 1 },
  { book: 'Filipenses', chapter: 4, verse: 13 },
  { book: 'Jeremias', chapter: 29, verse: 11 },
  { book: 'Romanos', chapter: 8, verse: 28 },
  { book: 'Isaias', chapter: 41, verse: 10 },
  { book: 'Salmos', chapter: 46, verse: 1 },
  { book: 'Proverbios', chapter: 3, verse: 5 },
  { book: 'Mateo', chapter: 28, verse: 20 },
  { book: 'Josue', chapter: 1, verse: 9 }
];

export default function DailyVerse() {
  const [verseData, setVerseData] = useState<{ text: string; ref: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // 1. Elegir un versículo aleatorio de la lista
    const randomIndex = Math.floor(Math.random() * POPULAR_VERSES.length);
    const selected = POPULAR_VERSES[randomIndex];

    // 2. Construir la URL
    // Endpoint: https://bible-api.deno.dev/api/read/rv1960/Book/Chapter/Verse
    const url = `https://bible-api.deno.dev/api/read/rv1960/${selected.book}/${selected.chapter}/${selected.verse}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Error en la API');
        return res.json();
      })
      .then((data: VerseResponse) => {
        setVerseData({
          text: data.verse,
          ref: `${selected.book} ${selected.chapter}:${selected.verse}`
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching verse:', err);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-indigo-100 rounded w-3/4"></div>
        <div className="h-4 bg-indigo-100 rounded w-1/2"></div>
      </div>
    );
  }

  if (error || !verseData) {
    return (
      <div className="text-red-500 text-sm">
        No se pudo cargar la palabra del día.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <blockquote className="text-gray-700 italic text-lg leading-relaxed border-l-4 border-indigo-500 pl-4">
        &ldquo;{verseData.text}&rdquo;
      </blockquote>
      <div className="flex justify-end items-center gap-2 text-sm text-gray-500 font-medium">
        <span>{verseData.ref}</span>
        <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
          RVR1960
        </span>
      </div>
    </div>
  );
}
