# Status do Projeto

## Entregue

- API NestJS com ingestao de temperatura, CRUD de devices, clientes e regras
- Dashboard web publicado em producao
- Historico de leituras por device
- Filtro por cliente no dashboard
- Deteccao de offline/online
- Destaque visual para temperatura fora da faixa
- Loading nos botoes principais do dashboard
- Modal customizado para confirmar exclusao de device e regra
- Ajustes de cache/atualizacao para refletir mudancas no dashboard sem depender tanto de refresh manual
- Polling automatico no dashboard para devices e historico aberto
- Mensagens de erro do frontend reaproveitando respostas da API
- Cobertura de testes ampliada para cooldown e tolerance das regras de alerta
- Webhook de offline implementado na fila de alertas
- Testes unitarios e e2e corrigidos e passando localmente
- Testes de ambiente adicionados
- Documentacao de continuidade e roadmap modular adicionados
- Documentacao operacional atualizada com `n8n`, `Evolution` e observacoes de backup do Supabase
- Redis registrado como parte da infraestrutura operacional atual

## Validado em Producao

- Cadastro de cliente
- Cadastro de device
- Cadastro de regra
- Edicao de device
- Exclusao de regra
- Exclusao de device
- Listagem de devices
- Listagem de regras
- Historico de um device
- Ingestao manual pelo Insomnia
- Temperatura fora da faixa
- Filtro por cliente entre `alegretto` e `almanaque`
- Device volta para online ao receber leitura
- Device volta para offline apos tempo sem leitura
- Modal customizado de exclusao funcionando
- Dashboard atualiza automaticamente devices e historico apos polling

## Pendencias

- Validar envio real de webhook/alerta
- Investigar de forma definitiva a instabilidade do deploy `deploy-swarm` no GitHub Actions
- Fechar os itens restantes do `CHECKLIST-MODULO-TEMPERATURA.md`
- Definir escopo minimo do modulo `acionamento`

## Observacoes Importantes

- Ja existe o arquivo `TESTES-MANUAIS.md` com checklist do que foi testado.
- Ja existe o arquivo `ROADMAP-MODULAR.md` com a visao da plataforma por modulos.
- Ja existe o arquivo `CHECKLIST-MODULO-TEMPERATURA.md` com os criterios de conclusao do modulo atual.
- Em um momento o GitHub Actions falhou no `deploy-swarm` por `scp ... i/o timeout`, mas o rerun funcionou.
- O frontend em producao pode parecer desatualizado quando o job de deploy falha, mesmo com o commit ja no GitHub.

## Proxima Melhoria Sugerida

- Validar envio real de webhook/alerta e fechar os criterios de conclusao do modulo `temperatura`.
