export default function Loading() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-zinc-800 border-t-aurora-red rounded-full animate-spin" />
                <p className="text-zinc-500 font-mono text-sm tracking-widest animate-pulse">
                    INITIALIZING_SENSORS
                </p>
            </div>
        </div>
    );
}
