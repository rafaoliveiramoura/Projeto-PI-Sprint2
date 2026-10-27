TETRIA — Dashboard demonstrativa
================================

Como executar
1. Extraia a pasta.
2. Abra index.html em um navegador moderno.
3. Para os gráficos, é necessário acesso à internet para carregar Chart.js e as fontes do Google.

O que já funciona no protótipo
- Navegação entre Dashboard, Colmeias, Ocorrências, Relatórios e Configurações.
- Filtros por situação e colmeia.
- Busca e filtragem da lista de colmeias.
- Modal de detalhes por colmeia.
- Reconhecimento e resolução demonstrativa de ocorrências.
- Alternância da distribuição por temperatura/umidade.
- Exportação CSV.
- Validação local das preferências de limites.
- Layout responsivo.

Importante
Os dados são fictícios e estão no array `hives` e no array `alerts` dentro de index.html.
As preferências e mudanças de ocorrências existem apenas durante a sessão, pois este protótipo ainda não tem backend.
Para integrar ao projeto real, substitua os dados locais por chamadas `fetch()` aos endpoints da sua API. O navegador deve acessar a API, nunca o MySQL diretamente.
Os limites ambientais apresentados são ilustrativos e precisam ser validados com referências técnicas adequadas à espécie e ao escopo do projeto.
