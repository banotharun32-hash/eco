import React, { useState } from 'react';
import {
  History,
  Plus,
  Edit2,
  Trash2,
  Download,
  Calendar,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import { UsageRecord, HouseholdInputs } from '../types';
import { formatCo2 } from '../utils/emissionFactors';

interface UsageLogProps {
  records: UsageRecord[];
  onAddRecord: (input: HouseholdInputs) => Promise<void>;
  onUpdateRecord: (id: string, input: Partial<HouseholdInputs>) => Promise<void>;
  onDeleteRecord: (id: string) => Promise<void>;
}

export const UsageLog: React.FC<UsageLogProps> = ({
  records,
  onAddRecord,
  onUpdateRecord,
  onDeleteRecord,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<UsageRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<HouseholdInputs>({
    month: '2026-07',
    electricityKwh: 320,
    gasM3: 30,
    waterLiters: 9500,
    carKm: 400,
    carFuelType: 'petrol',
    publicTransportKm: 150,
    motorcycleKm: 0,
    flightsCount: 0,
    appliances: {
      airConditionerHoursPerDay: 1,
      refrigeratorType: 'standard',
      washingMachineCyclesPerWeek: 3,
      tvHoursPerDay: 3,
      computerHoursPerDay: 6,
      otherApplianceWatts: 200,
    },
  });

  const filteredRecords = records.filter(
    (r) =>
      r.month.includes(searchTerm) ||
      r.emissions.totalKg.toString().includes(searchTerm) ||
      r.electricityKwh.toString().includes(searchTerm)
  );

  const handleOpenAddModal = () => {
    setEditingRecord(null);
    setFormData({
      month: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
      electricityKwh: 320,
      gasM3: 30,
      waterLiters: 9500,
      carKm: 400,
      carFuelType: 'petrol',
      publicTransportKm: 150,
      motorcycleKm: 0,
      flightsCount: 0,
      appliances: {
        airConditionerHoursPerDay: 1,
        refrigeratorType: 'standard',
        washingMachineCyclesPerWeek: 3,
        tvHoursPerDay: 3,
        computerHoursPerDay: 6,
        otherApplianceWatts: 200,
      },
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rec: UsageRecord) => {
    setEditingRecord(rec);
    setFormData({
      month: rec.month,
      electricityKwh: rec.electricityKwh,
      gasM3: rec.gasM3,
      waterLiters: rec.waterLiters,
      carKm: rec.carKm,
      carFuelType: rec.carFuelType || 'petrol',
      publicTransportKm: rec.publicTransportKm,
      motorcycleKm: rec.motorcycleKm,
      flightsCount: rec.flightsCount,
      appliances: rec.appliances || {
        airConditionerHoursPerDay: 1,
        refrigeratorType: 'standard',
        washingMachineCyclesPerWeek: 3,
        tvHoursPerDay: 3,
        computerHoursPerDay: 6,
        otherApplianceWatts: 200,
      },
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingRecord) {
        await onUpdateRecord(editingRecord.id, formData);
      } else {
        await onAddRecord(formData);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to submit usage record:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDeleteRecord(id);
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Failed to delete record:', err);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (records.length === 0) return;
    const headers = [
      'Month',
      'Electricity (kWh)',
      'Gas (m3)',
      'Water (L)',
      'Car Distance (km)',
      'Public Transit (km)',
      'Flights',
      'Total Footprint (kg CO2e)',
      'Total Tonnes',
    ];
    const rows = records.map((r) => [
      r.month,
      r.electricityKwh,
      r.gasM3,
      r.waterLiters,
      r.carKm,
      r.publicTransportKm,
      r.flightsCount,
      r.emissions.totalKg,
      r.emissions.totalTonnes,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ecotrack_usage_records_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            <History className="w-4 h-4 text-emerald-500" />
            <span>Historical Usage Database</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Monthly Household Usage Log
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            View, create, edit, and delete monthly utility consumption entries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            id="export-csv-button"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-300 flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-600" />
            Export CSV
          </button>

          <button
            onClick={handleOpenAddModal}
            id="add-new-record-button"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Usage Record
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search by month (e.g. 2026-05) or carbon value..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Interactive Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-4 px-6">Month</th>
                <th className="py-4 px-4">Electricity</th>
                <th className="py-4 px-4">Gas</th>
                <th className="py-4 px-4">Water</th>
                <th className="py-4 px-4">Car Distance</th>
                <th className="py-4 px-4">Carbon Footprint</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-sm">
                    No records found. Click "Add Usage Record" to insert a new entry.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                      {record.month}
                    </td>
                    <td className="py-4 px-4 text-slate-700 font-semibold">{record.electricityKwh} kWh</td>
                    <td className="py-4 px-4 text-slate-700 font-semibold">{record.gasM3} m³</td>
                    <td className="py-4 px-4 text-slate-700 font-semibold">
                      {record.waterLiters.toLocaleString()} L
                    </td>
                    <td className="py-4 px-4 text-slate-700 font-semibold">{record.carKm} km</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {formatCo2(record.emissions.totalKg)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(record)}
                        id={`edit-record-${record.id}`}
                        className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Edit Record"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {deleteConfirmId === record.id ? (
                        <div className="inline-flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                          <button
                            onClick={() => handleDelete(record.id)}
                            className="px-2 py-0.5 text-[11px] font-bold bg-rose-600 text-white rounded hover:bg-rose-700"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-1.5 py-0.5 text-[11px] font-medium text-slate-600 hover:text-slate-900"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(record.id)}
                          id={`delete-record-${record.id}`}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Record Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white max-w-xl w-full rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">
                {editingRecord ? 'Edit Monthly Usage Record' : 'Add New Monthly Usage Record'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
                  Month (YYYY-MM)
                </label>
                <input
                  type="month"
                  required
                  id="modal-month-input"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
                    Electricity (kWh)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    id="modal-elec-input"
                    value={formData.electricityKwh}
                    onChange={(e) => setFormData({ ...formData, electricityKwh: Number(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
                    Natural Gas (m³)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    id="modal-gas-input"
                    value={formData.gasM3}
                    onChange={(e) => setFormData({ ...formData, gasM3: Number(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
                    Water (Liters)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    id="modal-water-input"
                    value={formData.waterLiters}
                    onChange={(e) => setFormData({ ...formData, waterLiters: Number(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
                    Car Distance (km)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    id="modal-car-input"
                    value={formData.carKm}
                    onChange={(e) => setFormData({ ...formData, carKm: Number(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
                    Public Transit (km)
                  </label>
                  <input
                    type="number"
                    min="0"
                    id="modal-transit-input"
                    value={formData.publicTransportKm}
                    onChange={(e) => setFormData({ ...formData, publicTransportKm: Number(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
                    Flights (Trips)
                  </label>
                  <input
                    type="number"
                    min="0"
                    id="modal-flights-input"
                    value={formData.flightsCount}
                    onChange={(e) => setFormData({ ...formData, flightsCount: Number(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 font-medium text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="modal-submit-button"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  {isSubmitting ? 'Saving...' : editingRecord ? 'Save Changes' : 'Create Record'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
