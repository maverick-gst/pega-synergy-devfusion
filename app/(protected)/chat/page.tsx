'use client'
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Chat from './components/chat';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import FileUploader from '@/components/FileUploader';
import FileExplorer from '@/components/FileExplorer';

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
};

const queryClient = new QueryClient();

export default function CreatorPage() {
    const params = useParams();
    const productId = params?.productId as string;

    const [currentStep, setCurrentStep] = useState(0);
    const [notes, setNotes] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isFilesOpen, setIsFilesOpen] = useState(false);

    const chatMutation = useMutation({
        mutationFn: async (message: string) => {
            if (!productId) {
                throw new Error('Product ID is missing');
            }
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message, productId }),
            });
            const response_json = await response.json();
            console.log("Response:", response_json);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response_json;
        },
        onSuccess: (data) => {
            console.log("Response:", data);
            const newMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: data.response,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, newMessage]);
            // Update step if necessary
            const stepUpdateMatch = data.response.match(/Step (\d+)/);
            if (stepUpdateMatch) {
                const newStep = parseInt(stepUpdateMatch[1]) - 1;
                setCurrentStep(newStep);
            }
        },
        onError: (error) => {
            console.error('Error in chat:', error);
            const errorMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: "Sorry, an error occurred. Please try again.",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        },
    });

    const handleSendMessage = (message: string) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: message,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, newMessage]);
        chatMutation.mutate(message);
    };

    const handleFileUpload = () => {
        // This function will be called after a successful file upload
        queryClient.invalidateQueries({ queryKey: ['files', productId] });
    };

    if (!productId) {
        return <div>Error: Product ID is missing</div>;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <div className="flex h-screen bg-gray-50 font-sans">
                {/* Left side - Chat Window */}
                <div className="w-1/2 p-4 flex flex-col">
                    <Chat
                        productId={productId}
                        messages={messages}
                        isLoading={chatMutation.isPending}
                        onSendMessage={handleSendMessage}
                    />
                </div>
                {/* Right side - Steps and Files */}
                <div className="w-1/2 p-4 flex flex-col relative">
                    
                    <motion.button
                        className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg z-50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsFilesOpen(!isFilesOpen)}
                    >
                        {isFilesOpen ? 'Close Files' : 'Open Files'}
                    </motion.button>
                    <AnimatePresence>
                        {isFilesOpen && (
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg p-6 overflow-auto"
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 500 }}
                                style={{ maxHeight: "80%" }}
                            >
                                <h3 className="text-xl font-bold text-blue-800 mb-4">Files</h3>
                                <FileUploader 
                                    productId={productId}
                                    stepId={currentStep + 1}
                                    onFileUpload={handleFileUpload}
                                />
                                <FileExplorer
                                    productId={productId}
                                    stepId={currentStep + 1}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </QueryClientProvider>
    );
}
