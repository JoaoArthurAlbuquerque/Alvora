// src/modules/calendario/CalendarioPage.tsx
import React from "react";
import { Card } from "../../core/ui/Card";
import { PageHeader } from "../../core/ui/PageHeader";
import { CalendarioConteudo } from "./CalendarioConteudo";

export const CalendarioPage: React.FC = () => (
  <div className="space-y-6 max-w-3xl">
    <PageHeader
      titulo="Calendário"
      descricao="Provas, entregas e feriados num lugar só 🗓️"
    />
    <Card>
      <CalendarioConteudo />
    </Card>
  </div>
);
