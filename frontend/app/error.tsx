"use client";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
            <div className="flex flex-col items-center gap-4 text-center px-6">
                <h2 className="text-2xl font-semibold">Something went wrong</h2>
                <p className="text-sm text-slate-400 max-w-md">
                    {error.message || "An unexpected error occurred."}
                </p>
                <button
                    onClick={reset}
                    className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium hover:bg-slate-700 transition-colors"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
