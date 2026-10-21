# Projeto PI - Sprint 2

## Skills de Projeto

### /sync-team
Quando o usuário solicitar "sincronizar equipe" ou "/sync-team", execute a seguinte sequência:
1. **Atualização**: Execute `git pull origin main`.
2. **Detecção de Conflitos**: 
   - Se o pull for bem-sucedido sem conflitos: Informe que o projeto está atualizado.
   - Se houver conflitos: 
     a. Identifique todos os arquivos com conflitos (`git status`).
     b. Para cada arquivo, leia as seções de conflito (`<<<<<<< HEAD`, `=======`, `>>>>>>>`).
     c. Analise a intenção do código local e a intenção do código remoto.
     d. Proponha a solução de merge mais lógica que preserve ambas as funcionalidades ou escolha a versão mais atualizada/correta.
     e. Solicite a confirmação do usuário antes de aplicar a correção.
3. **Finalização**: Após resolver os conflitos, execute `git add .` e `git commit -m "chore: resolve merge conflicts with main"`.

### /style-check
Quando o usuário solicitar "verificar estilo" ou "/style-check", execute a seguinte análise nos arquivos alterados:
1. **Análise de Padronização**: Verifique inconsistências no código, focando em:
   - **Nomenclatura**: Uso misto de `camelCase`, `snake_case` ou `PascalCase` para o mesmo tipo de entidade.
   - **Sintaxe**: Mistura de aspas simples ('') e duplas ("") sem critério, ou uso inconsistente de ponto e vírgula.
   - **Indentação**: Espaços vs Tabs ou recuos inconsistentes.
   - **Organização**: Importações desorganizadas ou blocos de código excessivamente longos.
2. **Sugestão de Melhoria**: Para cada inconsistência encontrada, apresente o trecho original e a versão sugerida para padronizar.
3. **Aplicação**: Pergunte ao usuário se deseja que as correções de estilo sejam aplicadas automaticamente em todos os arquivos analisados.

### /validate
Antes de realizar qualquer commit ou push, execute a seguinte validação:


1. **Testes Unitários**: Execute o comando de teste do projeto (ex: `npm test` ou similar).
2. **Análise de Erros**: Se os testes falharem, interrompa o processo, apresente o erro ao usuário e sugira a correção.
3. **Conclusão**: Somente se todos os testes passarem, informe que o código está validado e pronto para o `/auto-commit`.

### /auto-commit
Quando o usuário solicitar "subir auto commit", execute rigorosamente a seguinte sequência:

1. **Validação**: Execute a skill `/validate` (rodar testes unitários). 
   - **Se os testes falharem**: Pare IMEDIATAMENTE, informe o erro ao usuário e NÃO prossiga com o commit/push.
   - **Se os testes passarem**: Prossiga para o próximo passo.
2. **Sincronizar**: Execute `git pull origin main` para garantir que a base está atualizada.
3. **Analisar**: Analise as mudanças atuais no código (`git diff` ou verificando os arquivos alterados) para gerar uma mensagem de commit concisa e descritiva em português.
4. **Adicionar**: Execute `git add .` para adicionar todas as alterações.
5. **Commit**: Execute `git commit -m "<mensagem_gerada>"` seguindo a convenção de mensagens do projeto.
6. **Push**: Execute `git push origin main`.

Certifique-se de reportar o sucesso de cada etapa ao usuário.

### /modern-css
Quando o usuário solicitar "modernizar CSS" ou "/modern-css", aplique as seguintes diretrizes de CSS moderno:
1. **Cores Modernas**: Utilize o espaço de cores `oklch()` para paletas mais vibrantes e consistentes. Use `color-mix()` para variações de tons.
2. **Layout Responsivo**: 
   - Substitua tamanhos fixos por tipografia fluida usando `clamp()`.
   - Utilize `text-wrap: balance` em títulos e `text-wrap: pretty` em parágrafos.
   - Implemente `container queries` (@container) para componentes que devem se adaptar ao espaço do pai, não apenas ao viewport.
3. **Sintaxe Atualizada**: Use a nova sintaxe de range em media queries (ex: `@media (width <= 768px)`).
4. **Interações Modernas**: Implemente a Popover API e a Dialog API para modais e tooltips, evitando JS desnecessário.
5. **Performance & UX**: Utilize `content-visibility: auto` em seções longas e respeite a preferência do usuário com `@media (prefers-reduced-motion: reduce)`.
6. **Verificação de Baseline**: Verifique sempre a disponibilidade do recurso no "Baseline" (Widely / Newly Available) antes de sugerir a implementação final.
