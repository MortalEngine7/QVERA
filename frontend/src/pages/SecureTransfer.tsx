import { useState } from 'react';
import { Upload, FileText, ShieldCheck, Lock, CheckCircle2, ShieldAlert } from 'lucide-react';
import { apiClient } from '../api';
import { useAppContext } from '../App';

function TransferRoute({ phase, eveEnabled }: { phase: string; eveEnabled: boolean }) {
    return (
        <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-textMuted uppercase tracking-widest">Quantum Channel Route</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${phase === 'FAILED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    phase === 'VERIFIED' ? 'bg-accent/10 text-accent border border-accent/20' :
                        phase !== 'IDLE' ? 'bg-primary/10 text-primary border border-primary/25 animate-pulse' :
                            'bg-white/5 text-textMuted'
                    }`}>
                    {phase}
                </span>
            </div>
            <div className="flex items-center justify-between relative py-4">
                <div className="absolute left-1/4 right-1/4 top-1/2 -translate-y-1/2 h-0.5 bg-white/10 z-0"></div>
                <div className="flex flex-col items-center z-10">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center text-primary font-bold shadow-lg justify-center">A</div>
                    <span className="text-xs text-white font-medium mt-2">Alice</span>
                </div>
                {eveEnabled && (
                    <div className="flex flex-col items-center z-10 animate-bounce">
                        <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center text-red-400 font-bold shadow-lg justify-center">
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                        <span className="text-xs text-red-400 font-medium mt-2">Eve (Eavesdropper)</span>
                    </div>
                )}
                <div className="flex flex-col items-center z-10">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/40 flex items-center text-accent font-bold shadow-lg justify-center">B</div>
                    <span className="text-xs text-white font-medium mt-2">Bob</span>
                </div>
            </div>
        </div>
    );
}

function TransferLifecycle({ phase, sessionInfo }: { phase: string; sessionInfo: any }) {
    const steps = [
        { id: 'BB84', label: 'BB84 Quantum Key Distribution', desc: sessionInfo ? `${sessionInfo.qber_stats?.sifted_bits || 0} sifted bits, QBER: ${(sessionInfo.qber_stats?.qber * 100 || 0).toFixed(2)}%` : 'Key generation & QBER analysis' },
        { id: 'ENCRYPTING', label: 'AES-256-GCM Encryption', desc: 'Payload secured with derived quantum key' },
        { id: 'TRANSFERRING', label: 'Secure Transmission', desc: 'Encrypted ciphertext transmitted over network' },
        { id: 'DECRYPTING', label: 'Decryption & Integrity Check', desc: 'Authentication tag verified at destination' },
        { id: 'VERIFIED', label: 'Transfer Complete', desc: 'File successfully received and verified' }
    ];

    const currentIdx = steps.findIndex(s => s.id === phase);

    return (
        <div className="space-y-6">
            <h4 className="text-xs font-semibold text-textMuted uppercase tracking-widest">Transfer Lifecycle</h4>
            <div className="space-y-4 relative before:absolute before:inset-y-2 before:left-3.5 before:w-0.5 before:bg-white/10">
                {steps.map((step, idx) => {
                    const isPassed = currentIdx > idx || phase === 'VERIFIED';
                    const isCurrent = step.id === phase;
                    const isFailed = phase === 'FAILED' && isCurrent;

                    return (
                        <div key={step.id} className="flex items-start gap-4 relative">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-colors ${isPassed ? 'bg-accent text-white' :
                                isCurrent ? (isFailed ? 'bg-red-500 text-white animate-pulse' : 'bg-primary text-white animate-pulse') :
                                    'bg-surface border border-white/10 text-textMuted'
                                }`}>
                                {isPassed ? '✓' : idx + 1}
                            </div>
                            <div className="flex-1 pt-1">
                                <p className={`text-sm font-medium ${isCurrent || isPassed ? 'text-white' : 'text-textMuted'}`}>{step.label}</p>
                                <p className="text-xs text-textMuted mt-0.5">{step.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function ResultCards({ phase, sessionInfo, transferInfo, decryptionResult }: { phase: string; sessionInfo: any; transferInfo: any; decryptionResult: any }) {
    if (phase === 'IDLE') return null;

    return (
        <div className="space-y-4">
            <h4 className="text-xs font-semibold text-textMuted uppercase tracking-widest">Session & Security Metrics</h4>
            {sessionInfo && sessionInfo.qber_stats && (
                <div className="bg-surface/50 p-4 rounded-xl border border-white/5 space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-textMuted">Raw Bits:</span>
                        <span className="text-white font-mono">{sessionInfo.qber_stats.raw_bits}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-textMuted">Sifted Bits:</span>
                        <span className="text-white font-mono">{sessionInfo.qber_stats.sifted_bits}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-textMuted">QBER:</span>
                        <span className={`font-mono font-bold ${sessionInfo.security_status === 'FAILED' ? 'text-red-400' : 'text-accent'}`}>
                            {(sessionInfo.qber_stats.qber * 100).toFixed(2)}%
                        </span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-textMuted">Security Status:</span>
                        <span className={`font-bold ${sessionInfo.security_status === 'FAILED' ? 'text-red-400' : 'text-accent'}`}>
                            {sessionInfo.security_status}
                        </span>
                    </div>
                </div>
            )}

            {transferInfo && (
                <div className="bg-surface/50 p-4 rounded-xl border border-white/5 space-y-2">
                    <div className="text-xs font-semibold text-textMuted mb-2">Encryption Payload</div>
                    <div className="flex justify-between text-xs">
                        <span className="text-textMuted">Ciphertext Size:</span>
                        <span className="text-white font-mono">{transferInfo.ciphertext_size} bytes</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-textMuted">Algorithm:</span>
                        <span className="text-white font-mono">AES-256-GCM</span>
                    </div>
                </div>
            )}

            {decryptionResult && (
                <div className="bg-surface/50 p-4 rounded-xl border border-white/5 space-y-2">
                    <div className="text-xs font-semibold text-accent mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Integrity Verified
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-textMuted">Original Name:</span>
                        <span className="text-white font-mono truncate max-w-[150px]">{decryptionResult.filename}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function SecureTransfer() {
    const {
        mode, qubits, qberThreshold, eveEnabled, setEveEnabled, phase, setPhase,
        sessionInfo, setSessionInfo, transferInfo, setTransferInfo,
        decryptionResult, setDecryptionResult, addLog, clearLogs,
        file, setFile
    } = useAppContext();
    const destination = 'Bob — Local Simulation Receiver';
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const startSecureTransfer = async () => {
        if (!file || isProcessing) return;
        setIsProcessing(true);
        setUploadError(null);

        try {
            clearLogs();
            if (eveEnabled) {
                addLog({ level: 'WARNING', component: 'EVE', event: 'EVE_SIMULATION_ENABLED', msg: 'Intercept-resend simulation enabled.' });
            }

            setPhase('BB84');
            addLog({ level: 'INFO', component: 'BB84', event: 'SESSION_CREATED', msg: `${qubits} qubits initialized.` });

            // 1. Session & Key Building
            const d = await apiClient.createSession(qubits, qberThreshold, eveEnabled);
            const quantumRes = await apiClient.startBB84(d.session_id);
            setSessionInfo(quantumRes);

            addLog({ level: 'INFO', component: 'BB84', event: 'BB84_COMPLETED', msg: `${qubits} qubits processed.` });

            if (quantumRes.qber_stats) {
                addLog({ level: 'INFO', component: 'RECONCILIATION', event: 'RECONCILIATION_COMPLETED', msg: `${quantumRes.qber_stats.sifted_bits} matching bases retained.` });
                addLog({ level: 'INFO', component: 'QBER', event: 'QBER_CALCULATED', msg: `${quantumRes.qber_stats.error_count} errors / ${quantumRes.qber_stats.compared_bits} compared (QBER: ${(quantumRes.qber_stats.qber * 100).toFixed(2)}%).` });
            }

            if (quantumRes.security_status === 'FAILED') {
                addLog({ level: 'ERROR', component: 'SECURITY', event: 'SECURITY_CHECK_FAILED', msg: 'QBER exceeded configured threshold.' });
                addLog({ level: 'ERROR', component: 'TRANSFER', event: 'TRANSFER_BLOCKED', msg: 'File transfer prevented because the secure session was rejected.' });
                setPhase('FAILED');
                return;
            }

            addLog({ level: 'SUCCESS', component: 'SECURITY', event: 'SECURITY_CHECK_PASSED', msg: 'Observed QBER is below configured threshold.' });
            addLog({ level: 'INFO', component: 'KEY_DERIVATION', event: 'KEY_DERIVATION_COMPLETED', msg: 'Session encryption key derived successfully.' });

            // 2. Encryption
            setPhase('ENCRYPTING');
            const transferRes = await apiClient.encryptFile(d.session_id, file);
            setTransferInfo(transferRes);
            addLog({ level: 'INFO', component: 'ENCRYPTION', event: 'FILE_ENCRYPTED', msg: 'File encrypted using AES-256-GCM.' });

            // 3. Transfer Simulation
            setPhase('TRANSFERRING');
            await new Promise(r => setTimeout(r, 1500));
            addLog({ level: 'INFO', component: 'TRANSFER', event: 'TRANSFER_COMPLETED', msg: 'Encrypted payload delivered to Bob.' });

            // 4. Decryption & Integrity Check
            setPhase('DECRYPTING');
            const decRes = await apiClient.decryptFile(d.session_id, transferRes.transfer_id);
            setDecryptionResult(decRes);
            setPhase('VERIFIED');
            addLog({ level: 'SUCCESS', component: 'VERIFICATION', event: 'INTEGRITY_VERIFIED', msg: 'Received file authenticated successfully.' });
        } catch (error: any) {
            console.error("Transfer error pipeline:", error);
            const errDetail = error?.response?.data?.detail || error.message || "Unknown error occurred";
            setUploadError(errDetail);
            addLog({ component: 'SECURITY', level: 'ERROR', event: 'ERROR', msg: errDetail });
            setPhase('FAILED');
        } finally {
            setIsProcessing(false);
        }
    };

    const isConfigurable = phase === 'IDLE' || phase === 'FAILED';

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-16">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-wide">Secure File Transfer</h1>
                <p className="text-textMuted mt-2">Protect, transfer and visually verify your file payload through QVERA.</p>
            </header>

            {/* Primary Workspace Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Source & Config (Left Column) */}
                <div className="lg:col-span-1 space-y-6 flex flex-col">
                    {/* Source Box */}
                    <div className="glass-panel p-6">
                        <h3 className="text-sm font-semibold text-textMuted mb-4 uppercase tracking-widest">Source</h3>
                        <div className="flex items-center gap-3 mb-6 bg-surface/50 p-3 rounded-lg border border-white/5">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">A</div>
                            <div>
                                <p className="text-white text-sm font-medium">Alice</p>
                                <p className="text-xs text-textMuted">Local Source</p>
                            </div>
                        </div>

                        {/* File Picker */}
                        {!file ? (
                            <label className="border-2 border-dashed border-white/10 hover:border-primary/50 text-center rounded-xl p-8 cursor-pointer flex flex-col items-center gap-3 transition-colors">
                                <Upload className="w-8 h-8 text-primary/70" />
                                <span className="text-sm text-textMuted font-medium">Select Secure Payload</span>
                                <input type="file" className="hidden" onChange={e => {
                                    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
                                }} />
                            </label>
                        ) : (
                            <div className="bg-surface/50 p-4 rounded-xl border border-white/5 relative group">
                                <FileText className="w-6 h-6 text-primary mb-2" />
                                <p className="text-white font-medium truncate pr-6">{file.name}</p>
                                <p className="text-xs text-textMuted">{(file.size / 1024).toFixed(1)} KB</p>
                                {isConfigurable && (
                                    <button onClick={() => setFile(null)} className="absolute top-4 right-4 text-xs font-semibold text-red-400 hover:text-red-300">Clear</button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Destination Box */}
                    <div className="glass-panel p-6 flex-1">
                        <h3 className="text-sm font-semibold text-textMuted mb-4 uppercase tracking-widest">Destination</h3>

                        <div className="space-y-4">
                            <label className="flex items-center gap-4 p-4 rounded-xl border bg-accent/5 border-accent/20 cursor-pointer">
                                <input type="radio" checked={destination === 'Bob — Local Simulation Receiver'} readOnly className="accent-accent" />
                                <div className="flex-1">
                                    <p className="text-white text-sm font-medium">Bob — Local Simulation Receiver</p>
                                    <p className="text-xs text-textMuted mt-1 w-full flex items-center gap-2"><Lock className="w-3 h-3 text-accent" /> Simulated Backend Storage Location</p>
                                </div>
                            </label>
                        </div>

                        {mode === 'TECHNICAL' && isConfigurable && (
                            <div className="mt-8 pt-6 border-t border-white/5">
                                <h4 className="text-xs font-semibold text-textMuted mb-3 uppercase tracking-wider text-red-400">Eve Simulation (Tech Demo)</h4>
                                <label className="flex items-center gap-3">
                                    <input type="checkbox" checked={eveEnabled} onChange={e => setEveEnabled(e.target.checked)} className="accent-red-500 w-4 h-4 rounded" />
                                    <span className="text-sm text-white">Enable Eve Intercept-Resend</span>
                                </label>
                            </div>
                        )}

                        <button
                            disabled={!isConfigurable || !file || isProcessing}
                            onClick={startSecureTransfer}
                            className={`w-full mt-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 hover:-translate-y-0.5 transition-all outline-none ${isProcessing
                                ? "bg-primary/50 text-white/50 cursor-not-allowed shadow-none"
                                : "bg-gradient-to-r from-primary to-accent text-white glow-effect hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                                }`}
                        >
                            {isProcessing ? 'Securing File...' : 'SECURE & SEND'}
                        </button>
                    </div>
                </div>

                {/* Transfer Route & Results (Middle/Right) */}
                <div className="lg:col-span-2 space-y-6">
                    <TransferRoute phase={phase} eveEnabled={eveEnabled} />

                    <div className="glass-panel p-6 h-[400px] overflow-y-auto w-full relative">
                        {phase === 'IDLE' ? (
                            <div className="h-full flex flex-col items-center justify-center text-textMuted">
                                <ShieldCheck className="w-12 h-12 opacity-20 mb-4" />
                                <p>Awaiting transfer payload...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                                {/* Timeline Tracker */}
                                <div className="relative">
                                    <TransferLifecycle phase={phase} sessionInfo={sessionInfo} />
                                </div>

                                {/* Detailed Results (only shows gracefully once generated) */}
                                <div className="space-y-6">
                                    <ResultCards
                                        phase={phase}
                                        sessionInfo={sessionInfo}
                                        transferInfo={transferInfo}
                                        decryptionResult={decryptionResult}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* End State Final Notice Card */}
            {phase === 'VERIFIED' && (
                <div className="glass-panel p-8 text-center bg-gradient-to-t from-accent/10 to-transparent border-accent/20 animate-in slide-in-from-bottom-8">
                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent/30 glow-effect">
                        <CheckCircle2 className="w-8 h-8 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Secure Transfer Complete</h2>
                    <p className="text-textMuted mb-8 max-w-xl mx-auto">
                        Your file was computationally secured, transmitted via AES-256-GCM, and mathematically verified for authentic integrity at the destination backend.
                    </p>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => {
                                setPhase('IDLE');
                                setFile(null);
                            }}
                            className="px-6 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-sm font-medium transition-colors"
                        >
                            Start New Transfer
                        </button>
                    </div>
                </div>
            )}

            {phase === 'FAILED' && (
                <div className="glass-panel p-8 text-center bg-gradient-to-t from-red-500/10 to-transparent border-red-500/20 animate-in slide-in-from-bottom-8">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                        <ShieldAlert className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="font-semibold text-lg text-white mb-2">Transfer Error Detected</h3>
                    <p className="text-sm text-textMuted leading-relaxed mb-6">
                        {uploadError || "We detected an unusually high level of disturbance during the secure communication check. Your file was not transferred."}
                        <br /><br />
                        The current secure session has been rejected for your protection.
                    </p>
                    <button
                        onClick={() => {
                            setPhase('IDLE');
                            setFile(null);
                        }}
                        className="px-6 py-2.5 rounded-lg border border-red-500/30 hover:bg-red-500/10 text-red-400 text-sm font-medium transition-colors"
                    >
                        Try Again Safely
                    </button>
                </div>
            )}
        </div>
    );
}
