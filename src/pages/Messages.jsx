import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  MessageSquare, 
  Search, 
  Send,
  Paperclip,
  User,
  Truck,
  Building2,
  Headphones,
  ChevronRight,
  Circle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const roleIcons = {
  admin: { icon: User, color: 'bg-purple-100 text-purple-600' },
  agent: { icon: User, color: 'bg-blue-100 text-blue-600' },
  driver: { icon: Truck, color: 'bg-green-100 text-green-600' },
  support: { icon: Headphones, color: 'bg-amber-100 text-amber-600' },
  client: { icon: Building2, color: 'bg-slate-100 text-slate-600' },
};

// Mock conversations
const mockConversations = [
  {
    id: 1,
    operation_ref: 'OP-2024-0892',
    participants: ['Viktor Rostov', 'Dispatch — Terminal 4', 'Client Baltic Trade'],
    last_message: 'Merci pour la confirmation, nous serons prêts.',
    last_sender: 'Client Baltic Trade',
    last_time: new Date(Date.now() - 1000 * 60 * 5),
    unread: 2,
  },
  {
    id: 2,
    operation_ref: 'OP-2024-0890',
    participants: ['Omar Al-Khatib', 'Support technique'],
    last_message: 'Le dépanneur sera sur place dans 30 minutes.',
    last_sender: 'Support technique',
    last_time: new Date(Date.now() - 1000 * 60 * 15),
    unread: 0,
  },
  {
    id: 3,
    operation_ref: 'OP-2024-0891',
    participants: ['Aisha Okonkwo', 'Dispatch — Terminal 4'],
    last_message: 'Chargement terminé, départ imminent.',
    last_sender: 'Aisha Okonkwo',
    last_time: new Date(Date.now() - 1000 * 60 * 45),
    unread: 1,
  },
  {
    id: 4,
    operation_ref: 'OP-2024-0889',
    participants: ['Helena Varga', 'Client Nordic Cold'],
    last_message: 'La température est stable à 4°C.',
    last_sender: 'Helena Varga',
    last_time: new Date(Date.now() - 1000 * 60 * 60),
    unread: 0,
  },
];

const mockMessages = [
  { id: 1, sender_name: 'Dispatch — Terminal 4', sender_role: 'agent', content: 'Bonjour, pouvez-vous confirmer l\'heure d\'arrivée ?', time: new Date(Date.now() - 1000 * 60 * 60) },
  { id: 2, sender_name: 'Viktor Rostov', sender_role: 'driver', content: 'Bonjour, je serai sur place vers 14h30.', time: new Date(Date.now() - 1000 * 60 * 45) },
  { id: 3, sender_name: 'Dispatch — Terminal 4', sender_role: 'agent', content: 'Parfait, j\'informe le client.', time: new Date(Date.now() - 1000 * 60 * 40) },
  { id: 4, sender_name: 'Client Baltic Trade', sender_role: 'client', content: 'Merci pour la confirmation, nous serons prêts.', time: new Date(Date.now() - 1000 * 60 * 5) },
];

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = mockConversations.filter(conv =>
    !searchTerm || conv.operation_ref.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl lg:text-3xl font-bold text-slate-900"
        >
          Messages
        </motion.h1>
        <p className="text-slate-500 mt-1">
          Communication par dossier
        </p>
      </div>

      {/* Main chat interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-16rem)]">
        {/* Conversations list */}
        <Card className="lg:col-span-1 overflow-hidden flex flex-col">
          <CardHeader className="pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            <div className="divide-y divide-slate-100">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  className={cn(
                    "p-4 cursor-pointer transition-colors hover:bg-slate-50",
                    selectedConversation?.id === conv.id && "bg-blue-50 hover:bg-blue-50"
                  )}
                  onClick={() => setSelectedConversation(conv)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-mono font-semibold text-slate-900">{conv.operation_ref}</span>
                    <span className="text-xs text-slate-400">
                      {format(conv.last_time, 'HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 truncate">{conv.last_message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-400">{conv.last_sender}</span>
                    {conv.unread > 0 && (
                      <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat area */}
        <Card className="lg:col-span-2 overflow-hidden flex flex-col">
          {selectedConversation ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-mono">{selectedConversation.operation_ref}</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">
                      {selectedConversation.participants.join(', ')}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Voir le dossier
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {mockMessages.map((msg) => {
                  const roleConfig = roleIcons[msg.sender_role] || roleIcons.agent;
                  const Icon = roleConfig.icon;
                  const isCurrentUser = msg.sender_role === 'agent';
                  
                  return (
                    <div
                      key={msg.id}
                      className={cn("flex gap-3", isCurrentUser && "flex-row-reverse")}
                    >
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", roleConfig.color)}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className={cn("max-w-[70%]", isCurrentUser && "text-right")}>
                        <div className={cn(
                          "px-4 py-2 rounded-2xl",
                          isCurrentUser 
                            ? "bg-blue-600 text-white rounded-br-md" 
                            : "bg-slate-100 text-slate-900 rounded-bl-md"
                        )}>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        <div className={cn("flex items-center gap-2 mt-1", isCurrentUser && "justify-end")}>
                          <span className="text-xs text-slate-500">{msg.sender_name}</span>
                          <span className="text-xs text-slate-400">
                            {format(msg.time, 'HH:mm')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Input
                    placeholder="Écrire un message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && setNewMessage('')}
                  />
                  <Button onClick={() => setNewMessage('')}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Sélectionnez une conversation</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}