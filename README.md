# NUTMED · RD Station → Kommo

Recebe conversões do RD Station Marketing e cria ou atualiza contatos e oportunidades na Kommo da NUTMED. Base copiada de `nextcard-rd-kommo` em 23/11/2026.

## Pendências (dados da NUTMED)

- [x] Subdomínio Kommo: `nutmed` (nutmed.kommo.com). [ ] Token de longa duração.
- [ ] Funil, etapa de entrada e responsável (`KOMMO_PIPELINE_NAME`, `KOMMO_ENTRY_STAGE_NAME`, `KOMMO_RESPONSIBLE_USER_ID`).
- [ ] Identificadores das conversões do RD → `src/config/products.ts`.
- [ ] Mapeamento de campos e tags por formulário.
- [ ] Repositório no GitHub e projeto na Vercel.

## Rotas

| Rota / `event_identifier` | Produto | Destino |
|---|---|---|
| `nutmed-geral` | NUTMED | Funil NutMed → NOVOS LEADS RD (provisório) |

Webhook padrão: `POST /api/webhooks/rd?secret=SEGREDO`.

Automação RD (**Enviar Leads para Integração**): `POST /api/webhooks/rd/<rota>/SEGREDO`, por exemplo `/api/webhooks/rd/nutmed-geral/SEGREDO`.

Saúde: `GET /api/health`.

## Comportamento

- Eventos não cadastrados são ignorados.
- O contato é localizado por telefone ou e-mail; telefones brasileiros são normalizados para `+55`.
- Uma oportunidade aberta do mesmo produto no mesmo funil é atualizada; sem ela, uma nova é criada na etapa de entrada.
- Funil, etapa e campos personalizados são localizados pelo nome; campos ausentes geram aviso sem bloquear o lead.
- UTMs e origem do RD vão para os campos `UTM_*`, `Origem RD`, `Evento RD` etc., quando existirem na Kommo.
- Os logs não registram nome, e-mail, telefone nem valores dos campos.

## Implantação segura

1. Copie `.env.example` para `.env.local` (ou configure na Vercel). Nunca versione o token.
2. Publique com `KOMMO_SYNC_ENABLED=false`, envie uma conversão de teste de cada formulário e confira no log as chaves recebidas.
3. Ajuste o mapeamento e mude para `true`.

Comandos: `npm ci`, `npm test`, `npm run lint`, `npm run build`.
