import { useState, useEffect } from 'react';
import { apiClient } from '../api';
import { Download, Search, Filter, ShieldCheck, ShieldAlert } from 'lucide-react';
import { cn } from '../App';

export default function History() {
    const [searchTerm, setSearchTerm] = useState('');

    const [historyData, setHistoryData] = useState<any[]>([]);

    useEffect(() => {
        apiClient.getHistory().then(setHistoryData).catch(console.error);
    }, []);

    const filtered = historyData.filter(h => h.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-16">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-wide">Transfer History</h1>
                    <p className="text-textMuted mt-2">Immutable log of all quantum-secured file transmission attempts.</p>
                </div>
                <div className="flex items-center gap-3 bg-surface/50 p-2 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-lg text-textMuted border border-white/5">
                        <Search className="w-4 h-4" />
                        <input type="text" placeholder="Search payloads..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none text-sm w-48 text-white placeholder:text-textMuted/50" />
                    </div>
                    <button className="p-2 hover:bg-white/5 rounded-lg text-textMuted transition-colors">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <div className="glass-panel overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider text-textMuted font-semibold">
                            <th className="py-4 px-6">ID</th>
                            <th className="py-4 px-6">Payload Detail</th>
                            <th className="py-4 px-6">Timestamp</th>
                            <th className="py-4 px-6">QBER Check</th>
                            <th className="py-4 px-6">Final Status</th>
                            <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {filtered.map((tx) => (
                            <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                <td className="py-4 px-6 font-mono text-textMuted">{tx.id}</td>
                                <td className="py-4 px-6 text-textMuted">
                                    <p className="font-semibold text-white">{tx.name}</p>
                                    <p className="text-xs text-textMuted mt-0.5">{(tx.size / 1024 / 1024).toFixed(2)} MB</p>
                                </td>
                                <td className="py-4 px-6 font-mono text-textMuted/80 text-xs">{tx.date}</td>
                                <td className="py-4 px-6">
                                    <span className={cn("font-mono font-medium", tx.qber >= 10 ? "text-red-400" : "text-textMuted")}>
                                        {tx.qber}%
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <div className={cn(
                                        "inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-bold border",
                                        tx.status === 'VERIFIED' ? "bg-accent/10 text-accent border-accent/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                                    )}>
                                        {tx.status === 'VERIFIED' ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                                        {tx.status}
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    {tx.status === 'VERIFIED' && (
                                        <button className="p-2 text-textMuted hover:text-white hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-textMuted">
                                    No records match your search criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
