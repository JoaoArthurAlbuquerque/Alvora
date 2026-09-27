import React from "react";
import { useLocation } from "react-router-dom";
import { Card } from "./Card";
import { Badge } from "./Badge";

export const EmConstrucao: React.FC = () => {
  const { pathname } = useLocation();
  return (
    <Card className="text-center py-12 space-y-3">
      <Badge variant="info">Em breve</Badge>
      <h1 className="text-xl font-bold text-slate-900">Tela em construção</h1>
      <p className="text-xs text-slate-500">{pathname}</p>
    </Card>
  );
};
