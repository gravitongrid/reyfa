import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  Calendar,
  Mail,
  Phone,
  Building,
  MessageSquare,
  CheckCircle,
  XCircle,
  Plus,
  Edit3
} from 'lucide-react';

const ConsultationManagement = () => {
  const { siteData, updateSiteData, hasPermission, currentUser } = useAdmin();
  const [selectedConsultation, setSelectedConsultation] = useState<string | null>(null);
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [followUpData, setFollowUpData] = useState({
    message: '',
    type: 'email' as 'email' | 'phone' | 'meeting' | 'note',
    scheduledDate: ''
  });

  const canManageConsultations = hasPermission('consultation:view') || hasPermission('all');

  if (!canManageConsultations) {
    return (
      <div className="p-8 text-center">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to manage consultations.</p>
      </div>
    );
  }

  const consultations = siteData.consultations || [];

  const updateConsultationStatus = (id: string, status: string, notes?: string) => {
    const updatedConsultations = consultations.map((consultation: any) =>
      consultation.id === id
        ? {
            ...consultation,
            status,
            notes: notes || consultation.notes,
            assignedTo: status === 'approved' ? currentUser?.id : consultation.assignedTo,
            updatedAt: new Date().toISOString()
          }
        : consultation
    );
    updateSiteData('consultations', updatedConsultations);
  };

  const addFollowUp = (consultationId: string) => {
    const newFollowUp = {
      id: Date.now().toString(),
      consultationId,
      ...followUpData,
      completed: false,
      createdBy: currentUser?.id || '1',
      createdAt: new Date().toISOString()
    };

    const updatedConsultations = consultations.map((consultation: any) =>
      consultation.id === consultationId
        ? {
            ...consultation,
            followUps: [...(consultation.followUps || []), newFollowUp],
            updatedAt: new Date().toISOString()
          }
        : consultation
    );

    updateSiteData('consultations', updatedConsultations);
    setFollowUpData({ message: '', type: 'email', scheduledDate: '' });
    setShowFollowUpForm(false);
  };

  const toggleFollowUpComplete = (consultationId: string, followUpId: string) => {
    const updatedConsultations = consultations.map((consultation: any) =>
      consultation.id === consultationId
        ? {
            ...consultation,
            followUps:
              consultation.followUps?.map((followUp: any) =>
                followUp.id === followUpId
                  ? { ...followUp, completed: !followUp.completed }
                  : followUp
              ) || []
          }
        : consultation
    );
    updateSiteData('consultations', updatedConsultations);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      email: <Mail className="w-4 h-4" />,
      phone: <Phone className="w-4 h-4" />,
      meeting: <Calendar className="w-4 h-4" />,
      note: <MessageSquare className="w-4 h-4" />
    };
    return icons[type as keyof typeof icons] || <MessageSquare className="w-4 h-4" />;
  };

  return (
    <div className="p-6 pt-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Consultation Management</h1>
          <p className="text-gray-600 mt-1">Manage consultation requests and follow-ups</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            Total: {consultations.length} | Pending:{' '}
            {consultations.filter((c: any) => c.status === 'pending').length}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Consultation List */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Consultation Requests</h2>
          </div>

          {consultations.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No consultations yet</h3>
              <p className="text-gray-600">Consultation requests will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {consultations.map((consultation: any) => (
                <div
                  key={consultation.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedConsultation === consultation.id
                      ? 'bg-blue-50 border-l-4 border-blue-500'
                      : ''
                  }`}
                  onClick={() => setSelectedConsultation(consultation.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{consultation.clientName}</h3>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                        consultation.status
                      )}`}
                    >
                      {consultation.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {consultation.clientEmail}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(consultation.preferredDate).toLocaleDateString()} at{' '}
                      {consultation.preferredTime}
                    </div>
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-2" />
                      {consultation.serviceType}
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">{consultation.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Consultation Details */}
        <div className="bg-white rounded-lg shadow-lg">
          {selectedConsultation ? (
            (() => {
              const consultation = consultations.find((c: any) => c.id === selectedConsultation);
              if (!consultation) return null;

              return (
                <div>
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Consultation Details</h2>
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(
                        consultation.status
                      )}`}
                    >
                      {consultation.status}
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Client Name
                        </label>
                        <p className="text-gray-900">{consultation.clientName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <p className="text-gray-900">{consultation.clientEmail}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <p className="text-gray-900">{consultation.clientPhone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company
                        </label>
                        <p className="text-gray-900">{consultation.company || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Service Type
                        </label>
                        <p className="text-gray-900">{consultation.serviceType}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Preferred Date & Time
                        </label>
                        <p className="text-gray-900">
                          {new Date(consultation.preferredDate).toLocaleDateString()} at{' '}
                          {consultation.preferredTime}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{consultation.message}</p>
                    </div>

                    {consultation.notes && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <p className="text-gray-900 bg-yellow-50 p-3 rounded-lg">{consultation.notes}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {consultation.status === 'pending' && (
                      <div className="flex space-x-3 pt-4 border-t">
                        <button
                          onClick={() => {
                            const notes = prompt('Add notes (optional):');
                            updateConsultationStatus(consultation.id, 'approved', notes || undefined);
                          }}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            const notes = prompt('Reason for rejection:');
                            if (notes) updateConsultationStatus(consultation.id, 'rejected', notes);
                          }}
                          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </button>
                      </div>
                    )}

                    {consultation.status === 'approved' && (
                      <div className="flex space-x-3 pt-4 border-t">
                        <button
                          onClick={() => updateConsultationStatus(consultation.id, 'completed')}
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Complete
                        </button>
                        <button
                          onClick={() => setShowFollowUpForm(true)}
                          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Follow-up
                        </button>
                        <button
                          onClick={() => {
                            const notes = prompt('Add notes to consultation:');
                            if (notes)
                              updateConsultationStatus(consultation.id, consultation.status, notes);
                          }}
                          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Add Notes
                        </button>
                      </div>
                    )}

                    {/* Follow-ups */}
                    {consultation.followUps && consultation.followUps.length > 0 && (
                      <div className="pt-4 border-t">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Follow-ups</h3>
                        <div className="space-y-3">
                          {consultation.followUps.map((followUp: any) => (
                            <div key={followUp.id} className="bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-2">
                                  {getTypeIcon(followUp.type)}
                                  <div>
                                    <p className="text-sm text-gray-900">{followUp.message}</p>
                                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                                      <span>Type: {followUp.type}</span>
                                      {followUp.scheduledDate && (
                                        <span>
                                          Scheduled: {new Date(followUp.scheduledDate).toLocaleDateString()}
                                        </span>
                                      )}
                                      <span>
                                        Created: {new Date(followUp.createdAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => toggleFollowUpComplete(consultation.id, followUp.id)}
                                  className={`text-sm px-2 py-1 rounded ${
                                    followUp.completed
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {followUp.completed ? 'Completed' : 'Pending'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Follow-up Form */}
                    {showFollowUpForm && (
                      <div className="pt-4 border-t">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Add Follow-up</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea
                              value={followUpData.message}
                              onChange={(e) =>
                                setFollowUpData({ ...followUpData, message: e.target.value })
                              }
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Follow-up message..."
                            />
                          </div>
                          <div className="grid md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                              <select
                                value={followUpData.type}
                                onChange={(e) =>
                                  setFollowUpData({ ...followUpData, type: e.target.value as any })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="email">Email</option>
                                <option value="phone">Phone Call</option>
                                <option value="meeting">Meeting</option>
                                <option value="note">Note</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Scheduled Date (Optional)
                              </label>
                              <input
                                type="date"
                                value={followUpData.scheduledDate}
                                onChange={(e) =>
                                  setFollowUpData({ ...followUpData, scheduledDate: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => addFollowUp(consultation.id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Add Follow-up
                            </button>
                            <button
                              onClick={() => setShowFollowUpForm(false)}
                              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="p-8 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a consultation</h3>
              <p className="text-gray-600">Choose a consultation from the list to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationManagement;