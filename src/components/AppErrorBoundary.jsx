import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="rounded-full bg-amber-100 p-4 text-amber-700">
            <AlertTriangle className="h-10 w-10" aria-hidden />
          </div>
          <div className="max-w-md space-y-2">
            <h1 className="text-lg font-semibold text-slate-900">Un problème est survenu</h1>
            <p className="text-sm text-slate-600">
              L’interface a rencontré une erreur inattendue. Rechargez la page ou réessayez plus tard.
            </p>
          </div>
          <Button type="button" onClick={() => window.location.reload()}>
            Recharger la page
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
