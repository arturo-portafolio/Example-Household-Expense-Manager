
import React from 'react';
import { AppSettings, Category } from '../types';
import Icon from './Icon';
import { clearAllData } from '../utils/storage';

interface SettingsViewProps {
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, updateSettings }) => {
  const handleExport = () => {
    const data = localStorage.getItem('zenspend_local_data');
    if (!data) return;
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zenspend_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="px-6 pt-12 pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        <section className="mt-4">
          <h3 className="px-6 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Preferences</h3>
          <div className="bg-surface-card border-y border-surface-border divide-y divide-surface-border">
            <div className="flex items-center gap-4 px-6 py-4 active:bg-primary/5 cursor-pointer">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                <Icon name="payments" />
              </div>
              <div className="flex-1 text-[15px]">Currency</div>
              <div className="flex items-center gap-1 text-slate-500 text-sm">
                <span>{settings.currency} ($)</span>
                <Icon name="chevron_right" className="text-slate-600" />
              </div>
            </div>
            
            <div className="flex items-center gap-4 px-6 py-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                <Icon name="dark_mode" />
              </div>
              <div className="flex-1 text-[15px]">Dark Mode</div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.isDarkMode} 
                  onChange={(e) => updateSettings({ isDarkMode: e.target.checked })}
                />
                <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="px-6 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Management</h3>
          <div className="bg-surface-card border-y border-surface-border">
            <div className="flex items-center gap-4 px-6 py-4 active:bg-primary/5 cursor-pointer">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                <Icon name="category" />
              </div>
              <div className="flex-1 text-[15px]">Manage Categories</div>
              <Icon name="chevron_right" className="text-slate-600" />
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="px-6 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Data & Backup</h3>
          <div className="bg-surface-card border-y border-surface-border divide-y divide-surface-border">
            <div onClick={handleExport} className="flex items-center gap-4 px-6 py-4 active:bg-primary/5 cursor-pointer">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                <Icon name="file_export" />
              </div>
              <div className="flex-1 text-[15px]">Export Data (JSON)</div>
              <Icon name="chevron_right" className="text-slate-600" />
            </div>
            <div className="flex items-center gap-4 px-6 py-4 active:bg-primary/5 cursor-pointer">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                <Icon name="cloud_sync" />
              </div>
              <div className="flex-1">
                <p className="text-[15px]">Local Backup</p>
                <p className="text-[10px] text-slate-500">Auto-saves to your browser storage</p>
              </div>
              <Icon name="chevron_right" className="text-slate-600" />
            </div>
          </div>
          <p className="px-6 py-4 text-[11px] text-slate-500 leading-relaxed">
            All your data is stored locally on this device. We never sync your financial details to external servers. Use the export feature for manual backups.
          </p>
        </section>

        <section className="mt-8">
          <div className="bg-surface-card border-y border-surface-border">
            <button 
              onClick={() => {
                if(confirm("Are you sure? This will erase everything permanently!")) clearAllData();
              }}
              className="w-full flex items-center justify-center gap-2 py-4 text-danger font-bold active:bg-danger/10"
            >
              <Icon name="delete_forever" />
              <span>Erase All Data</span>
            </button>
          </div>
          <p className="px-6 py-2 text-center text-[10px] text-slate-600">This action is permanent and cannot be undone.</p>
        </section>

        <footer className="mt-12 text-center pb-20">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">ZenSpend v1.0.0</p>
          <p className="text-[10px] text-slate-600 mt-1">Privacy Focused • Offline First</p>
        </footer>
      </main>
    </div>
  );
};

export default SettingsView;
