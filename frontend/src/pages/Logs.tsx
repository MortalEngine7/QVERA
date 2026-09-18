import { useState } from 'react';
import { TerminalSquare, Filter, Search, X, Activity } from 'lucide-react';
import { cn, useAppContext, LogEntry } from '../App';

export default function Logs() {
    const { logs, sessionInfo } = useAppContext();

    const [severityFilter, setSeverityFilter] = useState<string>('All');
    const [componentFilter, setComponentFilter] = useState<string>('All');
    const [sessionFilter, setSessionFilter] = useState<string>('Current Session');

    const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

    const filteredLogs = logs.filter(log => {
        if (severityFilter !== 'All' && log.level !== severityFilter) return false;
        if (componentFilter !== 'All' && log.component !== componentFilter) return false;
        // Since we only track current session logs in state, 'All Sessions' just shows what we have for now.
        return true;
    });

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-16 h-full flex flex-col">
            <header className="mb-6 flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <TerminalSquare className="w-8 h-8 text-primary" />
                        <h1 className="text-3xl font-bold text-white tracking-wide">Technical Logs</h1>
                    </div>
                    <p className="text-textMuted mt-2">Detailed execution and security events from QVERA.</p>
                </div>
            </header>

            {/* Logic Filter Bar */}
            <div className="glass-panel p-4 mb-6 flex flex-wrap items-center gap-4 border-l-4 border-l-accent">
                <div className="flex items-center gap-2 bg-surface p-2 rounded-lg border border-white/5 flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 text-textMuted" />
                    <input type="text" placeholder="Search event descriptions..." className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-textMuted/50" />
                </div>

                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-textMuted" />
                    <span className="text-sm font-semibold text-textMuted uppercase">Severity:</span>
                    <select
                        value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}
                        className="bg-surface border border-white/10 text-sm text-white rounded-md p-1.5 outline-none focus:border-primary"
                    >
                        <option value="All">All Severity</option>
                        <option value="INFO">INFO</option>
                        <option value="SUCCESS">SUCCESS</option>
                        <option value="WARNING">WARNING</option>
                        <option value="ERROR">ERROR</option>
                        <option value="CRITICAL">CRITICAL</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-textMuted uppercase">Component:</span>
                    <select
                        value={componentFilter} onChange={e => setComponentFilter(e.target.value)}
                        className="bg-surface border border-white/10 text-sm text-white rounded-md p-1.5 outline-none focus:border-primary"
                    >
                        <option value="All">All Components</option>
                        <option value="BB84">BB84</option>
                        <option value="RECONCILIATION">RECONCILIATION</option>
                        <option value="QBER">QBER</option>
                        <option value="SECURITY">SECURITY</option>
                        <option value="KEY_DERIVATION">KEY_DERIVATION</option>
                        <option value="ENCRYPTION">ENCRYPTION</option>
                        <option value="TRANSFER">TRANSFER</option>
                        <option value="VERIFICATION">VERIFICATION</option>
                        <option value="EVE">EVE</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-textMuted uppercase">Session:</span>
                    <select
                        value={sessionFilter} onChange={e => setSessionFilter(e.target.value)}
                        className="bg-surface border border-white/10 text-sm text-white rounded-md p-1.5 outline-none focus:border-primary"
                    >
                        <option value="Current Session">Current Session</option>
                        <option value="All Sessions">All Sessions</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-1 gap-6 min-h-0 relative">
                {/* Main Table */}
                <div className={cn("glass-panel flex-1 flex flex-col min-h-0 transition-all duration-300", selectedLog ? "lg:w-2/3" : "w-full")}>
                    <div className="flex-1 overflow-auto rounded-xl">
                        <table className="w-full text-left border-collapse relative">
                            <thead className="sticky top-0 bg-surface/95 backdrop-blur z-20">
                                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-textMuted font-semibold bg-black/20">
                                    <th className="py-4 px-6">Time</th>
                                    <th className="py-4 px-6">Severity</th>
                                    <th className="py-4 px-6">Component</th>
                                    <th className="py-4 px-6">Event</th>
                                    <th className="py-4 px-6">Description</th>
                                    <th className="py-4 px-6 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="font-mono text-[13px]">
                                {filteredLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-textMuted">No logs match your filter.</td>
                                    </tr>
                                ) : (
                                    filteredLogs.map((log, i) => (
                                        <tr
                                            key={i}
                                            onClick={() => setSelectedLog(log)}
                                            className={cn(
                                                "border-b border-white/5 transition-colors cursor-pointer group",
                                                selectedLog === log ? "bg-white/10" : "hover:bg-white/5"
                                            )}
                                        >
                                            <td className="py-3 px-6 text-textMuted/50">{log.time}</td>
                                            <td className={cn(
                                                "py-3 px-6 font-bold",
                                                log.level === 'INFO' ? "text-blue-400" :
                                                    log.level === 'SUCCESS' ? "text-green-400" :
                                                        log.level === 'WARNING' ? "text-yellow-400" :
                                                            "text-red-500"
                                            )}>{log.level}</td>
                                            <td className="py-3 px-6 text-purple-400">{log.component}</td>
                                            <td className={cn("py-3 px-6 font-semibold", log.level === 'ERROR' || log.level === 'CRITICAL' ? "text-red-400" : "text-gray-300")}>{log.event}</td>
                                            <td className="py-3 px-6 text-textMuted truncate max-w-[200px]">{log.msg}</td>
                                            <td className="py-3 px-6 text-center text-green-400">✓</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Details Drawer */}
                {selectedLog && (
                    <div className="w-[400px] shrink-0 glass-panel border-l border-white/10 p-6 flex flex-col relative animate-in slide-in-from-right-10 duration-300 h-full overflow-y-auto">
                        <button onClick={() => setSelectedLog(null)} className="absolute top-4 right-4 p-2 text-textMuted hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-sm font-bold text-textMuted tracking-widest uppercase mb-6 flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Event Details
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <p className="text-xs font-semibold text-textMuted uppercase mb-1">Event</p>
                                <p className="text-lg font-mono font-bold text-white tracking-wide">{selectedLog.event}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-textMuted uppercase mb-1">Severity</p>
                                <div className={cn(
                                    "inline-block px-3 py-1 font-bold text-sm rounded border",
                                    selectedLog.level === 'INFO' ? "text-blue-400 border-blue-400/20 bg-blue-400/10" :
                                        selectedLog.level === 'SUCCESS' ? "text-green-400 border-green-400/20 bg-green-400/10" :
                                            selectedLog.level === 'WARNING' ? "text-yellow-400 border-yellow-400/20 bg-yellow-400/10" :
                                                "text-red-500 border-red-500/20 bg-red-500/10"
                                )}>{selectedLog.level}</div>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-textMuted uppercase mb-1">Timestamp</p>
                                <p className="font-mono text-white/90">{selectedLog.time}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-textMuted uppercase mb-1">Session</p>
                                <p className="font-mono text-white/90 break-all">{sessionInfo?.session_id || 'Global Environment'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-textMuted uppercase mb-1">Component</p>
                                <p className="font-mono text-purple-400">{selectedLog.component}</p>
                            </div>
                            <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                                <p className="text-xs font-semibold text-textMuted uppercase mb-2">Message Payload</p>
                                <p className="text-sm text-gray-300 leading-relaxed break-words">{selectedLog.msg}</p>
                            </div>

                            {selectedLog.component === 'QBER' && sessionInfo?.qber_stats && (
                                <div className="bg-surface/50 border border-white/10 rounded-xl p-4 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-textMuted">Compared Bits</span>
                                        <span className="font-mono text-white">{sessionInfo.qber_stats.compared_bits}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-textMuted">Errors</span>
                                        <span className="font-mono text-white">{sessionInfo.qber_stats.error_count}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold border-t border-white/10 pt-2">
                                        <span className="text-primary">QBER</span>
                                        <span className="font-mono text-white">{(sessionInfo.qber_stats.qber * 100).toFixed(2)}%</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
