import { Shield, Sparkles, Network, Fingerprint, Lock, ChevronRight, Activity, Database, LayoutDashboard, Server } from 'lucide-react';
import { cn } from '../App';

export default function About() {
    return (
        <div className="max-w-5xl mx-auto animate-in fade-in duration-700 pb-20 space-y-20">
            {/* HERO SECTION */}
            <section className="text-center space-y-6 pt-10">
                <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-3xl border border-primary/20 mb-4 glow-effect">
                    <Shield className="w-16 h-16 text-primary" />
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-accent tracking-tight">
                    QVERA
                </h1>
                <p className="text-2xl font-light text-white tracking-widest uppercase">Secure File Transfer</p>
                <div className="flex items-center justify-center gap-4 text-textMuted font-medium uppercase tracking-widest text-sm pt-4">
                    <span>Secure</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                    <span>Verify</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/50" />
                    <span>Transfer</span>
                </div>
                <p className="max-w-2xl mx-auto text-lg text-textMuted/90 leading-relaxed mt-6">
                    QVERA is a secure file transfer system that combines a computational BB84 simulation, quantum-channel disturbance analysis, and authenticated symmetric encryption to demonstrate secure communication and file verification.
                </p>
            </section>

            {/* WHAT IS QVERA */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold text-white tracking-wide">What is QVERA?</h2>
                <div className="glass-panel p-8 md:p-10 text-lg text-textMuted leading-relaxed space-y-4">
                    <p>
                        QVERA demonstrates how quantum key distribution concepts can be combined with modern cryptography to establish secure file-transfer workflows.
                    </p>
                    <p>
                        BB84 is computationally simulated to establish shared secret key material between Alice and Bob. The resulting channel disturbance is evaluated using QBER. When the security check passes, the shared key material is transformed into a 256-bit encryption key and used with AES-256-GCM to protect the file.
                    </p>
                </div>
            </section>

            {/* PIPELINE VISUALIZATION */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold text-white tracking-wide text-center">How It Works</h2>
                <div className="glass-panel p-10 px-4 md:px-10 overflow-hidden relative">
                    <div className="flex flex-wrap justify-center items-center gap-4 relative z-10 text-xs md:text-sm font-semibold tracking-wider uppercase text-textMuted">
                        <PipelineNode text="FILE" /> <Chevron />
                        <PipelineNode text="BB84" active /> <Chevron />
                        <PipelineNode text="BASIS RECONCILIATION" /> <Chevron />
                        <PipelineNode text="SIFTED KEY" /> <Chevron />
                        <PipelineNode text="QBER" active /> <Chevron />
                        <PipelineNode text="SECURITY DECISION" /> <Chevron />
                        <PipelineNode text="KEY DERIVATION" /> <Chevron />
                        <PipelineNode text="AES-256-GCM" active /> <Chevron />
                        <PipelineNode text="SECURE TRANSFER" /> <Chevron />
                        <PipelineNode text="DECRYPTION" /> <Chevron />
                        <PipelineNode text="INTEGRITY VERIFICATION" active />
                    </div>
                </div>
            </section>

            {/* SECURITY ARCHITECTURE */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold text-white tracking-wide">Security Architecture</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ArchCard
                        number="1"
                        icon={<Sparkles />}
                        title="Quantum Key Establishment"
                        items={['BB84 simulation', 'Basis reconciliation', 'Sifted key']}
                        color="primary"
                    />
                    <ArchCard
                        number="2"
                        icon={<Activity />}
                        title="Security Verification"
                        items={['QBER calculation', 'Security threshold', 'Security decision']}
                        color="red"
                    />
                    <ArchCard
                        number="3"
                        icon={<Lock />}
                        title="File Protection"
                        items={['HKDF-SHA256', 'AES-256-GCM', 'Authentication', 'Integrity verification']}
                        color="accent"
                    />
                </div>
            </section>

            {/* EVE DEMONSTRATION */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold text-white tracking-wide">Eavesdropper Demonstration</h2>
                <div className="glass-panel p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4 text-textMuted">
                        <p>
                            QVERA includes an optional simulated intercept-resend attacker, Eve. When enabled, Eve independently measures and re-encodes transmitted quantum states, allowing the resulting increase in channel disturbance to be observed through QBER.
                        </p>
                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-300 text-sm font-medium">
                            Eve is a computational demonstration. QVERA does not use physical quantum hardware or model a physical eavesdropper.
                        </div>
                    </div>
                    <div className="flex flex-col justify-center gap-8 bg-surface/50 p-6 rounded-2xl border border-white/5 font-mono text-xs items-center opacity-80">
                        <div className="flex items-center gap-4 text-red-400">
                            <div className="px-3 py-1.5 border border-white/20 rounded bg-white/5 text-white">ALICE</div>
                            <div className="w-12 h-px bg-red-400/50" />
                            <div className="text-2xl">→</div>
                            <div className="px-3 py-1.5 border border-red-500/50 rounded bg-red-500/20 text-red-200">EVE</div>
                            <div className="w-12 h-px bg-red-400/50" />
                            <div className="text-2xl">→</div>
                            <div className="px-3 py-1.5 border border-white/20 rounded bg-white/5 text-white">BOB</div>
                        </div>
                        <div className="flex items-center gap-4 text-primary">
                            <div className="px-3 py-1.5 border border-white/20 rounded bg-white/5 text-white">ALICE</div>
                            <div className="w-32 h-px bg-primary/50" />
                            <div className="text-2xl">─────────→</div>
                            <div className="px-3 py-1.5 border border-white/20 rounded bg-white/5 text-white">BOB</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CRYPTOGRAPHY */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold text-white tracking-wide text-center">Cryptographic Protection</h2>
                <p className="text-center text-textMuted max-w-2xl mx-auto">
                    QVERA uses AES-256-GCM to provide both confidentiality and authenticated integrity for transferred files.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div className="glass-panel p-6 text-center border-t-2 border-t-primary space-y-2">
                        <p className="text-xs font-bold text-textMuted uppercase">Key Derivation</p>
                        <p className="text-lg font-mono text-white">HKDF-SHA256</p>
                    </div>
                    <div className="glass-panel p-6 text-center border-t-2 border-t-accent space-y-2">
                        <p className="text-xs font-bold text-textMuted uppercase">Encryption</p>
                        <p className="text-lg font-mono text-white">AES-256-GCM</p>
                    </div>
                    <div className="glass-panel p-6 text-center border-t-2 border-t-green-400 space-y-2">
                        <p className="text-xs font-bold text-textMuted uppercase">Authentication</p>
                        <p className="text-lg font-mono text-white">GCM Auth Tag</p>
                    </div>
                </div>
            </section>

            {/* DEMONSTRATION MODES */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold text-white tracking-wide">Demonstration Modes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass-panel p-8">
                        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">User Mode</h3>
                        <p className="text-textMuted mb-6 pb-6 border-b border-white/10">Designed for simple file transfer.</p>
                        <ul className="space-y-3 font-medium text-sm text-white/80">
                            <li>✓ File</li>
                            <li>✓ Source</li>
                            <li>✓ Destination</li>
                            <li>✓ Security status</li>
                            <li>✓ Transfer status</li>
                            <li>✓ Verification</li>
                        </ul>
                    </div>
                    <div className="glass-panel p-8 border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4"><Fingerprint className="w-24 h-24 text-white/5 opacity-50 group-hover:opacity-100 transition-opacity" /></div>
                        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide relative z-10">Tech Mode</h3>
                        <p className="text-textMuted mb-6 pb-6 border-b border-white/10 relative z-10">Designed for technical demonstration and project review.</p>
                        <ul className="grid grid-cols-2 gap-y-3 font-medium text-sm text-white/80 relative z-10">
                            <li>✓ BB84 process</li>
                            <li>✓ Qubit statistics</li>
                            <li>✓ Basis reconciliation</li>
                            <li>✓ QBER</li>
                            <li>✓ Eve</li>
                            <li>✓ Security decision</li>
                            <li>✓ Key establishment</li>
                            <li>✓ Encryption</li>
                            <li>✓ Transfer</li>
                            <li>✓ Decryption</li>
                            <li>✓ Integrity</li>
                            <li>✓ Event logs</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* LIMITATIONS */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold text-white tracking-wide">Simulation & Scope</h2>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-3xl p-8 md:p-10 space-y-6">
                    <p className="text-xl text-yellow-300/90 font-medium pb-4 border-b border-yellow-500/20">
                        QVERA is an educational computational simulation of quantum key distribution concepts.
                    </p>
                    <ul className="list-disc pl-5 space-y-3 text-yellow-100/70 text-lg marker:text-yellow-500/50">
                        <li>BB84 is simulated in software.</li>
                        <li>No physical photons are transmitted.</li>
                        <li>No physical quantum hardware is required.</li>
                        <li>Eve is a simulated intercept-resend attack.</li>
                        <li>The transfer receiver is currently represented through the application's local/simulated receiver environment unless a real network transport is configured.</li>
                        <li>QBER is used as an application security decision metric.</li>
                        <li>AES-256-GCM provides the actual authenticated file encryption layer.</li>
                    </ul>
                </div>
            </section>

            {/* TECH STACK */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold text-white tracking-wide text-center">Technology Stack</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <TechBadge icon={<LayoutDashboard />} category="Frontend" label="React / Tailwind" />
                    <TechBadge icon={<Server />} category="Backend" label="FastAPI / Python" />
                    <TechBadge icon={<Network />} category="Quantum Sim" label="BB84 Engine" />
                    <TechBadge icon={<Lock />} category="Cryptography" label="AES GCM / HKDF" />
                    <TechBadge icon={<Database />} category="Storage" label="SQLite3" />
                </div>
            </section>

            {/* WHY QVERA */}
            <section className="space-y-6 text-center">
                <h2 className="text-3xl font-bold text-white tracking-wide">Why QVERA?</h2>
                <p className="text-lg text-textMuted max-w-3xl mx-auto mb-8">
                    QVERA was developed to demonstrate the integration of quantum cryptography concepts with practical modern file encryption and verification workflows.
                </p>
                <div className="flex flex-wrap justify-center gap-4 font-bold text-white uppercase text-sm">
                    <span className="px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary">✓ Secure key establishment</span>
                    <span className="px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary">✓ Security verification</span>
                    <span className="px-4 py-2 rounded-full border border-accent/30 bg-accent/10 text-accent">✓ Authenticated encryption</span>
                    <span className="px-4 py-2 rounded-full border border-accent/30 bg-accent/10 text-accent">✓ File transfer</span>
                    <span className="px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-green-400">✓ Integrity verification</span>
                    <span className="px-4 py-2 rounded-full border border-white/20 bg-white/5">✓ Technical visualization</span>
                </div>
            </section>

            {/* FOOTER METADATA */}
            <section className="pt-20">
                <div className="glass-panel p-6 md:p-8 flex flex-col md:flex-row items-center justify-between text-left text-sm gap-6 border-t font-mono text-textMuted">
                    <div className="flex items-center gap-3">
                        <Shield className="w-8 h-8 text-primary" />
                        <div>
                            <p className="text-white font-bold tracking-wider uppercase">QVERA</p>
                            <p className="text-xs">Secure File Transfer</p>
                        </div>
                    </div>
                    <div className="space-y-1 md:text-right">
                        <p>VERSION: <span className="text-white uppercase">Prototype / Academic Demonstration</span></p>
                        <p>ENVIRONMENT: <span className="text-white uppercase">Computational Simulation</span></p>
                        <p>PURPOSE: <span className="text-white uppercase">Academic / Educational / Demonstration</span></p>
                    </div>
                </div>
            </section>
        </div>
    );
}

// Helpers
function PipelineNode({ text, active = false }: { text: string; active?: boolean }) {
    return (
        <span className={cn(
            "px-4 py-3 rounded-lg border transition-colors whitespace-nowrap",
            active ? "bg-white/10 border-white/20 text-white shadow-lg" : "bg-transparent border-transparent text-textMuted/50"
        )}>
            {text}
        </span>
    );
}

function Chevron() {
    return <ChevronRight className="w-4 h-4 text-white/20 shrink-0" />;
}

function ArchCard({ number, icon, title, items, color }: { number: string; icon: React.ReactNode; title: string; items: string[]; color: 'primary' | 'accent' | 'red' }) {

    const textColors = {
        primary: 'text-primary',
        accent: 'text-accent',
        red: 'text-red-500'
    };

    const borderColors = {
        primary: 'border-t-primary',
        accent: 'border-t-accent',
        red: 'border-t-red-500'
    };

    return (
        <div className={cn("glass-panel p-6 border-t-2 relative flex flex-col", borderColors[color])}>
            <div className="absolute top-4 right-4 text-4xl font-black text-white/5">{number}</div>
            <div className={cn("mb-4", textColors[color])}>
                {icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-4 z-10 relative">{title}</h3>
            <ul className="space-y-2 text-textMuted text-sm relative z-10 flex-1">
                {items.map((it, i) => (
                    <li key={i} className="flex items-start gap-2">
                        <span className={cn("mt-0.5", textColors[color])}>•</span> {it}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function TechBadge({ icon, category, label }: { icon: React.ReactNode; category: string; label: string }) {
    return (
        <div className="glass-panel p-4 flex flex-col items-center justify-center text-center gap-3 hover:bg-white/5 transition-colors">
            <div className="text-textMuted/50">{icon}</div>
            <div>
                <p className="text-[10px] uppercase font-bold text-textMuted tracking-widest">{category}</p>
                <p className="text-sm font-semibold text-white mt-1">{label}</p>
            </div>
        </div>
    )
}
