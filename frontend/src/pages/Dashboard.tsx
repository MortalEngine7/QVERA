import { useState, useEffect } from 'react';
import { apiClient } from '../api';
import { Shield, CheckCircle2, FileX2, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../App';

export default function Dashboard() {
    const [stats, setStats] = useState({
        total: 0,
        successful: 0,
        blocked: 0,
        checks: 0
    });

    const [recentTransfers, setRecentTransfers] = useState<any[]>([]);

    useEffect(() => {
        apiClient.getStats().then(setStats).catch(console.error);
        apiClient.getHistory().then(res => setRecentTransfers(res.slice(0, 5))).catch(console.error);
    }, []);

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-wide">Security Dashboard</h1>
                <p className="text-textMuted mt-2">Monitor secure transfers, security checks, and verification status.</p>
            </header>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard title="Total Transfers" value={stats.total} icon={Shield} color="primary" />
                <StatCard title="Successful Transfers" value={stats.successful} icon={CheckCircle2} color="accent" />
                <StatCard title="Blocked Transfers" value={stats.blocked} icon={FileX2} color="red" />
                <StatCard title="Security Checks" value={stats.checks} icon={CheckSquare} color="primary" />
            </div>

            {/* Recent Transfers Table */}
            <div className="glass-panel p-6">
                <h2 className="text-lg font-semibold text-white mb-6">Recent Transfers</h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-textMuted">
                                <th className="pb-3 px-2 font-medium">File Name</th>
                                <th className="pb-3 px-2 font-medium">Source</th>
                                <th className="pb-3 px-2 font-medium">Destination</th>
                                <th className="pb-3 px-2 font-medium">Security Status</th>
                                <th className="pb-3 px-2 font-medium">QBER</th>
                                <th className="pb-3 px-2 font-medium">Encryption</th>
                                <th className="pb-3 px-2 font-medium">Transfer</th>
                                <th className="pb-3 px-2 font-medium">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {recentTransfers.map((tx, i) => (
                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-4 px-2 font-medium text-white max-w-[200px] truncate">{tx.name}</td>
                                    <td className="py-4 px-2 text-textMuted">{tx.source}</td>
                                    <td className="py-4 px-2 text-textMuted">{tx.dest}</td>
                                    <td className="py-4 px-2">
                                        <span className={cn("px-2 py-1 rounded-md text-xs font-semibold whitespace-nowrap", tx.status === 'VERIFIED' ? "bg-accent/10 text-accent border border-accent/20" : "bg-red-500/10 text-red-500 border border-red-500/20")}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-2 font-mono text-textMuted">{tx.qber}%</td>
                                    <td className="py-4 px-2 text-textMuted">{tx.enc}</td>
                                    <td className="py-4 px-2 text-textMuted">{tx.status === 'VERIFIED' ? 'Transferred' : 'Blocked'}</td>
                                    <td className="py-4 px-2 text-textMuted text-[11px] whitespace-nowrap">{tx.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex justify-center">
                    <Link to="/history" className="text-primary hover:text-primary/80 text-sm font-semibold transition-colors">View All History →</Link>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, icon: Icon, color }: any) {
    const cMap: Record<string, string> = {
        primary: 'text-primary bg-primary/10 border-primary/20',
        accent: 'text-accent bg-accent/10 border-accent/20',
        red: 'text-red-500 bg-red-500/10 border-red-500/20',
    }
    return (
        <div className="glass-panel p-6 flex flex-col relative overflow-hidden group">
            <div className={cn("absolute right-0 top-0 w-24 h-24 blur-3xl opacity-20 transition-opacity group-hover:opacity-40",
                color === 'primary' ? 'bg-primary' : color === 'accent' ? 'bg-accent' : 'bg-red-500'
            )} />

            <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", cMap[color])}>
                    <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-medium text-textMuted">{title}</h3>
            </div>
            <p className="text-3xl font-bold text-white relative z-10">{value}</p>
        </div>
    )
}
