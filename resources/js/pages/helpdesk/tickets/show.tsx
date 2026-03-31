import { useState, useEffect, useRef } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import ChatMessage from '../components/ChatMessage';
import ReplyForm from '../components/ReplyForm';
import { formatDate } from '@/utils/helpers';
import { ShowHelpdeskTicketProps, HelpdeskReply } from './types';

export default function Show() {
    const { ticket, auth } = usePage<ShowHelpdeskTicketProps>().props;
    const { t } = useTranslation();
    const [replies, setReplies] = useState<HelpdeskReply[]>(ticket.replies || []);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, replyId: null as number | null });

    const isOwnReply = (reply: HelpdeskReply) => {
        const currentUserId = auth.user?.id;
        if (currentUserId == null) return false;

        const replyUserId = reply.created_by ?? reply.creator?.id;
        if (replyUserId == null) return false;

        return Number(replyUserId) === Number(currentUserId);
    };


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [replies]);

    const handleReplyAdded = (newReply: HelpdeskReply) => {
        setReplies(prev => [...prev, newReply]);
    };

    const handleDeleteReply = (replyId: number) => {
        setDeleteDialog({ isOpen: true, replyId });
    };

    const confirmDeleteReply = async () => {
        if (!deleteDialog.replyId) return;

        try {
            const response = await fetch(route('helpdesk-replies.destroy', deleteDialog.replyId), {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();

            if (data.success) {
                setReplies(prev => prev.filter(reply => reply.id !== deleteDialog.replyId));
                setDeleteDialog({ isOpen: false, replyId: null });
                // Show success message
                router.reload({ only: [], onSuccess: () => {
                    // Flash message from controller will be displayed
                }});
            }
        } catch (error) {
            console.error('Error deleting reply:', error);
        }
    };

    const getStatusBadge = (status: string) => {
        const colors = {
            open: 'bg-blue-100 text-blue-800',
            in_progress: 'bg-yellow-100 text-yellow-800',
            resolved: 'bg-green-100 text-green-800',
            closed: 'bg-gray-100 text-gray-800'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-sm ${colors[status as keyof typeof colors]}`}>
                {t(status.replace('_', ' '))}
            </span>
        );
    };

    const getPriorityBadge = (priority: string) => {
        const colors = {
            low: 'bg-green-100 text-green-800',
            medium: 'bg-yellow-100 text-yellow-800',
            high: 'bg-orange-100 text-orange-800',
            urgent: 'bg-red-100 text-red-800'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-sm ${colors[priority as keyof typeof colors]}`}>
                {t(priority)}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                {label: 'Support Tickets', url: route('helpdesk-tickets.index')},
                {label: `#${ticket.ticket_id} - ${ticket.title}`}
            ]}
            pageTitle={`Ticket #${ticket.ticket_id}`}
        >
            <Head title={`Ticket #${ticket.ticket_id} - ${ticket.title}`} />

            {/* Ticket Header */}
            <Card className="mb-6 overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="min-w-0 flex-1">
                            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <h1 className="break-words text-xl font-bold text-gray-900 sm:text-2xl">#{ticket.ticket_id} - {ticket.title}</h1>
                                <div className="flex flex-wrap gap-2">
                                    {getStatusBadge(ticket.status)}
                                    {getPriorityBadge(ticket.priority)}
                                </div>
                            </div>
                            <div className="prose prose-sm max-w-none break-words text-gray-700 overflow-hidden [&_*]:max-w-full [&_img]:h-auto [&_img]:max-w-full [&_pre]:whitespace-pre-wrap [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto" dangerouslySetInnerHTML={{ __html: ticket.description }} />
                        </div>

                        <div className="w-full space-y-4 lg:w-80">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="min-w-0">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t('Category')}</label>
                                    <p className="mt-1 break-words text-sm font-medium text-gray-900">{ticket.category?.name || '-'}</p>
                                </div>
                                <div className="min-w-0">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t('Created By')}</label>
                                    <p className="mt-1 break-words text-sm font-medium text-gray-900">{ticket.creator?.name}</p>
                                </div>
                            </div>
                            <div className="min-w-0">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t('Created At')}</label>
                                <p className="mt-1 break-words text-sm font-medium text-gray-900">{formatDate(ticket.created_at)}</p>
                            </div>
                            {ticket.assignedTo && (
                                <div className="min-w-0">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t('Assigned To')}</label>
                                    <p className="mt-1 break-words text-sm font-medium text-gray-900">{ticket.assignedTo.name}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Full Page Conversation */}
            <Card className="flex min-h-[60vh] flex-col overflow-hidden lg:h-[calc(100vh-50px)]">
                <CardHeader className="border-b bg-gray-50/50 py-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="text-lg font-semibold">{t('Conversation')}</CardTitle>
                        <div className="text-sm text-gray-500">
                            {replies.length} {replies.length === 1 ? t('message') : t('messages')}
                        </div>
                    </div>
                </CardHeader>

                {/* Messages Area - Full Height */}
                <CardContent className="flex-1 overflow-y-auto p-0">
                    <div className="h-full flex flex-col">
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            {replies.length === 0 ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">{t('No messages yet')}</h3>
                                        <p className="text-gray-500">{t('Start the conversation by sending a message below.')}</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {replies
                                        .filter(reply => !reply.is_internal || auth.user?.type === 'superadmin')
                                        .map((reply) => (
                                        <ChatMessage
                                            key={reply.id}
                                            reply={reply}
                                            isOwnMessage={isOwnReply(reply)}
                                            onDelete={handleDeleteReply}
                                            canDelete={auth.user?.permissions?.includes('delete-helpdesk-replies')}
                                        />
                                    ))}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                        {/* Reply Form - Fixed at Bottom */}
                        {auth.user?.permissions?.includes('create-helpdesk-replies') && (
                            <div className="border-t bg-white">
                                <ReplyForm
                                    ticketId={ticket.id}
                                    onReplyAdded={handleReplyAdded}
                                    disabled={ticket.status === 'closed'}
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <ConfirmationDialog
                open={deleteDialog.isOpen}
                onOpenChange={(open) => setDeleteDialog({ isOpen: open, replyId: null })}
                title={t('Delete Reply')}
                message={t('Are you sure you want to delete this reply?')}
                confirmText={t('Delete')}
                onConfirm={confirmDeleteReply}
                variant="destructive"
            />
        </AuthenticatedLayout>
    );
}
