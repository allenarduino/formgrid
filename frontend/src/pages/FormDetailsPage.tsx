import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { useForms } from '../hooks/useForms';
import { useAuth } from '../context/AuthContext';
import { useSubmissions, Submission } from '../hooks/useSubmissions';
import api from '../lib/api';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface ApiForm {
    id: string;
    name: string;
    description: string | null;
    endpointSlug: string;
    endpointUrl: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    submissionCount: number;
    settings?: {
        allowMultipleSubmissions?: boolean;
        requireEmailNotification?: boolean;
        notificationEmail?: string;
        redirectUrl?: string;
        customCss?: string;
        customJs?: string;
        spamProtection?: {
            enabled: boolean;
            honeypot: boolean;
            rateLimit: number;
        };
        webhookUrl?: string;
        webhookSecret?: string;
    };
}

interface Form extends ApiForm { }

interface FormStatistics {
    totalSubmissions: number;
    thisWeekSubmissions: number;
    spamRate: number;
    createdDate: string;
}

const tabs = [
    { id: 'overview', name: 'Overview', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
    { id: 'submissions', name: 'Submissions', icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { id: 'settings', name: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
];

// Helper function for formatting dates
const formatCreatedDate = (createdAt: string) => {
    const date = new Date(createdAt);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export function FormDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { getFormById, updateForm } = useForms();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [form, setForm] = useState<Form | null>(null);
    const [statistics, setStatistics] = useState<FormStatistics | null>(null);
    const [editData, setEditData] = useState({
        name: '',
        description: '',
        isActive: true,
    });
    const [statisticsLoading, setStatisticsLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [selectedSubmissions, setSelectedSubmissions] = useState<Set<string>>(new Set());
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [notificationEmails, setNotificationEmails] = useState<string[]>([]);
    const [newEmail, setNewEmail] = useState('');
    const [redirectUrl, setRedirectUrl] = useState('');
    const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
    // Spam protection state management
    // This tracks the security settings that will be saved to the backend
    // enabled: Master toggle for all spam protection (CAPTCHA, honeypot, rate limiting)
    // honeypot: Whether to add hidden field to catch bots
    // rateLimit: Maximum submissions per minute per IP address
    const [spamProtection, setSpamProtection] = useState({
        enabled: false,    // Master spam protection toggle
        honeypot: false,   // Honeypot field protection
        rateLimit: 10      // Rate limiting (submissions per minute)
    });

    // Fetch submissions data
    const { data: submissionsData, loading: submissionsLoading, error: submissionsError, refetch: refetchSubmissions } = useSubmissions(id || '', 1, 10);

    // Function to check if form data has changed
    const checkForChanges = () => {
        if (!form) return false;

        // Check current notification emails against form settings
        const currentEmails = form.settings?.notificationEmail ?
            form.settings.notificationEmail.split(',').filter(email => email.trim()) : [];

        const currentSpamProtection = form.settings?.spamProtection || { enabled: false, honeypot: false, rateLimit: 10 };

        return (
            editData.name !== form.name ||
            editData.description !== (form.description || '') ||
            editData.isActive !== form.isActive ||
            JSON.stringify(notificationEmails.sort()) !== JSON.stringify(currentEmails.sort()) ||
            redirectUrl !== (form.settings?.redirectUrl || '') ||
            spamProtection.enabled !== currentSpamProtection.enabled ||
            spamProtection.honeypot !== currentSpamProtection.honeypot ||
            spamProtection.rateLimit !== currentSpamProtection.rateLimit
        );
    };

    // Update hasChanges when editData, notificationEmails, redirectUrl, or spamProtection change
    React.useEffect(() => {
        setHasChanges(checkForChanges());
    }, [editData, form, notificationEmails, redirectUrl, spamProtection]);

    // Function to fetch real form statistics
    const fetchFormStatistics = async (formId: string) => {
        try {
            setStatisticsLoading(true);
            const response = await api.get(`/api/forms/${formId}/statistics`);
            setStatistics(response.data);
        } catch (error) {
            console.error('Failed to fetch form statistics:', error);
            // Don't set any statistics if API fails
            setStatistics(null);
        } finally {
            setStatisticsLoading(false);
        }
    };


    React.useEffect(() => {
        if (id) {
            const fetchFormData = async () => {
                try {
                    // Fetch real form data
                    const formData = await getFormById(id) as ApiForm;
                    if (formData) {
                        setForm({
                            ...formData,
                            settings: formData.settings || {
                                allowMultipleSubmissions: false,
                                requireEmailNotification: false
                            }
                        });
                        setEditData({
                            name: formData.name,
                            description: formData.description || '',
                            isActive: formData.isActive,
                        });

                        // Initialize notification emails from form settings
                        if (formData.settings?.notificationEmail) {
                            const existingEmails = formData.settings.notificationEmail.split(',').filter((email: string) => email.trim());
                            setNotificationEmails(existingEmails);
                        } else {
                            // Add current user's email as default if no emails are configured
                            const defaultEmails = user?.email ? [user.email] : [];
                            setNotificationEmails(defaultEmails);
                        }

                        // Initialize redirect URL from form settings
                        if (formData.settings?.redirectUrl) {
                            setRedirectUrl(formData.settings.redirectUrl);
                        } else {
                            // Set default redirect URL if none configured
                            setRedirectUrl('http://localhost:5173/success.html');
                        }

                        // Initialize spam protection settings from form data
                        // This loads the current spam protection configuration from the backend
                        if (formData.settings?.spamProtection) {
                            // Load existing spam protection settings
                            console.log('Loading existing spam protection settings:', formData.settings.spamProtection);
                            setSpamProtection(formData.settings.spamProtection);
                        } else {
                            // Set default spam protection settings if none exist
                            console.log('Setting default spam protection settings');
                            setSpamProtection({
                                enabled: false,    // CAPTCHA disabled by default
                                honeypot: false,   // Honeypot disabled by default
                                rateLimit: 10      // Default rate limit: 10 submissions per minute
                            });
                        }
                        // Fetch real statistics
                        await fetchFormStatistics(id);
                    } else {
                        console.error('Form not found');
                        // Don't set any form data if not found
                    }
                } catch (error) {
                    console.error('Failed to fetch form data:', error);
                    // Don't set any form data if error occurs
                }
            };

            fetchFormData();
        }
    }, [id]);

    const generateEndpointUrl = (endpointSlug: string) => {
        return `http://localhost:4001/api/f/${endpointSlug}`;
    };

    const formatSubmissionDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new':
                return 'bg-green-100 text-green-800';
            case 'read':
                return 'bg-blue-100 text-blue-800';
            case 'responded':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Selection handlers
    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedSubmissions(new Set());
            setIsAllSelected(false);
        } else {
            const allIds = new Set(submissionsData?.submissions.map(s => s.id) || []);
            setSelectedSubmissions(allIds);
            setIsAllSelected(true);
        }
    };

    const handleSelectSubmission = (submissionId: string, event?: React.MouseEvent) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const newSelected = new Set(selectedSubmissions);
        if (newSelected.has(submissionId)) {
            newSelected.delete(submissionId);
        } else {
            newSelected.add(submissionId);
        }
        setSelectedSubmissions(newSelected);
        setIsAllSelected(newSelected.size === (submissionsData?.submissions.length || 0));
    };

    const handleBulkDelete = async () => {
        if (selectedSubmissions.size === 0) return;

        if (window.confirm(`Are you sure you want to delete ${selectedSubmissions.size} submission(s)? This action cannot be undone.`)) {
            try {
                const response = await api.post('/api/submissions/bulk/delete', {
                    submissionIds: Array.from(selectedSubmissions)
                });

                if (response.data.success) {
                    // Clear selection and refresh data
                    setSelectedSubmissions(new Set());
                    setIsAllSelected(false);
                    // Refresh submissions data
                    refetchSubmissions();
                    // Show success message (you could add a toast notification here)
                    console.log(response.data.message);
                }
            } catch (error: any) {
                console.error('Failed to delete submissions:', error);
                // Show error message (you could add a toast notification here)
                alert(`Failed to delete submissions: ${error.response?.data?.message || error.message}`);
            }
        }
    };

    const handleBulkSpam = async () => {
        if (selectedSubmissions.size === 0) return;

        if (window.confirm(`Are you sure you want to mark ${selectedSubmissions.size} submission(s) as spam?`)) {
            try {
                const response = await api.post('/api/submissions/bulk/spam', {
                    submissionIds: Array.from(selectedSubmissions)
                });

                if (response.data.success) {
                    // Clear selection and refresh data
                    setSelectedSubmissions(new Set());
                    setIsAllSelected(false);
                    // Refresh submissions data
                    refetchSubmissions();
                    // Show success message (you could add a toast notification here)
                    console.log(response.data.message);
                }
            } catch (error: any) {
                console.error('Failed to mark submissions as spam:', error);
                // Show error message (you could add a toast notification here)
                alert(`Failed to mark submissions as spam: ${error.response?.data?.message || error.message}`);
            }
        }
    };

    const handleDeleteSubmission = async (submissionId: string) => {
        if (window.confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
            try {
                const response = await api.delete(`/api/submissions/${submissionId}`);

                if (response.data.success) {
                    // Refresh submissions data
                    refetchSubmissions();
                    // Show success message (you could add a toast notification here)
                    console.log('Submission deleted successfully');
                }
            } catch (error: any) {
                console.error('Failed to delete submission:', error);
                // Show error message (you could add a toast notification here)
                alert(`Failed to delete submission: ${error.response?.data?.message || error.message}`);
            }
        }
    };

    // Email notification functions
    const addNotificationEmail = () => {
        if (newEmail && !notificationEmails.includes(newEmail)) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(newEmail)) {
                setNotificationEmails(prev => [...prev, newEmail]);
                setNewEmail('');
                setHasChanges(true);
            } else {
                alert('Please enter a valid email address');
            }
        }
    };

    const removeNotificationEmail = (emailToRemove: string) => {
        setNotificationEmails(prev => prev.filter(email => email !== emailToRemove));
        setHasChanges(true);
    };

    const handleEmailKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addNotificationEmail();
        }
    };

    const handleCopy = (text: string, buttonKey: string) => {
        navigator.clipboard.writeText(text);

        // Show "Copied!" feedback
        setCopiedStates(prev => ({ ...prev, [buttonKey]: true }));

        // Reset after 2 seconds
        setTimeout(() => {
            setCopiedStates(prev => ({ ...prev, [buttonKey]: false }));
        }, 2000);
    };



    const handleSave = async () => {
        if (!form || !hasChanges) return;

        setSaving(true);
        setSaveError(null);

        try {
            const updateData = {
                name: editData.name,
                description: editData.description || null,
                isActive: editData.isActive,
                settings: {
                    ...form.settings,
                    notificationEmail: notificationEmails.length > 0 ? notificationEmails.join(',') : undefined,
                    redirectUrl: redirectUrl || undefined,
                    // Save spam protection settings to backend
                    // This is what the backend uses to determine which security checks to run
                    spamProtection: spamProtection,
                }
            };

            const updatedForm = await updateForm(form.id, updateData);
            if (updatedForm) {
                // Update the form state with the new data
                setForm({
                    ...form,
                    name: updatedForm.name,
                    description: updatedForm.description,
                    isActive: updatedForm.isActive,
                    updatedAt: updatedForm.updatedAt
                });
                setHasChanges(false);
                setSaveError(null);
            } else {
                setSaveError('Failed to save changes. Please try again.');
            }
        } catch (error) {
            console.error('Error saving form:', error);
            setSaveError('Failed to save changes. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditData({
            name: form?.name || '',
            description: form?.description || '',
            isActive: form?.isActive || true,
        });
        setHasChanges(false);
    };

    // Modal handling functions
    const handleViewSubmission = (submission: Submission) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('submission', submission.id);
        setSearchParams(newSearchParams);
    };

    const handleCloseModal = () => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('submission');
        setSearchParams(newSearchParams);
    };

    // Get selected submission from URL and submissions data
    const selectedSubmissionId = searchParams.get('submission');
    const selectedSubmission = selectedSubmissionId && submissionsData?.submissions
        ? submissionsData.submissions.find(sub => sub.id === selectedSubmissionId)
        : null;
    const isModalOpen = !!selectedSubmission;

    // Auto-switch to submissions tab when viewing a submission
    React.useEffect(() => {
        if (selectedSubmissionId && activeTab !== 'submissions') {
            setActiveTab('submissions');
        }
    }, [selectedSubmissionId, activeTab]);

    // Handle keyboard events for modal
    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isModalOpen) {
                handleCloseModal();
            }
        };

        if (isModalOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);




    if (!form) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading form details...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const renderOverviewTab = () => (
        <div className="space-y-6">

            {/* Endpoint Information Card */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Endpoint Information</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Endpoint URL</label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={generateEndpointUrl(form.endpointSlug)}
                                readOnly
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
                            />
                            <button
                                onClick={() => handleCopy(generateEndpointUrl(form.endpointSlug), 'endpoint-url')}
                                className="ml-2 px-3 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
                            >
                                {copiedStates['endpoint-url'] ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Form ID</label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={form.id}
                                readOnly
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
                            />
                            <button
                                onClick={() => handleCopy(form.id, 'form-id')}
                                className="ml-2 px-3 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
                            >
                                {copiedStates['form-id'] ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Statistics Card */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Form Statistics</h3>
                {statisticsLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
                    </div>
                ) : statistics ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                                {statistics.totalSubmissions || 0}
                            </div>
                            <div className="text-sm text-gray-500">Total Submissions</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                                {statistics.thisWeekSubmissions || 0}
                            </div>
                            <div className="text-sm text-gray-500">This Week</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                                {statistics.spamRate ? statistics.spamRate.toFixed(1) : '0.0'}%
                            </div>
                            <div className="text-sm text-gray-500">Spam Rate</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                                {statistics.createdDate ? formatCreatedDate(statistics.createdDate) : 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">Created</div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Failed to load statistics</p>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                {/* HTML Form Snippet */}
                <h3 className="text-lg font-medium text-gray-900 mb-4">How to use</h3>
                <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">HTML Form Snippet</h3>
                    <div className="rounded-lg overflow-hidden">
                        <SyntaxHighlighter
                            language="html"
                            style={tomorrow}
                            customStyle={{
                                margin: 0,
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem'
                            }}
                        >
                            {`<form action="${generateEndpointUrl(form.endpointSlug)}" method="POST">
    <input type="text" name="name" placeholder="Your Name" required>
    <input type="email" name="email" placeholder="Your Email" required>
    <textarea name="message" placeholder="Your Message" required></textarea>
    <button type="submit">Send Message</button>
</form>`}
                        </SyntaxHighlighter>
                    </div>
                    <button
                        onClick={() => handleCopy(`<form action="${generateEndpointUrl(form.endpointSlug)}" method="POST">
    <input type="text" name="name" placeholder="Your Name" required>
    <input type="email" name="email" placeholder="Your Email" required>
    <textarea name="message" placeholder="Your Message" required></textarea>
    <button type="submit">Send Message</button>
</form>`, 'html-code')}
                        className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
                    >
                        {copiedStates['html-code'] ? 'Copied!' : 'Copy HTML Code'}
                    </button>
                </div>

                {/* JavaScript Snippet */}
                <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">JavaScript (Async Submission)</h3>
                    <div className="rounded-lg overflow-hidden">
                        <SyntaxHighlighter
                            language="javascript"
                            style={tomorrow}
                            customStyle={{
                                margin: 0,
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem'
                            }}
                        >
                            {`const form = document.getElementById('myForm');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    
    try {
        const response = await fetch('${generateEndpointUrl(form.endpointSlug)}', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            alert('Form submitted successfully!');
            form.reset();
        }
    } catch (error) {
        alert('Error submitting form');
    }
});`}
                        </SyntaxHighlighter>
                    </div>
                    <button
                        onClick={() => handleCopy(`const form = document.getElementById('myForm');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    
    try {
        const response = await fetch('${generateEndpointUrl(form.endpointSlug)}', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            alert('Form submitted successfully!');
            form.reset();
        }
    } catch (error) {
        alert('Error submitting form');
    }
});`, 'javascript-code')}
                        className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
                    >
                        {copiedStates['javascript-code'] ? 'Copied!' : 'Copy JavaScript Code'}
                    </button>
                </div>
            </div>

            {/* File Upload Section */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">With File Upload</h3>
                <p className="text-sm text-gray-600 mb-6">
                    Use these code snippets if you want to include file upload functionality in your form.
                </p>

                {/* HTML Form with File Upload */}
                <div className="mb-8">
                    <h4 className="text-md font-medium text-gray-800 mb-3">HTML Form (with file upload)</h4>
                    <div className="rounded-lg overflow-hidden">
                        <SyntaxHighlighter
                            language="html"
                            style={tomorrow}
                            customStyle={{
                                margin: 0,
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem'
                            }}
                        >
                            {`<form action="${generateEndpointUrl(form.endpointSlug)}" method="POST" enctype="multipart/form-data">
    <input type="text" name="name" placeholder="Your Name" required>
    <input type="email" name="email" placeholder="Your Email" required>
    <textarea name="message" placeholder="Your Message" required></textarea>
    <input type="file" name="attachment" accept="image/*,.pdf">
    <button type="submit">Send Message</button>
</form>`}
                        </SyntaxHighlighter>
                    </div>
                    <button
                        onClick={() => handleCopy(`<form action="${generateEndpointUrl(form.endpointSlug)}" method="POST" enctype="multipart/form-data">
    <input type="text" name="name" placeholder="Your Name" required>
    <input type="email" name="email" placeholder="Your Email" required>
    <textarea name="message" placeholder="Your Message" required></textarea>
    <input type="file" name="attachment" accept="image/*,.pdf">
    <button type="submit">Send Message</button>
</form>`, 'file-upload-html')}
                        className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
                    >
                        {copiedStates['file-upload-html'] ? 'Copied!' : 'Copy HTML with File Upload'}
                    </button>
                </div>

                {/* JavaScript with File Upload */}
                <div>
                    <h4 className="text-md font-medium text-gray-800 mb-3">JavaScript (with file upload)</h4>
                    <div className="rounded-lg overflow-hidden">
                        <SyntaxHighlighter
                            language="javascript"
                            style={tomorrow}
                            customStyle={{
                                margin: 0,
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem'
                            }}
                        >
                            {`const form = document.getElementById('myForm');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    
    try {
        const response = await fetch('${generateEndpointUrl(form.endpointSlug)}', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            alert('Form submitted successfully!');
            form.reset();
        } else {
            alert('Error submitting form');
        }
    } catch (error) {
        alert('Error submitting form');
    }
});`}
                        </SyntaxHighlighter>
                    </div>
                    <button
                        onClick={() => handleCopy(`const form = document.getElementById('myForm');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    
    try {
        const response = await fetch('${generateEndpointUrl(form.endpointSlug)}', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            alert('Form submitted successfully!');
            form.reset();
        } else {
            alert('Error submitting form');
        }
    } catch (error) {
        alert('Error submitting form');
    }
});`, 'file-upload-js')}
                        className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
                    >
                        {copiedStates['file-upload-js'] ? 'Copied!' : 'Copy JavaScript with File Upload'}
                    </button>
                </div>
            </div>

        </div>
    );




    // Function to extract all unique field names from submissions
    const getAllFieldNames = (submissions: any[]) => {
        const fieldNames = new Set<string>();

        submissions.forEach(submission => {
            // Add ALL fields from formData - completely dynamic
            if (submission.payload && typeof submission.payload === 'object') {
                Object.keys(submission.payload).forEach(key => {
                    fieldNames.add(key);
                });
            }
        });

        return Array.from(fieldNames).sort();
    };

    // Function to get field value from submission
    const getFieldValue = (submission: any, fieldName: string) => {
        if (fieldName === 'submitted') return formatSubmissionDate(submission.createdAt);
        if (fieldName === 'status') return submission.status;

        // Get from formData/payload - all fields are stored here now
        if (submission.payload && submission.payload[fieldName] !== undefined) {
            const value = submission.payload[fieldName];

            // Handle file upload fields (array of file objects)
            if (Array.isArray(value) && value.length > 0 && value[0]?.filename) {
                return `${value.length} file${value.length > 1 ? 's' : ''} uploaded`;
            }

            // Handle single file object
            if (value && typeof value === 'object' && value.filename) {
                return '1 file uploaded';
            }

            // Handle long text content
            if (typeof value === 'string' && value.length > 50) {
                return value.substring(0, 50) + '...';
            }

            return value;
        }

        return 'N/A';
    };

    // Function to format field name for display
    const formatFieldName = (fieldName: string) => {
        if (fieldName === 'submitted') return 'Submitted';
        if (fieldName === 'status') return 'Status';

        return fieldName
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
            .trim();
    };

    const renderSubmissionsTab = () => {
        // Get all unique field names from submissions
        const allFieldNames = submissionsData ? getAllFieldNames(submissionsData.submissions) : [];

        // Define the order of columns (all dynamic fields, then system fields)
        const columnOrder = [
            ...allFieldNames, // All form fields dynamically
            'submitted',
            'status'
        ];

        return (
            <div className="space-y-6">
                {/* Recent Submissions */}
                <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Recent Submissions</h3>
                        {submissionsData && (
                            <span className="text-sm text-gray-500">
                                {submissionsData.pagination.total} total submissions
                            </span>
                        )}
                    </div>

                    {submissionsLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
                        </div>
                    ) : submissionsError ? (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load submissions</h3>
                            <p className="text-gray-500 mb-4">{submissionsError}</p>
                            <button
                                onClick={refetchSubmissions}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : !submissionsData || submissionsData.submissions.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
                            <p className="text-gray-500">Submissions will appear here once users start submitting to your form.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Bulk Actions Bar */}
                            {selectedSubmissions.size > 0 && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium text-red-800">
                                            {selectedSubmissions.size} submission{selectedSubmissions.size > 1 ? 's' : ''} selected
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={handleBulkSpam}
                                            className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
                                        >
                                            Mark as Spam
                                        </button>
                                        <button
                                            onClick={handleBulkDelete}
                                            className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedSubmissions(new Set());
                                                setIsAllSelected(false);
                                            }}
                                            className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-800"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Table */}
                            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {/* Selection Column */}
                                            <th className="w-12 px-4 py-3">
                                                <button
                                                    onClick={handleSelectAll}
                                                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${isAllSelected
                                                        ? 'bg-red-500 border-red-500 text-white'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                        }`}
                                                >
                                                    {isAllSelected && (
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </th>


                                            {/* Dynamic Data Columns */}
                                            {columnOrder.map((fieldName) => (
                                                <th key={fieldName} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {formatFieldName(fieldName)}
                                                </th>
                                            ))}

                                            {/* Actions Column */}
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {submissionsData.submissions.map((submission) => (
                                            <tr key={submission.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                {/* Selection Checkbox */}
                                                <td className="px-4 py-4">
                                                    <button
                                                        onClick={(e) => handleSelectSubmission(submission.id, e)}
                                                        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${selectedSubmissions.has(submission.id)
                                                            ? 'bg-red-500 border-red-500 text-white'
                                                            : 'border-gray-300 hover:border-gray-400'
                                                            }`}
                                                    >
                                                        {selectedSubmissions.has(submission.id) && (
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                </td>


                                                {/* Dynamic Data Cells */}
                                                {columnOrder.map((fieldName) => (
                                                    <td key={fieldName} className="px-6 py-4 text-sm text-gray-900">
                                                        {fieldName === 'submitted' ? (
                                                            <span className="text-gray-500">
                                                                {formatSubmissionDate(submission.createdAt)}
                                                            </span>
                                                        ) : fieldName === 'status' ? (
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                                                                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-900">
                                                                {getFieldValue(submission, fieldName)}
                                                            </span>
                                                        )}
                                                    </td>
                                                ))}

                                                {/* Actions Cell */}
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    <div className="flex items-center space-x-3">
                                                        <button
                                                            onClick={() => handleViewSubmission(submission)}
                                                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteSubmission(submission.id)}
                                                            className="text-red-600 hover:text-red-800 font-medium transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderSettingsTab = () => (
        <div className="space-y-6">
            {/* Form Configuration */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Form Configuration</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Form Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description <span className="text-gray-400">(Optional)</span>
                        </label>
                        <textarea
                            value={editData.description}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                            placeholder="Enter a description for your form (optional)"
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={editData.isActive}
                            onChange={(e) => setEditData({ ...editData, isActive: e.target.checked })}
                            className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                            Form is active
                        </label>
                    </div>

                    {saveError && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-800">{saveError}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex space-x-3 pt-4 border-t border-gray-200">
                        <button
                            onClick={handleSave}
                            disabled={!hasChanges || saving}
                            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center ${hasChanges && !saving
                                ? 'bg-gray-900 text-white hover:bg-gray-800'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {saving && (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={!hasChanges || saving}
                            className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${hasChanges && !saving
                                ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                : 'border-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

            {/* Endpoint Information */}
            {/* Endpoint Information Card */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Endpoint Information</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Endpoint URL</label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={generateEndpointUrl(form.endpointSlug)}
                                readOnly
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
                            />
                            <button
                                onClick={() => handleCopy(generateEndpointUrl(form.endpointSlug), 'endpoint-url')}
                                className="ml-2 px-3 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
                            >
                                {copiedStates['endpoint-url'] ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Form ID</label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={form.id}
                                readOnly
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
                            />
                            <button
                                onClick={() => handleCopy(form.id, 'form-id')}
                                className="ml-2 px-3 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
                            >
                                {copiedStates['form-id'] ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Email Notifications */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-gray-900">Enable Notifications</div>
                            <div className="text-sm text-gray-500">Send email alerts when forms are submitted</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.settings?.requireEmailNotification || false}
                                onChange={(e) => {
                                    // Update the form settings directly
                                    setForm(prev => prev ? {
                                        ...prev,
                                        settings: {
                                            ...prev.settings,
                                            requireEmailNotification: e.target.checked
                                        }
                                    } : null);
                                    setHasChanges(true);
                                }}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notification Recipients</label>
                        <div className="space-y-2">
                            {notificationEmails.length > 0 ? (
                                notificationEmails.map((email, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                        <span className="text-sm text-gray-900">{email}</span>
                                        <button
                                            onClick={() => removeNotificationEmail(email)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-gray-500">No recipients configured</div>
                            )}
                            <div className="flex space-x-2">
                                <input
                                    type="email"
                                    placeholder={user?.email || "Add email address"}
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    onKeyPress={handleEmailKeyPress}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                                />
                                <button
                                    onClick={addNotificationEmail}
                                    className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Redirect Settings */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Redirect Settings</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Success Redirect URL <span className="text-gray-400">(Optional)</span>
                        </label>
                        <input
                            type="url"
                            placeholder="http://localhost:5173/success.html"
                            value={redirectUrl}
                            onChange={(e) => {
                                setRedirectUrl(e.target.value);
                                setHasChanges(true);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            URL to redirect users after successful form submission. If not set, users will see a default success page.
                        </p>
                    </div>
                </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                <div className="space-y-6">
                    {/* CAPTCHA Toggle - Master switch for all spam protection */}
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-gray-900">Enable CAPTCHA</div>
                            <div className="text-sm text-gray-500">
                                Enable Google reCAPTCHA "I'm not a robot" verification
                                {spamProtection.enabled && (
                                    <span className="text-green-600 font-medium"> • Active</span>
                                )}
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={spamProtection.enabled}
                                onChange={(e) => {
                                    // Toggle the master CAPTCHA switch
                                    // This enables/disables all spam protection features
                                    console.log('CAPTCHA toggle changed:', e.target.checked);
                                    setSpamProtection(prev => ({
                                        ...prev,
                                        enabled: e.target.checked // Master toggle for spam protection
                                    }));
                                }}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Allowed Domains (CORS)</label>
                        <input
                            type="text"
                            placeholder="example.com, app.example.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                        />
                        <p className="mt-1 text-sm text-gray-500">Comma-separated list of allowed domains</p>
                    </div>

                    {/* Honeypot Setting */}
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-gray-900">Enable Honeypot</div>
                            <div className="text-sm text-gray-500">Add hidden field to catch bots</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={spamProtection.honeypot}
                                onChange={(e) => {
                                    setSpamProtection(prev => ({
                                        ...prev,
                                        honeypot: e.target.checked
                                    }));
                                }}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                        </label>
                    </div>

                    {/* Rate Limiting */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rate Limiting (submissions per minute)</label>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={spamProtection.rateLimit}
                            onChange={(e) => {
                                setSpamProtection(prev => ({
                                    ...prev,
                                    rateLimit: parseInt(e.target.value) || 10
                                }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                        />
                        <p className="mt-1 text-sm text-gray-500">Maximum submissions allowed per IP per minute</p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.726-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">Security Best Practices</h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Enable CAPTCHA for public forms</li>
                                        <li>Set appropriate rate limits based on expected traffic</li>
                                        <li>Configure CORS to restrict access to your domains only</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );



    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return renderOverviewTab();
            case 'submissions':
                return renderSubmissionsTab();
            case 'settings':
                return renderSettingsTab();
            default:
                return renderOverviewTab();
        }
    };

    return (
        <DashboardLayout>
            <div className=" md:w-[80%] w-full">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex ">
                        <div>
                            <button
                                onClick={() => navigate('/dashboard/forms')}
                                className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Forms
                            </button>
                            <h1 className="text-3xl font-bold text-gray-900">{form.name}</h1>
                        </div>

                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-gray-200 mb-8">
                    <nav className="-mb-px flex space-x-2 sm:space-x-4 md:space-x-8 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center py-1 sm:py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-gray-900 text-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                                </svg>
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                {renderTabContent()}

                {/* Submission Details Modal */}
                {isModalOpen && selectedSubmission && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={handleCloseModal}
                    >
                        <div
                            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900">Submission Details</h3>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-120px)]">
                                <div className="space-y-6">
                                    {/* Submission Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Submission ID</label>
                                            <p className="text-sm text-gray-900 font-mono">{selectedSubmission.id}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedSubmission.status)}`}>
                                                {selectedSubmission.status.charAt(0).toUpperCase() + selectedSubmission.status.slice(1)}
                                            </span>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Submitted</label>
                                            <p className="text-sm text-gray-900">{formatSubmissionDate(selectedSubmission.createdAt)}</p>
                                        </div>
                                    </div>

                                    {/* Form Data */}
                                    <div>
                                        <h4 className="text-md font-medium text-gray-900 mb-3">Form Data</h4>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="grid grid-cols-1 gap-3">
                                                {Object.entries(selectedSubmission.payload).map(([key, value]) => (
                                                    <div key={key} className="flex flex-col sm:flex-row sm:items-center">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-0 sm:w-1/3 sm:pr-4">
                                                            {formatFieldName(key)}
                                                        </label>
                                                        <div className="flex-1">
                                                            {typeof value === 'string' && value.length > 100 ? (
                                                                <div className="bg-white rounded border p-3">
                                                                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{value}</p>
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm text-gray-900">{String(value)}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Raw JSON (Optional) */}
                                    <div>
                                        <h4 className="text-md font-medium text-gray-900 mb-3">Raw Data</h4>
                                        <div className="bg-gray-900 rounded-lg overflow-hidden">
                                            <SyntaxHighlighter
                                                language="json"
                                                style={tomorrow}
                                                customStyle={{
                                                    margin: 0,
                                                    fontSize: '0.875rem',
                                                    padding: '1rem'
                                                }}
                                            >
                                                {JSON.stringify(selectedSubmission.payload, null, 2)}
                                            </SyntaxHighlighter>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => {
                                            if (selectedSubmission.status === 'new') {
                                                // Mark as read logic here
                                                console.log('Mark as read:', selectedSubmission.id);
                                            }
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                    >
                                        Mark as Read
                                    </button>
                                    <button
                                        onClick={() => {
                                            // Mark as responded logic here
                                            console.log('Mark as responded:', selectedSubmission.id);
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
                                    >
                                        Mark as Responded
                                    </button>
                                </div>
                                <button
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
