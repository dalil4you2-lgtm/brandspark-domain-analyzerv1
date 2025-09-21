import React, { useState, useMemo } from 'react';
import type { DomainReport, DomainAnalysis } from '../types';
import { TrophyIcon } from './icons/TrophyIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { SortIcon } from './icons/SortIcon';

interface AnalysisResultProps {
  report: DomainReport;
}

type SortableKey = 'domainName' | 'brandArchetype' | 'atomScore' | 'valuation';
type SortDirection = 'ascending' | 'descending';

interface SortConfig {
  key: SortableKey | null;
  direction: SortDirection;
}

const parseValuation = (valuation: string): number => {
  // Expected format: "$1,500 / $8,500"
  const parts = valuation.split('/');
  if (parts.length < 2) return 0;
  // Use the retail (second) value for sorting
  const retailPart = parts[1].trim();
  return parseInt(retailPart.replace(/[$,]/g, ''), 10) || 0;
};

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ report }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'atomScore', direction: 'descending' });

  const sortedAnalysisTable = useMemo(() => {
    const sortableItems = [...report.analysisTable];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];
        
        let comparison = 0;
        if (sortConfig.key === 'valuation') {
          comparison = parseValuation(aValue as string) - parseValuation(bValue as string);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
          comparison = aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' });
        }

        return sortConfig.direction === 'ascending' ? comparison : -comparison;
      });
    }
    return sortableItems;
  }, [report.analysisTable, sortConfig]);

  const requestSort = (key: SortableKey) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
      // Allow cycling back to ascending or default for a better UX
      direction = 'ascending';
    }
    setSortConfig({ key, direction });
  };

  const SortableHeader: React.FC<{ sortKey: SortableKey; children: React.ReactNode }> = ({ sortKey, children }) => {
    const isActive = sortConfig.key === sortKey;
    return (
      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
        <button
          onClick={() => requestSort(sortKey)}
          className="group inline-flex items-center gap-2"
          aria-label={`Sort by ${children}`}
        >
          {children}
          <SortIcon direction={isActive ? sortConfig.direction : 'none'} />
        </button>
      </th>
    );
  };


  return (
    <div className="space-y-12">
      {/* Executive Briefing */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <TrophyIcon />
          <h2 className="text-2xl font-bold text-slate-800">Executive Briefing: Top 5 Picks</h2>
        </div>
        <div className="space-y-4">
          {report.executiveBriefing.sort((a, b) => a.rank - b.rank).map((pick) => (
            <div key={pick.rank} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full font-bold text-lg">
                  #{pick.rank}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-indigo-700">{pick.domainName}</h3>
                  <p className="text-slate-600 mt-1">{pick.justification}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Analysis Table */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <ChartBarIcon />
          <h2 className="text-2xl font-bold text-slate-800">Comprehensive Analysis</h2>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <SortableHeader sortKey="domainName">Domain Name</SortableHeader>
                  <SortableHeader sortKey="brandArchetype">Archetype</SortableHeader>
                  <SortableHeader sortKey="atomScore">Atom Score</SortableHeader>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Strengths</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Weaknesses</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Use Cases</th>
                  <SortableHeader sortKey="valuation">Valuation (W/R)</SortableHeader>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {sortedAnalysisTable.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item.domainName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.brandArchetype}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-bold">{item.atomScore}/10</td>
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-xs">{item.keyStrengths}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-xs">{item.weaknessesOrRisks}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-xs">{item.idealUseCases}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.valuation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};