import React, { useState, useEffect, useCallback, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, doc, addDoc, setDoc, onSnapshot, query, deleteDoc, writeBatch, getDocs, where, serverTimestamp, Timestamp, updateDoc, arrayUnion, runTransaction } from 'firebase/firestore';

// --- Helper Functions & Configuration ---
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : { apiKey: "your-api-key", authDomain: "your-auth-domain", projectId: "your-project-id" };
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-jocco-clone';

// --- Firebase Initialization ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Color Palettes & Generators ---
const PASTEL_BG_COLORS =     ['#FFF9C4', '#F8BBD0', '#D1C4E9', '#C8E6C9', '#B3E5FC', '#FFCCBC'];
const DARK_PASTEL_BG_COLORS = ['#5C5B3A', '#6E3F51', '#4F4963', '#425C44', '#3A5B6B', '#6E4D43'];

const generateRandomVibrantColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 80%, 60%)`;
};


// --- Google Font Loader ---
const loadGoogleFonts = () => {
    const fontFamilies = 'Bitcount+Prop+Double:wght@400;700&family=Roboto:wght@400;500;700';
    if (!document.querySelector(`link[href*="Bitcount"]`)) {
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${fontFamilies}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }
};

// --- SVG Icons ---
const PlusIcon = ({ className = "h-5 w-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>);
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>);
const SparklesIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 2a1 1 0 011 1v1.158a3.985 3.985 0 013.707 4.565l.5 1.5a.5.5 0 00.94-.31l.5-1.5a3.985 3.985 0 013.707-4.565V3a1 1 0 112 0v1.158a5.985 5.985 0 01-5.56 6.818l-.5 1.5a.5.5 0 00.94.31l.5-1.5a5.985 5.985 0 015.56-6.818V3a1 1 0 112 0v1.158a3.985 3.985 0 013.707 4.565l.5 1.5a.5.5 0 00.94-.31l.5-1.5a3.985 3.985 0 013.707-4.565V3a1 1 0 112 0v1.158a5.985 5.985 0 01-5.56 6.818l-.5 1.5a.5.5 0 00.94.31l.5-1.5a5.985 5.985 0 015.56-6.818zM5 2a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" /></svg>);
const UserIcon = ({ name }) => { const i=name?name[0].toUpperCase():'?'; const c=['bg-red-500','bg-blue-500','bg-green-500','bg-yellow-500','bg-purple-500','bg-pink-500'][i.charCodeAt(0)%6]; return <div className={`w-8 h-8 rounded-full ${c} flex items-center justify-center text-white font-bold text-sm`}>{i}</div>; };
const SunIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>);
const MoonIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>);
const LinkIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>);
const MenuIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>);
const SearchIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>);

// --- Components ---

const InfoModal = ({ title, children, isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 relative text-gray-800 dark:text-gray-200">
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <div className="prose dark:prose-invert max-w-none text-sm">{children}</div>
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </div>
    );
};

const TicketModal = ({ isOpen, onClose, onSave, ticket }) => {
    const [formData, setFormData] = useState({});
    const [linksInput, setLinksInput] = useState('');
    const [checklistItem, setChecklistItem] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const initialData = {
            title: '', description: '', assignee: '',
            priority: 'Medium', storyPoints: 0, startDate: '', endDate: '', links: [], checklist: []
        };
        const currentData = ticket ? { ...initialData, ...ticket } : initialData;
        setFormData(currentData);
        setLinksInput((currentData.links || []).map(link => link.url).join(', '));
    }, [ticket, isOpen]);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleGenerateDescription = async () => {
        if (!formData.title.trim()) return;
        setIsGenerating(true);
        const prompt = `Generate a professional and concise ticket description for a software development task titled "${formData.title}". The output must be only the description text. Do not include the title, headings, or any introductory phrases.`;
        try {
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            const payload = { contents: [{ parts: [{ text: prompt }] }] };
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            const result = await response.json();
            if (result.candidates?.[0]?.content.parts?.[0]) {
                setFormData(prev => ({ ...prev, description: result.candidates[0].content.parts[0].text.trim() }));
            }
        } catch (error) { console.error("Error generating description:", error); } 
        finally { setIsGenerating(false); }
    };

    const handleAddChecklistItem = () => {
        if (checklistItem.trim()) {
            const newItem = { text: checklistItem.trim(), completed: false };
            setFormData(prev => ({ ...prev, checklist: [...(prev.checklist || []), newItem] }));
            setChecklistItem('');
        }
    };
    
    const handleRemoveChecklistItem = (index) => {
        setFormData(prev => ({
            ...prev,
            checklist: prev.checklist.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;
        
        const parsedLinks = linksInput.split(',')
            .map((urlStr) => {
                let url = urlStr.trim();
                if (url && !/^https?:\/\//i.test(url)) url = 'https://' + url;
                return { url };
            })
            .filter(link => link.url);

        const existingLinks = (formData.links || []).reduce((acc, link) => ({ ...acc, [link.url]: link.name }), {});
        const mergedLinks = parsedLinks.map((newLink, index) => ({ ...newLink, name: existingLinks[newLink.url] || `Link ${index + 1}` }));

        onSave({ ...formData, links: mergedLinks });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6 text-gray-800 dark:text-gray-200">
                <h2 className="text-2xl font-bold mb-6">{ticket ? 'Edit Ticket' : 'Create New Ticket'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-bold mb-2">Title</label>
                        <input id="title" name="title" type="text" value={formData.title || ''} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                    </div>
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                           <label htmlFor="description" className="block text-sm font-bold">Description</label>
                           <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"> <SparklesIcon /><span className="ml-1">{isGenerating ? 'Generating...' : '✨ Generate with AI'}</span></button>
                        </div>
                        <textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 h-24 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                     <div className="mb-4">
                        <label htmlFor="checklist" className="block text-sm font-bold mb-2">Checklist</label>
                        <div className="flex">
                            <input id="checklist" type="text" value={checklistItem} onChange={(e) => setChecklistItem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddChecklistItem())} className="shadow appearance-none border rounded-l w-full py-2 px-3 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            <button type="button" onClick={handleAddChecklistItem} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-r hover:bg-blue-600">Add</button>
                        </div>
                        <ul className="mt-2 text-sm">
                            {(formData.checklist || []).map((item, index) => (
                                <li key={index} className="flex items-center justify-between p-1">
                                    <span>{item.text}</span>
                                    <button type="button" onClick={() => handleRemoveChecklistItem(index)} className="text-red-500 hover:text-red-700">
                                        <TrashIcon />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div className="mb-4">
                        <label htmlFor="links" className="block text-sm font-bold mb-2">Links (comma-separated)</label>
                        <textarea id="links" name="links" value={linksInput} onChange={(e) => setLinksInput(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 h-20 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {Object.entries({assignee: 'text', priority: 'select', storyPoints: 'number', startDate: 'date', endDate: 'date'}).map(([key, type]) => (
                            <div key={key}>
                                <label htmlFor={key} className="block text-sm font-bold mb-2 capitalize">{key.replace('Date', ' Date').replace('Points', ' Points')}</label>
                                {type === 'select' ? (
                                    <select id={key} name={key} value={formData[key] || 'Medium'} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                        <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option>
                                    </select>
                                ) : (
                                    <input id={key} name={key} type={type} value={formData[key] || ''} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">{ticket ? 'Save Changes' : 'Create Ticket'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Ticket = ({ ticket, onSelect, onDragStart, dragMode }) => (
    <div draggable={dragMode === 'ticket'} onDragStart={(e) => onDragStart(e, ticket.id)} onClick={() => onSelect(ticket)}
        className={`bg-white dark:bg-gray-700 rounded-md shadow-sm p-4 mb-3 border-l-4 transition-shadow duration-200 ${dragMode === 'ticket' ? 'cursor-grab' : 'cursor-pointer'} hover:shadow-lg` }
        style={{ borderColor: ticket.accentColor || '#6B7280' }}>
        <div className="flex justify-between items-start">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 pr-2">{ticket.title}</h4>
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400 flex-shrink-0">{ticket.ticketId}</span>
        </div>
        <div className="flex justify-between items-center mt-3">
            {ticket.assignee ? <UserIcon name={ticket.assignee} /> : <div/>}
            {ticket.storyPoints > 0 && <span className="text-xs font-bold bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-full">{ticket.storyPoints}</span>}
        </div>
    </div>
);

const Column = ({ column, tickets, onTicketDrop, onSelectTicket, onDragStart, onTitleChange, onColorChange, isFirstColumn, theme, onColumnDragStart, onColumnDrop, dragMode }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(column.title);

    const handleTitleBlur = () => {
        setIsEditing(false);
        if (title.trim() && title !== column.title) onTitleChange(column.id, title.trim());
        else setTitle(column.title);
    };

    const getColumnBgColor = () => {
        if (theme === 'dark') {
            if (isFirstColumn) return '#1F2937'; // Dark gray for "To Do"
            const lightColorIndex = PASTEL_BG_COLORS.indexOf(column.bgColor);
            return lightColorIndex !== -1 ? DARK_PASTEL_BG_COLORS[lightColorIndex] : '#2D3748'; // Dark pastel or fallback
        }
        return column.bgColor; // Light theme color
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.getData('ticketId') && dragMode === 'ticket') {
            onTicketDrop(e, column.title);
        } else if (e.dataTransfer.getData('columnId') && dragMode === 'column') {
            onColumnDrop(e, column.id);
        }
    };

    return (
        <div draggable={dragMode === 'column'} onDragStart={(e) => onColumnDragStart(e, column.id)} onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            style={{ backgroundColor: getColumnBgColor() }}
            className={`flex-shrink-0 w-80 rounded-lg p-3 mr-4 shadow-md transition-all duration-300 ${isDragOver ? 'ring-2 ring-blue-500' : ''}`}>
            <div className={`flex justify-between items-center mb-2 ${dragMode === 'column' ? 'cursor-grab' : ''}`}>
                {isEditing ? (
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} onBlur={handleTitleBlur} onKeyDown={(e) => e.key === 'Enter' && e.target.blur()} autoFocus className="font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-blue-500 rounded px-2 py-1 w-full"/>
                ) : (
                    <h3 onClick={() => setIsEditing(true)} className="font-bold text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 px-2 py-1 rounded">{column.title}</h3>
                )}
                <span className="bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-sm font-semibold px-2 py-1 rounded-full">{tickets.length}</span>
            </div>
             {isEditing && !isFirstColumn && (
                <div className="mb-4 flex items-center justify-center space-x-2">
                    {PASTEL_BG_COLORS.map((lightColor, index) => {
                         const displayColor = theme === 'dark' ? DARK_PASTEL_BG_COLORS[index] : lightColor;
                         return (
                            <button key={lightColor} onMouseDown={(e) => e.preventDefault()} onClick={() => onColorChange(column.id, lightColor)}
                                style={{ backgroundColor: displayColor }}
                                className={`w-6 h-6 rounded-full border-2 hover:opacity-80 ${column.bgColor === lightColor ? 'border-blue-500 ring-2 ring-blue-300' : 'border-white/50 dark:border-gray-500/50'}`}
                                aria-label={`Set color to ${lightColor}`}
                            />
                        );
                    })}
                </div>
            )}
            <div className="h-full min-h-[100px]">
                {tickets.map(ticket => <Ticket key={ticket.id} ticket={ticket} onSelect={onSelectTicket} onDragStart={onDragStart} dragMode={dragMode} />)}
            </div>
        </div>
    );
};

const TicketDetailModal = ({ ticket, onClose, onEdit, onDelete, onUpdateTicket, onAddComment }) => {
    const [liveTicket, setLiveTicket] = useState(null);
    const [editingLink, setEditingLink] = useState({ index: null, name: '' });
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        if (!ticket?.id) {
            setLiveTicket(null);
            return;
        }

        const ticketRef = doc(db, `artifacts/${appId}/public/data/tickets`, ticket.id);
        const unsubscribe = onSnapshot(ticketRef, (doc) => {
            if (doc.exists()) {
                setLiveTicket({ id: doc.id, ...doc.data() });
            } else {
                onClose();
            }
        });

        return () => unsubscribe();
    }, [ticket?.id, onClose]);

    if (!liveTicket) return null;

    const handleChecklistToggle = (index) => {
        const updatedChecklist = [...(liveTicket.checklist || [])];
        updatedChecklist[index].completed = !updatedChecklist[index].completed;
        onUpdateTicket(liveTicket.id, { checklist: updatedChecklist });
    };

    const handleLinkRename = (index, newName) => {
        const updatedLinks = [...liveTicket.links];
        updatedLinks[index].name = newName;
        onUpdateTicket(liveTicket.id, { links: updatedLinks });
        setEditingLink({ index: null, name: '' });
    };

    const handleAddCommentClick = () => {
        if (newComment.trim()) {
            const comment = {
                text: newComment.trim(),
                author: auth.currentUser?.isAnonymous ? 'Anonymous' : auth.currentUser?.displayName || 'User',
                createdAt: new Date() // Use client-side timestamp
            };
            onAddComment(liveTicket.id, comment);
            setNewComment('');
        }
    };
    
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '...';
        const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
        return date.toLocaleString();
    };

    const checklistProgress = liveTicket.checklist && liveTicket.checklist.length > 0 ? (liveTicket.checklist.filter(i => i.completed).length / liveTicket.checklist.length) * 100 : 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6 relative text-gray-800 dark:text-gray-200">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="flex justify-between items-start">
                    <h2 className="text-3xl font-bold mb-4">{liveTicket.title}</h2>
                    <span className="text-lg font-mono text-gray-500 dark:text-gray-400 mt-1">{liveTicket.ticketId}</span>
                </div>
                <p className="my-6 whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-4 rounded-md">{liveTicket.description || "No description provided."}</p>
                
                {liveTicket.checklist && liveTicket.checklist.length > 0 && (
                    <div className="my-6">
                        <h3 className="font-bold mb-2">Checklist</h3>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mb-2">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${checklistProgress}%` }}></div>
                        </div>
                        <ul className="space-y-2">
                            {liveTicket.checklist.map((item, index) => (
                                <li key={index} className="flex items-center">
                                    <input type="checkbox" checked={item.completed} onChange={() => handleChecklistToggle(index)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <span className={`ml-3 text-sm ${item.completed ? 'line-through text-gray-500' : ''}`}>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {liveTicket.links && liveTicket.links.length > 0 && (
                    <div className="my-6">
                        <h3 className="font-bold mb-2">Links</h3>
                        <ul className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md space-y-2">
                            {liveTicket.links.map((link, index) => (
                                <li key={index} className="flex items-center">
                                    <LinkIcon />
                                    {editingLink.index === index ? (
                                        <input type="text" value={editingLink.name}
                                            onChange={(e) => setEditingLink({ ...editingLink, name: e.target.value })}
                                            onBlur={() => handleLinkRename(index, editingLink.name)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleLinkRename(index, editingLink.name)}
                                            className="bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 text-sm p-1 rounded border border-blue-500" autoFocus/>
                                    ) : (
                                        <a href={link.url} target="_blank" rel="noopener noreferrer"
                                            onContextMenu={(e) => { e.preventDefault(); setEditingLink({ index, name: link.name }); }}
                                            className="text-blue-600 dark:text-blue-400 hover:underline text-sm">{link.name}</a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="my-6 border-t dark:border-gray-600 pt-4">
                    <h3 className="font-bold mb-2">Comments</h3>
                    <div className="space-y-4 max-h-48 overflow-y-auto">
                        {(liveTicket.comments || []).map((comment, index) => (
                            <div key={index} className="text-sm">
                                <p className="font-semibold">{comment.author} <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{formatTimestamp(comment.createdAt)}</span></p>
                                <p className="mt-1">{comment.text}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4">
                        <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." className="w-full p-2 text-sm border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"></textarea>
                        <button onClick={handleAddCommentClick} className="mt-2 bg-blue-600 text-white font-bold py-1 px-3 rounded-lg text-sm hover:bg-blue-700">Add Comment</button>
                    </div>
                </div>

                <div className="flex items-center justify-end space-x-3 mt-6">
                    <button onClick={() => onDelete(liveTicket.id)} className="text-red-600 hover:text-red-800 font-bold py-2 px-4 rounded-lg flex items-center"><TrashIcon /><span className="ml-1">Delete</span></button>
                    <button onClick={() => onEdit(liveTicket)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Edit</button>
                </div>
            </div>
        </div>
    );
};

function App() {
    const [tickets, setTickets] = useState([]);
    const [columns, setColumns] = useState([]);
    const [boardName, setBoardName] = useState('My Board');
    const [isEditingBoardName, setIsEditingBoardName] = useState(false);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [isTicketModalOpen, setTicketModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [editingTicket, setEditingTicket] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [dragMode, setDragMode] = useState('ticket');
    const menuRef = useRef(null);
    const searchRef = useRef(null);

    useEffect(() => { loadGoogleFonts(); }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) setIsMenuOpen(false);
            if (searchRef.current && !searchRef.current.contains(event.target)) setSearchResults([]);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef, searchRef]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) setIsAuthReady(true);
            else {
                setIsAuthReady(false);
                try {
                    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) await signInWithCustomToken(auth, __initial_auth_token);
                    else await signInAnonymously(auth);
                } catch (error) { console.error("Authentication failed:", error); }
            }
        });
        return () => unsubscribe();
    }, []);
    
    // Board Settings Listener
    useEffect(() => {
        if (!isAuthReady) return;
        const boardSettingsRef = doc(db, `artifacts/${appId}/public/data/board`, 'settings');
        const unsubscribe = onSnapshot(boardSettingsRef, (doc) => {
            if (doc.exists()) {
                setBoardName(doc.data().name);
            } else {
                setDoc(boardSettingsRef, { name: 'My Board', prefix: 'MY' });
            }
        });
        return () => unsubscribe();
    }, [isAuthReady]);


    useEffect(() => {
        if (!isAuthReady) return;
        const columnsCollectionPath = `artifacts/${appId}/public/data/columns`;
        const q = query(collection(db, columnsCollectionPath));
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            if (snapshot.empty) {
                const batch = writeBatch(db);
                const defaultCols = [
                    { title: 'To Do', order: 0, bgColor: '#F9FAFB' },
                    { title: 'In Progress', order: 1, bgColor: PASTEL_BG_COLORS[0] },
                    { title: 'Done', order: 2, bgColor: PASTEL_BG_COLORS[1] }
                ];
                defaultCols.forEach(col => { const docRef = doc(collection(db, columnsCollectionPath)); batch.set(docRef, col); });
                await batch.commit();
            } else {
                const colsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setColumns(colsData.sort((a, b) => a.order - b.order));
            }
        });
        return () => unsubscribe();
    }, [isAuthReady]);

    useEffect(() => {
        if (!isAuthReady) return;
        setIsLoading(true);
        const ticketsCollectionPath = `artifacts/${appId}/public/data/tickets`;
        const q = query(collection(db, ticketsCollectionPath));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setTickets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [isAuthReady]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            return;
        }
        const filtered = tickets.filter(ticket => 
            ticket.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.ticketId?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
    }, [searchQuery, tickets]);
    
    const handleUpdateTicket = async (ticketId, updateData) => {
        const ticketRef = doc(db, `artifacts/${appId}/public/data/tickets`, ticketId);
        await setDoc(ticketRef, updateData, { merge: true });
    };

    const handleAddCommentToTicket = async (ticketId, comment) => {
        const ticketRef = doc(db, `artifacts/${appId}/public/data/tickets`, ticketId);
        await updateDoc(ticketRef, {
            comments: arrayUnion(comment)
        });
    };

    const handleSaveTicket = async (ticketData) => {
        const ticketsCollectionPath = `artifacts/${appId}/public/data/tickets`;
        const tempId = `temp-${Date.now()}`;

        if (editingTicket) {
             await setDoc(doc(db, ticketsCollectionPath, editingTicket.id), { ...editingTicket, ...ticketData }, { merge: true });
             handleCloseModals();
             return;
        }

        const optimisticTicket = {
            id: tempId,
            ...ticketData,
            status: columns[0]?.title || 'To Do',
            accentColor: generateRandomVibrantColor(),
            ticketId: '...',
        };
        setTickets(prev => [...prev, optimisticTicket]);
        handleCloseModals();

        try {
            const counterRef = doc(db, `artifacts/${appId}/public/data/metadata`, 'ticketCounter');
            const boardSettingsRef = doc(db, `artifacts/${appId}/public/data/board`, 'settings');
            
            await runTransaction(db, async (transaction) => {
                const counterDoc = await transaction.get(counterRef);
                const boardDoc = await transaction.get(boardSettingsRef);

                const newCount = (counterDoc.exists() ? counterDoc.data().count : 0) + 1;
                const prefix = boardDoc.exists() ? boardDoc.data().prefix : 'MY';
                
                const ticketId = `${prefix}-${String(newCount).padStart(3, '0')}`;
                
                const newTicketRef = doc(collection(db, ticketsCollectionPath));
                transaction.set(newTicketRef, { 
                    ...ticketData, 
                    ticketId,
                    status: columns[0]?.title || 'To Do', 
                    createdAt: serverTimestamp(),
                    accentColor: optimisticTicket.accentColor
                });
                transaction.set(counterRef, { count: newCount });
            });
        } catch (error) { 
            console.error("Error saving ticket:", error);
            setTickets(prev => prev.filter(t => t.id !== tempId));
        }
    };
    
    const handleDeleteTicket = async (ticketId) => {
        if (!ticketId) return;
        await deleteDoc(doc(db, `artifacts/${appId}/public/data/tickets`, ticketId));
        setSelectedTicket(null);
    };

    const handleBoardNameChange = async (newBoardName) => {
        const trimmedName = newBoardName.trim();
        if (!trimmedName || trimmedName === boardName) {
            setIsEditingBoardName(false);
            return;
        }

        const oldPrefix = (boardName.split(' ')[0].substring(0, 2) || 'MY').toUpperCase();
        const newPrefix = (trimmedName.split(' ')[0].substring(0, 2) || 'MY').toUpperCase();
        
        const boardSettingsRef = doc(db, `artifacts/${appId}/public/data/board`, 'settings');

        if (oldPrefix === newPrefix) {
            await setDoc(boardSettingsRef, { name: trimmedName, prefix: newPrefix }, { merge: true });
            setIsEditingBoardName(false);
            return;
        }

        const batch = writeBatch(db);
        batch.set(boardSettingsRef, { name: trimmedName, prefix: newPrefix }, { merge: true });
        
        const ticketsQuery = query(collection(db, `artifacts/${appId}/public/data/tickets`));
        const snapshot = await getDocs(ticketsQuery);
        
        snapshot.docs.forEach(ticketDoc => {
            const ticketData = ticketDoc.data();
            if (ticketData.ticketId && ticketData.ticketId.startsWith(oldPrefix)) {
                const numberPart = ticketData.ticketId.split('-')[1];
                const newTicketId = `${newPrefix}-${numberPart}`;
                batch.update(ticketDoc.ref, { ticketId: newTicketId });
            }
        });

        await batch.commit();
        setIsEditingBoardName(false);
    };


    const handleColumnTitleChange = async (id, newTitle) => {
        const oldTitle = columns.find(c => c.id === id)?.title;
        if (oldTitle === newTitle || !oldTitle) return;
        await setDoc(doc(db, `artifacts/${appId}/public/data/columns`, id), { title: newTitle }, { merge: true });
        
        const ticketsToUpdateQuery = query(collection(db, `artifacts/${appId}/public/data/tickets`), where("status", "==", oldTitle));
        const batch = writeBatch(db);
        const snapshot = await getDocs(ticketsToUpdateQuery);
        snapshot.docs.forEach(ticketDoc => batch.update(ticketDoc.ref, { status: newTitle }));
        await batch.commit();
    };

    const handleColumnColorChange = async (id, newColor) => await setDoc(doc(db, `artifacts/${appId}/public/data/columns`, id), { bgColor: newColor }, { merge: true });

    const handleAddColumn = async () => {
        if (columns.length >= 7) return;
        const newOrder = columns.length > 0 ? Math.max(...columns.map(c => c.order)) + 1 : 0;
        const newColor = PASTEL_BG_COLORS[columns.length % PASTEL_BG_COLORS.length];
        await addDoc(collection(db, `artifacts/${appId}/public/data/columns`), { title: 'New Column', order: newOrder, bgColor: newColor });
    };

    const onTicketDrop = async (e, newStatus) => {
        const ticketId = e.dataTransfer.getData('ticketId');
        if (ticketId) await setDoc(doc(db, `artifacts/${appId}/public/data/tickets`, ticketId), { status: newStatus }, { merge: true });
    };
    
    const handleColumnDrop = (e, targetColumnId) => {
        const sourceColumnId = e.dataTransfer.getData('columnId');
        if (!sourceColumnId || sourceColumnId === targetColumnId) return;

        const sourceIndex = columns.findIndex(c => c.id === sourceColumnId);
        const targetIndex = columns.findIndex(c => c.id === targetColumnId);

        const reorderedColumns = [...columns];
        const [removed] = reorderedColumns.splice(sourceIndex, 1);
        reorderedColumns.splice(targetIndex, 0, removed);

        const batch = writeBatch(db);
        reorderedColumns.forEach((col, index) => {
            const colRef = doc(db, `artifacts/${appId}/public/data/columns`, col.id);
            batch.update(colRef, { order: index });
        });
        batch.commit();
    };


    const handleOpenCreateModal = () => { setEditingTicket(null); setTicketModalOpen(true); };
    const handleOpenEditModal = (ticketToEdit) => { setEditingTicket(ticketToEdit); setSelectedTicket(null); setTicketModalOpen(true); };
    const handleCloseModals = () => { setSelectedTicket(null); setEditingTicket(null); setTicketModalOpen(false); };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 font-sans h-screen flex flex-col transition-colors duration-300" style={{ fontFamily: "'Roboto', sans-serif" }}>
            <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div className="flex items-center space-x-4">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100" style={{ fontFamily: "'Bitcount Prop Double', sans-serif" }}>Jocco</h1>
                    {isEditingBoardName ? (
                        <input type="text" defaultValue={boardName}
                            onBlur={(e) => handleBoardNameChange(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleBoardNameChange(e.target.value)}
                            className="text-xl font-semibold bg-transparent border-b-2 border-blue-500 text-gray-700 dark:text-gray-200 focus:outline-none" autoFocus />
                    ) : (
                        <h2 onClick={() => setIsEditingBoardName(true)} className="text-xl font-semibold text-gray-600 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white">{boardName}</h2>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <div className="relative" ref={searchRef}>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon />
                        </div>
                        <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        {searchResults.length > 0 && (
                            <div className="absolute mt-1 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg max-h-60 overflow-auto z-10">
                                <ul className="py-1">
                                    {searchResults.map(ticket => (
                                        <li key={ticket.id} onClick={() => { setSelectedTicket(ticket); setSearchQuery(''); }}
                                            className="text-gray-900 dark:text-gray-200 cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <span className="font-semibold block truncate">{ticket.ticketId}</span>
                                            <span className="text-sm text-gray-600 dark:text-gray-400 block truncate">{ticket.title}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800">
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                    </button>
                    <button onClick={handleOpenCreateModal} className="flex items-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 shadow">
                        <PlusIcon /> <span className="ml-2 hidden sm:inline">Create Ticket</span>
                    </button>
                    <div className="relative" ref={menuRef}>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800">
                            <MenuIcon />
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20">
                                <a href="#" onClick={(e) => { e.preventDefault(); setDragMode(prev => prev === 'ticket' ? 'column' : 'ticket'); setIsMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Drag Mode: {dragMode === 'ticket' ? 'Tickets' : 'Columns'}</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setIsHelpModalOpen(true); setIsMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Help</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setIsAboutModalOpen(true); setIsMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">About</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Log Out</a>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-grow p-4 overflow-x-auto">
                {isLoading || !isAuthReady ? <div className="flex justify-center items-center h-full text-lg text-gray-500 dark:text-gray-400">Loading Board...</div> : (
                    <div className="flex h-full">
                        {columns.map((column, index) => (
                            <Column key={column.id} column={column} tickets={tickets.filter(t => t.status === column.title)}
                                onTicketDrop={onTicketDrop}
                                onSelectTicket={setSelectedTicket} onDragStart={(e, id) => e.dataTransfer.setData('ticketId', id)}
                                onTitleChange={handleColumnTitleChange}
                                onColorChange={handleColumnColorChange}
                                isFirstColumn={index === 0}
                                theme={theme}
                                onColumnDragStart={(e, id) => e.dataTransfer.setData('columnId', id)}
                                onColumnDrop={handleColumnDrop}
                                dragMode={dragMode}
                            />
                        ))}
                        {columns.length < 7 && (
                            <div className="flex-shrink-0 w-80">
                                <button onClick={handleAddColumn} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 font-bold py-3 px-4 rounded-lg flex items-center justify-center">
                                    <PlusIcon className="h-6 w-6"/> <span className="ml-2">Add another list</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>
            
            <TicketDetailModal ticket={selectedTicket} onClose={handleCloseModals} onEdit={handleOpenEditModal} onDelete={handleDeleteTicket} onUpdateTicket={handleUpdateTicket} onAddComment={handleAddCommentToTicket} />
            <TicketModal isOpen={isTicketModalOpen} onClose={handleCloseModals} onSave={handleSaveTicket} ticket={editingTicket} />
            <InfoModal title="About Jocco" isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)}>
                <p>Jocco is a minimalist, agile issue tracking web app with a simple, highly modular interface, built with love by Jessenth.</p>
                <p className="mt-2">Visit <a href="http://www.jessenth.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">www.jessenth.com</a> for more info.</p>
            </InfoModal>
            <InfoModal title="Help" isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)}>
                <p>Welcome to Jocco! Here’s a quick guide:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><b>Create Tickets:</b> Click the "+ Create Ticket" button to add a new task.</li>
                    <li><b>Move Tickets:</b> Drag and drop tickets between columns to update their status.</li>
                    <li><b>Edit Tickets:</b> Click on any ticket to view its details, then click the "Edit" button.</li>
                    <li><b>Customize Columns:</b> Click on a column's title to rename it. A color palette will appear to change its background.</li>
                    <li><b>Dark Mode:</b> Use the moon/sun icon in the header to toggle dark mode.</li>
                    <li><b>Advanced Features:</b> Add links, checklists, and comments inside any ticket. Right-click a link to rename it.</li>
                </ul>
            </InfoModal>
        </div>
    );
}

export default App;
