import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { OfflineSyncProvider } from './context/OfflineSyncContext';
import { VoiceProvider } from './context/VoiceContext';

// Common
import { DemoHeader } from './components/common/DemoHeader';

// Landing Page (Reference Corporate Design)
import { LandingPage } from './components/landing/LandingPage';

// Collector
import { CollectorHome } from './components/collector/CollectorHome';
import { LotCreator } from './components/collector/LotCreator';
import { LotListView } from './components/collector/LotListView';
import { LotDetailView } from './components/collector/LotDetailView';
import { PriceBoard } from './components/collector/PriceBoard';
import { RecyclerLocator } from './components/collector/RecyclerLocator';
import { KhataPassbook } from './components/collector/KhataPassbook';
import { SafetyCenter } from './components/collector/SafetyCenter';

// Recycler
import { RecyclerLayout } from './components/recycler/RecyclerLayout';
import { RecyclerDashboardOverview } from './components/recycler/RecyclerDashboardOverview';
import { IncomingLots } from './components/recycler/IncomingLots';
import { HandoverScanner } from './components/recycler/HandoverScanner';
import { PriceManager } from './components/recycler/PriceManager';
import { FacilityProfile } from './components/recycler/FacilityProfile';

// Admin
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminOverview } from './components/admin/AdminOverview';
import { RegionalHeatmap } from './components/admin/RegionalHeatmap';
import { CriticalMineralAnalytics } from './components/admin/CriticalMineralAnalytics';
import { UnitEconomicsCalculator } from './components/admin/UnitEconomicsCalculator';
import { RecyclerComplianceAudit } from './components/admin/RecyclerComplianceAudit';

export function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <OfflineSyncProvider>
          <VoiceProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
                {/* Global Evaluation Bar & Role Switcher */}
                <DemoHeader />

                {/* Main Views */}
                <div className="flex-1">
                  <Routes>
                    {/* Landing Page */}
                    <Route path="/" element={<LandingPage />} />

                    {/* Collector Routes */}
                    <Route path="/collector" element={<CollectorHome />} />
                    <Route path="/sell" element={<LotCreator />} />
                    <Route path="/lots" element={<LotListView />} />
                    <Route path="/lots/:id" element={<LotDetailView />} />
                    <Route path="/prices" element={<PriceBoard />} />
                    <Route path="/recyclers" element={<RecyclerLocator />} />
                    <Route path="/khata" element={<KhataPassbook />} />
                    <Route path="/safety" element={<SafetyCenter />} />

                    {/* Recycler Routes */}
                    <Route path="/recycler" element={<RecyclerLayout />}>
                      <Route index element={<RecyclerDashboardOverview />} />
                      <Route path="lots" element={<IncomingLots />} />
                      <Route path="pickups" element={<IncomingLots />} />
                      <Route path="handover" element={<HandoverScanner />} />
                      <Route path="prices" element={<PriceManager />} />
                      <Route path="profile" element={<FacilityProfile />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminOverview />} />
                      <Route path="heatmap" element={<RegionalHeatmap />} />
                      <Route path="minerals" element={<CriticalMineralAnalytics />} />
                      <Route path="economics" element={<UnitEconomicsCalculator />} />
                      <Route path="compliance" element={<RecyclerComplianceAudit />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
              </div>
            </BrowserRouter>
          </VoiceProvider>
        </OfflineSyncProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
