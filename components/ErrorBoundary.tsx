"use client";
import { Component, type ReactNode } from "react";

// Affiche l'erreur à l'écran au lieu de faire planter toute la page (pratique en démo live).
export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="error mono">
          {this.state.error.name}: {this.state.error.message}
        </div>
      );
    }
    return this.props.children;
  }
}
