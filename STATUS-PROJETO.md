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
- Testes unitarios e e2e corrigidos e passando localmente
- Testes de ambiente adicionados

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

## Pendencias

- Melhorar atualizacao automatica do dashboard para status online/offline
- Refinar mensagens de erro da interface
- Testar cooldown e tolerancia das regras de alerta
- Validar envio real de webhook/alerta
- Investigar de forma definitiva a instabilidade do deploy `deploy-swarm` no GitHub Actions

## Observacoes Importantes

- Ja existe o arquivo `TESTES-MANUAIS.md` com checklist do que foi testado.
- Em um momento o GitHub Actions falhou no `deploy-swarm` por `scp ... i/o timeout`, mas o rerun funcionou.
- O frontend em producao pode parecer desatualizado quando o job de deploy falha, mesmo com o commit ja no GitHub.

## Proxima Melhoria Sugerida

- Refinar mensagens de erro da interface e feedback operacional para falhas de ingestao/alerta.
