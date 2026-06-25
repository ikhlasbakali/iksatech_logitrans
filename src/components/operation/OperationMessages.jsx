import React, { useState, useRef, useEffect } from 'react';
import { appApi } from '@/api/appApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/auth/AuthContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Send, Paperclip, User, Truck, Headphones, Building2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const roleIcons = {
  admin: { icon: User, color: 'bg-purple-100 text-purple-600' },
  agent: { icon: User, color: 'bg-blue-100 text-blue-600' },
  driver: { icon: Truck, color: 'bg-green-100 text-green-600' },
  support: { icon: Headphones, color: 'bg-amber-100 text-amber-600' },
  client: { icon: Building2, color: 'bg-slate-100 text-slate-600' },
};

// Mock messages
const mockMessages = [
  { id: 1, sender_name: 'Dispatch — Terminal 4', sender_role: 'agent', content: 'Bonjour Viktor, pouvez-vous confirmer l\'heure d\'arrivée prévue ?', created_date: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: 2, sender_name: 'Viktor Rostov', sender_role: 'driver', content: 'Bonjour, je serai sur place vers 14h30. Un peu de trafic sur l\'A6.', created_date: new Date(Date.now() - 1000 * 60 * 60) },
  { id: 3, sender_name: 'Dispatch — Terminal 4', sender_role: 'agent', content: 'Parfait, merci pour l\'info. Le client a été prévenu.', created_date: new Date(Date.now() - 1000 * 60 * 45) },
  { id: 4, sender_name: 'Client Baltic Trade', sender_role: 'client', content: 'Merci pour la mise à jour. Nous serons prêts.', created_date: new Date(Date.now() - 1000 * 60 * 30) },
];

export default function OperationMessages({ operationId }) {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery({
    queryKey: ['operationMessages', operationId],
    queryFn: () => appApi.entities.Message.filter({ operation_id: operationId }, 'created_date'),
  });

  const sendMutation = useMutation({
    mutationFn: (content) =>
      appApi.entities.Message.create({
        operation_id: operationId,
        content,
        sender_name: user?.full_name || user?.email || 'Utilisateur',
        sender_role: user?.user_role || 'agent',
        type: 'message',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operationMessages', operationId] });
      queryClient.invalidateQueries({ queryKey: ['operationEvents', operationId] });
      setNewMessage('');
    },
  });

  const displayMessages = messages.length > 0 ? messages : mockMessages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    sendMutation.mutate(newMessage);
  };

  return (
    <div className="flex flex-col h-96">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {displayMessages.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p>Aucun message</p>
          </div>
        ) : (
          displayMessages.map((msg, index) => {
            const roleConfig = roleIcons[msg.sender_role] || roleIcons.agent;
            const Icon = roleConfig.icon;
            const isCurrentUser = msg.sender_role === 'agent';
            
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
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
                      {format(new Date(msg.created_date), "HH:mm", { locale: fr })}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 pt-4 border-t">
        <Button variant="ghost" size="icon">
          <Paperclip className="w-4 h-4" />
        </Button>
        <Input
          placeholder="Écrire un message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={!newMessage.trim() || sendMutation.isPending}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}