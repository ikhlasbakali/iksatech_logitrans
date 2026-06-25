import React, { useState } from "react";
import { PenLine, Camera, PackageCheck, Check } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * Confirmation de livraison — boutons pleine largeur, confort tactile.
 */
export default function DeliveryConfirmation({ missionReference, clientName }) {
  const [signed, setSigned] = useState(false);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [photoCaptured, setPhotoCaptured] = useState(false);

  const handleSign = () => {
    setSigned(true);
    toast.success("Signature enregistrée (simulation)");
  };

  const handleMockPhoto = () => {
    setPhotoCaptured(true);
    setPhotoOpen(false);
    toast.message("Photo associée au POD", {
      description: "Upload simulé — en production : envoi sécurisé.",
    });
  };

  return (
    <>
      <Card className="border-emerald-200/80 bg-gradient-to-b from-emerald-50/90 to-white shadow-sm overflow-hidden">
        <CardHeader className="pb-3 py-3.5 border-b border-emerald-100">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2 font-semibold text-emerald-950">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <PackageCheck className="w-4 h-4" />
            </span>
            Fin de livraison
            <span className="font-mono text-xs text-emerald-700/80 font-normal ml-auto">{missionReference}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4 pb-4">
          <p className="text-sm text-slate-600">
            Client : <span className="font-semibold text-slate-900">{clientName}</span>
          </p>
          <div className="grid grid-cols-1 gap-2.5">
            <Button
              type="button"
              size="lg"
              className={cn(
                "h-12 rounded-xl text-base font-semibold shadow-sm active:scale-[0.99] transition-transform touch-manipulation",
                signed ? "bg-emerald-100 text-emerald-900 hover:bg-emerald-100 border-2 border-emerald-300" : "bg-emerald-600 hover:bg-emerald-700"
              )}
              onClick={handleSign}
              disabled={signed}
            >
              {signed ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Signature enregistrée
                </>
              ) : (
                <>
                  <PenLine className="w-5 h-5 mr-2" />
                  Signer le bon de livraison
                </>
              )}
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              className="h-12 rounded-xl text-base font-medium border-2 border-slate-200 active:scale-[0.99] touch-manipulation"
              onClick={() => setPhotoOpen(true)}
            >
              <Camera className="w-5 h-5 mr-2 text-slate-600" />
              Photo à la livraison
              {photoCaptured ? (
                <span className="ml-2 text-xs font-semibold text-emerald-600">✓ OK</span>
              ) : null}
            </Button>
          </div>
          {signed && photoCaptured && (
            <p className="text-xs font-medium text-center text-emerald-800 bg-emerald-100/80 rounded-lg py-2 px-3">
              Étape livraison complète — vous pouvez clôturer la mission ci-dessous.
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={photoOpen} onOpenChange={setPhotoOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg">Photo de livraison</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="aspect-video rounded-2xl bg-slate-200 flex flex-col items-center justify-center text-slate-500 text-sm gap-2 border-2 border-dashed border-slate-300">
              <Camera className="w-10 h-10 opacity-50" />
              Aperçu caméra (simulation)
            </div>
            <Button type="button" className="w-full h-12 rounded-xl text-base" onClick={handleMockPhoto}>
              Capturer la photo
            </Button>
            <Button type="button" variant="ghost" className="w-full h-11" onClick={() => setPhotoOpen(false)}>
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
