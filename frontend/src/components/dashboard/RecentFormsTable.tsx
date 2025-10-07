import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Form {
    id: string;
    name: string;
    endpointSlug: string;
    submissionCount: number;
    lastSubmission?: string;
    isActive: boolean;
    createdAt: string;
}

interface RecentFormsTableProps {
    forms: Form[];
    isLoading?: boolean;
}

export function RecentFormsTable({ forms, isLoading }: RecentFormsTableProps) {
    const navigate = useNavigate();
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Recent Forms</h3>
                    <p className="text-sm text-gray-600">Your latest form configurations</p>
                </div>
                <div className="p-6">
                    <div className="animate-pulse space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                                <div className="h-6 bg-gray-200 rounded w-16"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Forms</h3>
                <p className="text-sm text-gray-600">Your latest form configurations</p>
            </div>
            <div className="overflow-hidden">
                {forms.length === 0 ? (
                    <div className="p-6 text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-sm">No forms created yet</p>
                        <p className="text-gray-400 text-xs mt-1">Create your first form to get started</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {forms.map((form) => (
                            <div
                                key={form.id}
                                className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                                onClick={() => navigate(`/dashboard/forms/${form.id}`)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{form.name}</p>
                                            <p className="text-xs text-gray-500">
                                                Created {new Date(form.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">{form.submissionCount}</p>
                                            <p className="text-xs text-gray-500">submissions</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${form.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {form.isActive ? 'Active' : 'Paused'}
                                            </span>
                                            <button
                                                className="p-1 text-gray-400 hover:text-gray-600"
                                                onClick={(e) => e.stopPropagation()}
                                                title="More options"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
