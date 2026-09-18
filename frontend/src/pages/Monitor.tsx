import { Activity, ShieldCheck, ShieldAlert, Network, Share2, Binary } from 'lucide-react';
import { cn, useAppContext } from '../App';

export default function SecurityMonitor() {
    const { phase, sessionInfo, transferInfo, decryptionResult, logs, qubits, qberThreshold, eveEnabled } = useAppContext();
    const qberActual = sessionInfo?.qber_stats?.qber
        ? (sessionInfo.qber_stats.qber * 100).toFixed(2) + '%'
        : (phase === 'BB84' ? 'Calculating...' : '0.00%');

    const decision = phase === 'FAILED' ? 'REJECTED' :
        (phase === 'IDLE' || phase === 'BB84' || phase === 'SECURITY_CHECK') ? 'PENDING' : 'PASSED';

    const formatPhaseMap: Record<string, string> = {
        IDLE: 'IDLE',
        BB84: 'ACTIVE',
        SECURITY_CHECK: 'ACTIVE',
        ENCRYPTING: 'ACTIVE',
        TRANSFERRING: 'ACTIVE',
        DECRYPTING: 'ACTIVE',
        VERIFIED: 'COMPLETED',
        FAILED: 'BLOCKED'
    };

    const getPipelineStatus = (step: string) => {
        // Very simple phase ordering for UI mapping
        const order = ['IDLE', 'BB84', 'SECURITY_CHECK', 'ENCRYPTING', 'TRANSFERRING', 'DECRYPTING', 'VERIFIED', 'FAILED'];
        if (phase === 'FAILED') {
            if (step === 'BB84' || step === 'SECURITY_CHECK') return 'DONE';
            return 'FAILED'; // The rest are blocked/failed
        }
        const currentIndex = order.indexOf(phase);
        const stepMapping: Record<string, number> = {
            'BB84': 1, 'SECURITY_CHECK': 2, 'ENCRYPTING': 3, 'TRANSFERRING': 4, 'DECRYPTING': 5, 'VERIFIED': 6
        };

        const stepIdx = stepMapping[step];
        if (currentIndex > stepIdx || currentIndex === 6) return 'DONE';
        if (currentIndex === stepIdx) return 'ACTIVE';
        return 'PENDING';
    };

    const pbItem = (statusText: string, metric?: string, type: 'DONE' | 'ACTIVE' | 'PENDING' | 'FAILED' = 'PENDING') => {
        return (
            <div className="flex items-center gap-4 py-3 border-l-2 pl-4 ml-2 transition-colors relative"
                style={{ borderLeftColor: type === 'DONE' ? '#22c55e' : type === 'ACTIVE' ? '#8b5cf6' : type === 'FAILED' ? '#ef4444' : '#333' }}>
                <div className={cn(
                    "absolute -left-[9px] w-4 h-4 rounded-full border-2",
                    type === 'DONE' ? "bg-green-500 border-green-500" : type === 'ACTIVE' ? "bg-primary border-primary animate-pulse" : type === 'FAILED' ? "bg-red-500 border-red-500" : "bg-black border-white/20"
                )} />
                <div>
                    <h4 className={cn("text-sm font-bold uppercase", type === 'DONE' ? 'text-white' : type === 'ACTIVE' ? 'text-primary' : type === 'FAILED' ? 'text-red-400' : 'text-textMuted')}>{statusText}</h4>
                    {metric && <p className="text-xs text-textMuted mt-0.5">{metric}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-16 h-full flex flex-col space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-wide">Security Monitor</h1>
                    <p className="text-textMuted mt-2">Live security telemetry from the current QVERA simulation.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-surface/80 rounded-xl border border-white/5">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", phase !== 'IDLE' && phase !== 'FAILED' && phase !== 'VERIFIED' ? "bg-accent" : "hidden")}></span>
                        <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5 border-[2px] border-black",
                            phase === 'FAILED' ? 'bg-red-500' : phase === 'VERIFIED' ? 'bg-green-500' : phase === 'IDLE' ? 'bg-white/20' : 'bg-accent'
                        )}></span>
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-white select-none">
                        {phase === 'IDLE' ? 'Standing By' : 'Live Stream'}
                    </span>
                </div>
            </header>

            {/* TOP STATUS CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-panel p-5">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-textMuted mb-2">Session Status</p>
                    <div className="flex items-center justify-between">
                        <p className={cn("text-xl font-black uppercase",
                            phase === 'FAILED' ? 'text-red-500' : phase === 'VERIFIED' ? 'text-green-500' : phase === 'IDLE' ? 'text-white' : 'text-primary'
                        )}>{formatPhaseMap[phase]}</p>
                        <Activity className="w-5 h-5 text-white/20" />
                    </div>
                </div>
                <div className="glass-panel p-5">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-textMuted mb-2">Current QBER</p>
                    <div className="flex items-center justify-between">
                        <p className="text-xl font-black text-white">{qberActual}</p>
                        <Network className="w-5 h-5 text-white/20" />
                    </div>
                </div>
                <div className="glass-panel p-5">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-textMuted mb-2">Security Threshold</p>
                    <div className="flex items-center justify-between">
                        <p className="text-xl font-black text-white">{(qberThreshold * 100).toFixed(0)}%</p>
                        <ShieldCheck className="w-5 h-5 text-white/20" />
                    </div>
                </div>
                <div className="glass-panel p-5">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-textMuted mb-2">Security Decision</p>
                    <div className="flex items-center justify-between">
                        <p className={cn("text-lg font-black uppercase leading-tight",
                            decision === 'PASSED' ? 'text-green-400' : decision === 'REJECTED' ? 'text-red-500' : 'text-white/50'
                        )}>{decision === 'PENDING' ? 'EVALUATING' : `CHECK ${decision}`}</p>
                        {decision === 'REJECTED' ? <ShieldAlert className="w-5 h-5 text-red-500" /> : <ShieldCheck className="w-5 h-5 text-green-500 opacity-50" />}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
                {/* CURRENT SECURE SESSION & SECURITY PIPELINE */}
                <div className="lg:col-span-1 flex flex-col gap-8">
                    <div className="glass-panel p-6">
                        <h2 className="text-xs font-bold text-textMuted tracking-widest uppercase mb-6 flex items-center justify-between">
                            Current Secure Session
                            <Binary className="w-4 h-4" />
                        </h2>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-textMuted">Session ID</span>
                                <span className="font-mono text-white max-w-[150px] truncate" title={sessionInfo?.session_id || 'N/A'}>{sessionInfo?.session_id || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-textMuted">Source</span>
                                <span className="text-white text-right">Alice — Local Source</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-textMuted">Destination</span>
                                <span className="text-white text-right">Bob — Local Receiver</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-textMuted">Simulation Qubits</span>
                                <span className="font-mono text-white">{qubits}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-textMuted">Sifted Bits</span>
                                <span className="font-mono text-white">{sessionInfo?.qber_stats?.sifted_bits ?? '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-textMuted">Errors Detected</span>
                                <span className="font-mono text-white">{sessionInfo?.qber_stats?.error_count ?? '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-textMuted">Threshold</span>
                                <span className="font-mono text-white">{(qberThreshold * 100).toFixed(0)}%</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-textMuted">Eve Status</span>
                                <span className={cn("font-bold text-right", eveEnabled ? 'text-red-400' : 'text-white')}>{eveEnabled ? 'Enabled' : 'Disabled'}</span>
                            </div>
                            <div className="flex justify-between pb-2">
                                <span className="text-textMuted">Security Check</span>
                                <span className={cn("font-bold uppercase",
                                    decision === 'PASSED' ? 'text-green-400' : decision === 'REJECTED' ? 'text-red-500' : 'text-white'
                                )}>{decision}</span>
                            </div>
                        </div>
                    </div>

                    {phase !== 'IDLE' && (
                        <div className="glass-panel p-6 flex-1 max-h-[500px] overflow-y-auto scrollbar-thin">
                            <h2 className="text-xs font-bold text-textMuted tracking-widest uppercase mb-6 flex items-center justify-between">
                                Security Pipeline
                                <Share2 className="w-4 h-4" />
                            </h2>
                            <div className="ml-1">
                                {pbItem('BB84 Simulation', `${qubits} qubits instantiated`, getPipelineStatus('BB84'))}
                                {pbItem('Basis Reconciliation', sessionInfo?.qber_stats?.sifted_bits ? `${sessionInfo.qber_stats.sifted_bits} sifted bases matched` : 'Pending measurement', getPipelineStatus('SECURITY_CHECK'))}
                                {pbItem('QBER Analysis', sessionInfo?.qber_stats ? `${qberActual} QBER calculated` : '', getPipelineStatus('SECURITY_CHECK'))}
                                {pbItem('Security Decision', decision === 'REJECTED' ? 'Threshold exceeded' : decision === 'PASSED' ? 'Threshold passed' : 'Evaluating limits', phase === 'FAILED' ? 'FAILED' : decision === 'PASSED' ? 'DONE' : 'PENDING')}
                                {pbItem('Session Key Derivation', decision === 'PASSED' ? 'AES-256 key formulated' : '', getPipelineStatus('ENCRYPTING'))}
                                {pbItem('AES-256-GCM', transferInfo ? 'Payload ciphertext computed' : '', getPipelineStatus('ENCRYPTING'))}
                                {pbItem('Target Transfer', transferInfo ? 'Payload sent to target' : '', getPipelineStatus('TRANSFERRING'))}
                                {pbItem('Decryption Phase', decryptionResult ? 'Data recovered' : '', getPipelineStatus('DECRYPTING'))}
                                {pbItem('Integrity Verification', phase === 'VERIFIED' ? 'Authentication GCM tag verified' : '', getPipelineStatus('VERIFIED'))}
                            </div>
                        </div>
                    )}
                </div>

                {/* SECURITY EVENT TIMELINE (Right Column) */}
                <div className="lg:col-span-2 glass-panel flex flex-col bg-black/40 border-white/5 overflow-hidden">
                    <div className="bg-surface/80 p-5 border-b border-white/10 flex items-center justify-between">
                        <h2 className="text-xs font-bold text-textMuted tracking-widest uppercase">Security Event Timeline</h2>
                        <p className="text-[10px] font-mono text-textMuted bg-background px-2 py-1 rounded">SYS_LOGS_{logs.length}</p>
                    </div>

                    <div className="p-5 flex-1 overflow-y-auto font-mono text-[13px] space-y-2 h-[800px] scrollbar-thin pb-10">
                        {logs.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-white/20">
                                <span className="mb-2">Awaiting Transfer Events...</span>
                            </div>
                        ) : (
                            logs.map((log, i) => (
                                <div key={i} className="flex gap-4 group p-2 rounded hover:bg-white/5 transition-colors">
                                    <span className="text-textMuted/50 shrink-0 select-none">[{log.time}]</span>
                                    <span className={cn(
                                        "shrink-0 font-bold w-[75px]",
                                        log.level === 'INFO' ? "text-blue-400" :
                                            log.level === 'SUCCESS' ? "text-green-400" :
                                                log.level === 'WARNING' ? "text-yellow-400" :
                                                    "text-red-500"
                                    )}>
                                        {log.level}
                                    </span>
                                    <span className="text-purple-400 shrink-0 w-[140px] truncate">{log.component}</span>
                                    <div className="flex-1">
                                        <p className={cn(log.level === 'ERROR' || log.level === 'CRITICAL' ? "text-red-400 font-bold" : "text-gray-300 font-semibold")}>{log.event}</p>
                                        <p className="text-textMuted/80 mt-1">{log.msg}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
