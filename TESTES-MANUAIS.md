# Checklist de Testes Manuais

## Validado

- [x] Cadastro de cliente
- [x] Cadastro de device
- [x] Cadastro de regra
- [x] Listagem de devices
- [x] Listagem de regras
- [x] Edicao de device
- [x] Exclusao de regra
- [x] Exclusao de device
- [x] Visualizacao do historico
- [x] Envio de leitura manual pelo Insomnia
- [x] Temperatura fora da faixa
- [x] Filtro por cliente
- [x] Device volta para online ao enviar nova leitura
- [x] Device volta para offline apos ficar sem enviar leitura

## Observacoes

- Os testes foram executados com os clientes `alegretto` e `almanaque`.
- A separacao por tenant funcionou corretamente no dashboard.
- O endpoint de ingestao atualiza o status do device quando uma nova leitura chega.
- A deteccao de offline funcionou conforme o tempo configurado no backend.

## Melhorias recomendadas

- [x] Trocar confirmacao nativa do navegador por modal proprio
- [x] Destacar melhor temperatura fora da faixa no dashboard
- [x] Melhorar atualizacao automatica da listagem sem precisar refresh manual
- [ ] Refinar mensagens de erro da interface
- [ ] Revisar feedback visual de acoes criticas

## Testes sugeridos para depois

- [ ] Criar e excluir regra no cliente `almanaque`
- [ ] Criar novamente um device do zero apos os ajustes de loading
- [ ] Testar mais de um device enviando leitura ao mesmo tempo
- [ ] Validar cooldown e tolerancia das regras de alerta
- [ ] Testar historico com mais volume de leituras
- [ ] Validar entrega real de webhook/alerta, se aplicavel

## Contexto de Produto

- O projeto esta evoluindo para uma plataforma de automacao e monitoramento por modulos.
- O modulo atual em consolidacao e `temperatura`.
- O proximo modulo previsto e `acionamento`.
- A visao de evolucao esta registrada em `ROADMAP-MODULAR.md`.
