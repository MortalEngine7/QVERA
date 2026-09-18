import { createContext, useContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { Shield, LayoutDashboard, History as HistoryIcon, Activity, ChevronLeft, Menu, TerminalSquare, Settings as SettingsIcon, Info } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import SecureTransfer from './pages/SecureTransfer';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import SecurityMonitor from './pages/Monitor';
import Settings from './pages/Settings';
import About from './pages/About';
import Logs from './pages/Logs';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Global App State
export type AppMode = 'NORMAL' | 'TECHNICAL';

export type TransferPhase = 'IDLE' | 'BB84' | 'SECURITY_CHECK' | 'ENCRYPTING' | 'TRANSFERRING' | 'DECRYPTING' | 'VERIFIED' | 'FAILED';

export interface LogEntry {
    time: string;
    level: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'CRITICAL';
    component: string;
    event: string;
    msg: string;
}

interface AppContextType {
    mode: AppMode;
    setMode: (mode: AppMode) => void;
    isSidebarOpen: boolean;
    setSidebarOpen: (v: boolean) => void;
    qubits: number;
    setQubits: (v: number) => void;
    qberThreshold: number;
    setQberThreshold: (v: number) => void;
    eveEnabled: boolean;
    setEveEnabled: (v: boolean) => void;
    phase: TransferPhase;
    setPhase: (v: TransferPhase) => void;
    sessionInfo: any;
    setSessionInfo: (v: any) => void;
    transferInfo: any;
    setTransferInfo: (v: any) => void;
    decryptionResult: any;
    setDecryptionResult: (v: any) => void;
    logs: LogEntry[];
    addLog: (log: Omit<LogEntry, 'time'>) => void;
    clearLogs: () => void;
    file: File | null;
    setFile: (f: File | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useAppContext must be used within AppProvider");
    return context;
};

function Sidebar() {
    const { mode, setMode, isSidebarOpen, setSidebarOpen } = useAppContext();
    const location = useLocation();

    const NAV_ITEMS = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Secure Transfer', path: '/transfer', icon: Shield },
        { name: 'Transfer History', path: '/history', icon: HistoryIcon },
        { name: 'Security Monitor', path: '/monitor', icon: Activity, technical: true },
        { name: 'Technical Logs', path: '/logs', icon: TerminalSquare, technical: true },
        { name: 'Settings', path: '/settings', icon: SettingsIcon },
        { name: 'About', path: '/about', icon: Info },
    ];

    return (
        <aside className={cn(
            "fixed inset-y-0 left-0 bg-surface/80 backdrop-blur-xl border-r border-white/5 flex flex-col transition-all duration-300 z-50",
            isSidebarOpen ? "w-64" : "w-16"
        )}>
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-3 border-b border-white/5">
                <div className={cn("flex items-center gap-3 overflow-hidden transition-opacity", !isSidebarOpen && "opacity-0 invisible w-0")}>
                    <Shield className="w-6 h-6 text-primary shrink-0" />
                    <span className="font-bold text-white tracking-widest whitespace-nowrap pt-1">QVERA</span>
                </div>
                <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg text-textMuted hover:text-white transition-colors">
                    {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto overflow-x-hidden relative">
                {NAV_ITEMS.map((item) => {
                    if (item.technical && mode === 'NORMAL') return null;

                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            title={!isSidebarOpen ? item.name : undefined}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative",
                                isActive ? "bg-primary/10 text-primary" : "text-textMuted hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className="w-5 h-5 shrink-0" />
                            <span className={cn(
                                "font-medium whitespace-nowrap transition-all duration-300",
                                isSidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"
                            )}>
                                {item.name}
                            </span>
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer Mode Switcher */}
            <div className="p-4 border-t border-white/5">
                <button
                    onClick={() => setMode(mode === 'NORMAL' ? 'TECHNICAL' : 'NORMAL')}
                    className={cn(
                        "w-full flex items-center p-2 rounded-lg border transition-all duration-300 relative overflow-hidden",
                        mode === 'TECHNICAL'
                            ? "bg-accent/10 border-accent/20 text-accent justify-between"
                            : "bg-surface border-white/5 text-textMuted hover:text-white justify-between",
                        !isSidebarOpen && "justify-center"
                    )}
                >
                    {isSidebarOpen ? (
                        <>
                            <span className="text-xs font-semibold uppercase tracking-wider pl-1 z-10">
                                {mode === 'NORMAL' ? 'USER MODE' : 'TECH DEMO'}
                            </span>
                            <div className={cn(
                                "w-2 h-2 rounded-full z-10",
                                mode === 'TECHNICAL' ? "bg-accent shadow-[0_0_8px_var(--color-accent)]" : "bg-white/20"
                            )} />
                        </>
                    ) : (
                        <div className={cn(
                            "w-2 h-2 rounded-full absolute",
                            mode === 'TECHNICAL' ? "bg-accent shadow-[0_0_8px_var(--color-accent)]" : "bg-white/20"
                        )} />
                    )}
                </button>
            </div>
        </aside>
    );
}

// All routes are fully implemented

function MainLayout() {
    const { isSidebarOpen } = useAppContext();

    return (
        <div className="min-h-screen bg-background flex text-text">
            <Sidebar />
            <main className={cn(
                "flex-1 transition-all duration-300 relative",
                isSidebarOpen ? "ml-64" : "ml-16"
            )}>
                {/* Ambient Background matching QVERA aesthetic */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[140px]" />
                    <div className="absolute inset-0 bg-background/40" />
                </div>

                {/* Content Area */}
                <div className="relative z-10 p-8 h-full min-h-screen">
                    <Routes>
                        <Route path="/" element={<Navigate to="/transfer" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/transfer" element={<SecureTransfer />} />
                        <Route path="/history" element={<History />} />
                        <Route path="/monitor" element={<SecurityMonitor />} />
                        <Route path="/logs" element={<Logs />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/about" element={<About />} />
                    </Routes>
                </div>
            </main>
        </div>
    )
}

export default function App() {
    const [mode, setMode] = useState<AppMode>('NORMAL');
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [qubits, setQubits] = useState(1024);
    const [qberThreshold, setQberThreshold] = useState(0.10);
    const [eveEnabled, setEveEnabled] = useState(false);

    // Elevated Transfer State
    const [phase, setPhase] = useState<TransferPhase>('IDLE');
    const [sessionInfo, setSessionInfo] = useState<any>(null);
    const [transferInfo, setTransferInfo] = useState<any>(null);
    const [decryptionResult, setDecryptionResult] = useState<any>(null);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [file, setFile] = useState<File | null>(null);

    const addLog = (log: Omit<LogEntry, 'time'>) => {
        const time = new Date().toISOString().substring(11, 23); // HH:mm:ss.SSS
        setLogs(prev => [...prev, { ...log, time }]);
    };

    const clearLogs = () => setLogs([]);

    const contextValue = {
        mode, setMode, isSidebarOpen, setSidebarOpen, qubits, setQubits,
        qberThreshold, setQberThreshold, eveEnabled, setEveEnabled,
        phase, setPhase, sessionInfo, setSessionInfo, transferInfo, setTransferInfo,
        decryptionResult, setDecryptionResult, logs, addLog, clearLogs,
        file, setFile
    };

    return (
        <AppContext.Provider value={contextValue}>
            <BrowserRouter>
                <MainLayout />
            </BrowserRouter>
        </AppContext.Provider>
    );
}
