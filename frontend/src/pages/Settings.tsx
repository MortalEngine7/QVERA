import { useState } from 'react';
import { Settings as SettingsIcon, Shield, Eye, Zap, Lock, HardDrive, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../App';
import { cn } from '../App';

export default function Settings() {
    const { qubits, setQubits, qberThreshold, setQberThreshold, eveEnabled, setEveEnabled, mode, setMode } = useAppContext();
    const [showConfirmReset, setShowConfirmReset] = useState(false);

    const handleReset = () => {
        setQubits(1024);
        setQberThreshold(0.10);
        setEveEnabled(false);
        setMode('NORMAL');
        setShowConfirmReset(false);
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-16 space-y-10">
            <header className="border-b border-white/5 pb-6">
                <div className="flex items-center gap-4 mb-2">
                    <SettingsIcon className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-bold text-white tracking-wide">Settings</h1>
                </div>
                <p className="text-textMuted">Configure your secure transfer experience and simulation environment.</p>
            </header>

            {/* Section 1: Transfer Preferences */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-white tracking-wider uppercase mb-1">Transfer Preferences</h2>
                <p className="text-sm text-textMuted mb-4">Configure how QVERA handles secure file transfers.</p>

                <div className="glass-panel p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-sm font-semibold text-textMuted uppercase mb-3">Source</h3>
                        <div className="bg-surface/50 p-4 rounded-xl border border-white/5 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">A</div>
                            <div>
                                <p className="text-white font-medium">Alice</p>
                                <p className="text-xs text-textMuted">Current user / local source</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-textMuted uppercase mb-3">Destination</h3>
                        <div className="bg-accent/10 border border-accent/20 p-4 rounded-xl flex flex-col justify-center min-h-[74px]">
                            <p className="text-white font-medium flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Bob — Local Simulation Receiver</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: Quantum Simulation */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-white tracking-wider uppercase mb-1">Quantum Simulation</h2>
                <p className="text-sm text-textMuted mb-4">Configure the parameters used by the BB84 security simulation.</p>

                <div className="glass-panel p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-semibold text-textMuted uppercase mb-3">Simulation Qubits</label>
                            <select
                                value={qubits}
                                onChange={(e) => setQubits(Number(e.target.value))}
                                className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
                            >
                                <option value={128}>128</option>
                                <option value={256}>256</option>
                                <option value={512}>512</option>
                                <option value={1024}>1024 (Default)</option>
                                <option value={2048}>2048</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-textMuted uppercase mb-3">Security Threshold</label>
                            <select
                                value={qberThreshold}
                                onChange={(e) => setQberThreshold(Number(e.target.value))}
                                className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
                            >
                                <option value={0.05}>5%</option>
                                <option value={0.10}>10% (Default)</option>
                                <option value={0.15}>15%</option>
                                <option value={0.20}>20%</option>
                            </select>
                        </div>
                    </div>
                    <p className="text-xs text-textMuted/70 italic flex items-center gap-2">
                        <InfoIcon className="w-4 h-4 shrink-0" />
                        The threshold determines when observed channel disturbance causes a secure session to be rejected.
                    </p>
                </div>
            </section>

            {/* Section 3: Eavesdropper Simulation */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-white tracking-wider uppercase mb-1">Eavesdropper Simulation</h2>
                <p className="text-sm text-textMuted mb-4">Use Eve to demonstrate the effect of an intercept-resend attack on the BB84 channel.</p>

                <div className="glass-panel p-6 border-l-4 border-l-red-500/50 relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div>
                            <h3 className="text-white font-semibold flex items-center gap-2">
                                Eavesdropper (Eve)
                            </h3>
                            <p className="text-sm text-textMuted mt-1 w-3/4">
                                {eveEnabled
                                    ? "Eve performs an intercept-resend simulation to demonstrate channel disturbance."
                                    : "Eve is disabled. The quantum channel runs without simulated interception."
                                }
                            </p>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
                            <input type="checkbox" className="sr-only peer" checked={eveEnabled} onChange={(e) => setEveEnabled(e.target.checked)} />
                            <div className="w-14 h-7 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-500 transition-colors"></div>
                            <span className="ml-3 text-sm font-bold text-white uppercase w-8">{eveEnabled ? 'ON' : 'OFF'}</span>
                        </label>
                    </div>

                    {eveEnabled && (
                        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-sm text-red-200 flex items-start gap-2 relative z-10 animate-in fade-in slide-in-from-top-2">
                            <Zap className="w-5 h-5 shrink-0 text-red-500" />
                            <p>Demonstration mode: enabling Eve may increase QBER and cause the security check to fail.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Section 4: Application Mode */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-white tracking-wider uppercase mb-1">Application Mode</h2>
                <p className="text-sm text-textMuted mb-4">Choose how much technical information QVERA displays.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                        onClick={() => setMode('NORMAL')}
                        className={cn(
                            "glass-panel p-6 text-left transition-all border-2",
                            mode === 'NORMAL' ? "border-primary bg-primary/5 scale-[1.02]" : "border-transparent hover:bg-white/5 opacity-70"
                        )}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-white uppercase">User Mode</h3>
                            {mode === 'NORMAL' && <CheckCircle2 className="w-5 h-5 text-primary" />}
                        </div>
                        <p className="text-sm text-textMuted">Simple secure file transfer experience.</p>
                    </button>

                    <button
                        onClick={() => setMode('TECHNICAL')}
                        className={cn(
                            "glass-panel p-6 text-left transition-all border-2",
                            mode === 'TECHNICAL' ? "border-accent bg-accent/5 scale-[1.02]" : "border-transparent hover:bg-white/5 opacity-70"
                        )}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-white uppercase">Tech Mode</h3>
                            {mode === 'TECHNICAL' && <CheckCircle2 className="w-5 h-5 text-accent" />}
                        </div>
                        <p className="text-sm text-textMuted">Detailed BB84, QBER, encryption and transfer diagnostics.</p>
                    </button>
                </div>
            </section>

            {/* Section 5: Security & Privacy */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-white tracking-wider uppercase mb-1">Security & Privacy</h2>
                <div className="glass-panel overflow-hidden">
                    <div className="divide-y divide-white/10">
                        <div className="p-5 flex items-center justify-between">
                            <div>
                                <h3 className="text-white font-medium flex items-center gap-2"><Lock className="w-4 h-4 text-accent" /> Encryption</h3>
                                <p className="text-xs text-textMuted mt-1">Symmetrical Authenticated Algorithm</p>
                            </div>
                            <span className="font-mono text-sm bg-surface px-3 py-1 rounded-md text-accent border border-accent/20">AES-256-GCM</span>
                        </div>
                        <div className="p-5 flex items-center justify-between">
                            <div>
                                <h3 className="text-white font-medium flex items-center gap-2"><Eye className="w-4 h-4 text-primary" /> Secret Key Visibility</h3>
                                <p className="text-xs text-textMuted mt-1">QVERA never displays raw BB84 key material or AES encryption keys.</p>
                            </div>
                            <span className="font-semibold text-sm text-white">Never exposed</span>
                        </div>
                        <div className="p-5 flex items-center justify-between">
                            <div>
                                <h3 className="text-white font-medium flex items-center gap-2"><Shield className="w-4 h-4 text-green-400" /> Integrity Protection</h3>
                                <p className="text-xs text-textMuted mt-1">File hashes validated implicitly via GCM Tagging.</p>
                            </div>
                            <span className="font-semibold text-sm text-white">Authenticated</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 6: Local Receiver Storage */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-white tracking-wider uppercase mb-1">Local Receiver Storage</h2>
                <div className="glass-panel p-6 flex items-center justify-between">
                    <div className="flex gap-4">
                        <HardDrive className="w-10 h-10 text-white/20" />
                        <div>
                            <p className="text-white font-medium">Bob — Local Simulation Receiver</p>
                            <p className="text-sm font-mono text-textMuted bg-black/30 px-2 py-1 rounded mt-2 border border-white/5">/data/uploads/received/</p>
                        </div>
                    </div>
                    <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Ready</span>
                </div>
            </section>

            {/* Section 7: System Status */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-white tracking-wider uppercase mb-1">System Status</h2>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {['BB84 Engine', 'Security Engine', 'Encryption Engine', 'Transfer Engine', 'Verification Engine'].map((engine) => (
                        <div key={engine} className="glass-panel p-4 flex flex-col items-center justify-center text-center gap-3">
                            <span className="text-xs font-semibold text-textMuted uppercase">{engine}</span>
                            <span className="flex items-center gap-2 text-sm font-bold text-white"><span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span> Ready</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Section 8: Reset */}
            <section className="pt-8 border-t border-white/5 flex flex-col items-center justify-center space-y-4 pb-8">
                {showConfirmReset ? (
                    <div className="bg-surface/90 border border-red-500/30 p-6 rounded-2xl w-full max-w-md text-center animate-in fade-in zoom-in-95">
                        <h3 className="text-white font-bold text-lg mb-2">Restore default settings?</h3>
                        <p className="text-sm text-textMuted mb-6">Your simulation and transfer preferences will be returned to their default values. The history logs and state remain unaffected.</p>
                        <div className="flex gap-4 justify-center">
                            <button onClick={() => setShowConfirmReset(false)} className="px-5 py-2 rounded-lg font-medium text-white hover:bg-white/10 transition-colors">Cancel</button>
                            <button onClick={handleReset} className="px-5 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-400 transition-colors">Restore Defaults</button>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => setShowConfirmReset(true)} className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-textMuted hover:text-white transition-colors font-medium text-sm">
                        Restore Default Settings
                    </button>
                )}
            </section>
        </div>
    );
}

function InfoIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
    )
}
