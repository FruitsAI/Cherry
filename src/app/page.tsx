import { Suspense } from 'react';
import { ClientApp } from '../components/ClientApp';
import { getInitialData } from './actions';
import { CherryData } from '../types';

function SearchFallback() {
    return (
        <div className="flex h-screen items-center justify-center bg-black text-[#00ff00] font-mono">
            INITIALIZING SYSTEM...
        </div>
    );
}

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string; branch?: string }> }) {
  const resolvedParams = await searchParams;
  const data = await getInitialData(resolvedParams);
  return (
    <Suspense fallback={<SearchFallback />}>
        <ClientApp initialData={data as unknown as CherryData} />
    </Suspense>
  );
}
