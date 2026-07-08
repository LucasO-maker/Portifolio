document.addEventListener('DOMContentLoaded', function () {


  var hamburgerBtn = document.getElementById('hamburgerBtn');
  var navLinks = document.getElementById('navLinks');

  var servicosDetails = document.querySelector('header details');
  var servicosDropdown = document.querySelector('header .dropdown');

  // ---------- Abrir/fechar o menu principal ----------
  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('is-open');

      // Anima o ícone do hamburguer para "X"
      hamburgerBtn.classList.toggle('is-active');

      // Atualiza atributo de acessibilidade
      hamburgerBtn.setAttribute('aria-expanded', isOpen);

      // Se o menu for fechado, fecha também o dropdown de Serviços
      if (!isOpen && servicosDetails) {
        servicosDetails.removeAttribute('open');
      }
    });
  }

  if (servicosDetails) {
    servicosDetails.addEventListener('toggle', function () {
      var isOpen = servicosDetails.open;
      var summary = servicosDetails.querySelector('summary');
      if (summary) {
        summary.setAttribute('aria-expanded', isOpen);
      }
    });
  }

  // BUSCA INTELIGENTE: redireciona por palavra-chave   //

  var searchForm = document.getElementById('searchForm');
  var searchInput = document.getElementById('searchInput');

  // Cada item do array representa: a página de destino e
  // as palavras-chave que, se encontradas no texto digitado,
  // levam o cliente direto para essa página.
  var searchRoutes = [
    {
      page: 'contato.html',
      keywords: ['fale conosco', 'contato', 'falar com', 'atendimento', 'whatsapp', 'telefone']
    },
    {
      page: 'orcamento.html',
      keywords: ['orçamento', 'orcamento', 'preço', 'preco', 'quanto custa', 'valor']
    },
    {
      page: 'manutencao.html',
      keywords: ['manutenção', 'manutencao', 'conserto', 'reparo', 'assistencia', 'assistência']
    },
    {
      page: 'compra.html',
      keywords: ['comprar', 'compra', 'produto', 'produtos', 'loja', 'catálogo', 'catalogo']
    },
    {
      page: 'quemSomos.html',
      keywords: ['quem somos', 'sobre nós', 'sobre nos', 'empresa', 'história', 'historia']
    },
    {
      page: 'avaliacoes.html',
      keywords: ['avaliações', 'avaliacoes', 'avaliação', 'avaliacao', 'reviews']
    }
  ];

  // Função que verifica se o texto digitado bate com alguma palavra-chave
  // e retorna a página de destino correspondente (ou null se não encontrar)
  function buscarPaginaPorPalavraChave(texto) {
    var textoNormalizado = texto.trim().toLowerCase();

    for (var i = 0; i < searchRoutes.length; i++) {
      var rota = searchRoutes[i];

      for (var j = 0; j < rota.keywords.length; j++) {
        // .includes() verifica se a palavra-chave está contida no texto digitado
        // (não precisa ser exatamente igual, ex: "quero falar contato" também funciona)
        if (textoNormalizado.includes(rota.keywords[j])) {
          return rota.page;
        }
      }
    }

    return null; // nenhuma palavra-chave encontrada
  }

  // Intercepta o envio do formulário de busca
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault(); // impede o envio padrão do formulário

      var textoDigitado = searchInput.value;

      if (textoDigitado.trim() === '') {
        return; // não faz nada se o campo estiver vazio
      }

      var paginaEncontrada = buscarPaginaPorPalavraChave(textoDigitado);

      if (paginaEncontrada) {
        // Encontrou uma palavra-chave correspondente: redireciona direto
        window.location.href = paginaEncontrada;
      } else {
        // Nenhuma palavra-chave bateu: exibe um aviso simples ao cliente
        alert('Não encontramos nenhuma página para "' + textoDigitado + '". Tente palavras como: orçamento, manutenção, comprar, contato.');
      }
    });
  }

  /**
   * Configura um carrossel genérico controlado por duas setas,
   * @param {string} idTrilha        - id do elemento que desliza (a "trilha")
   * @param {string} idBotaoEsquerda - id do botão que volta um card
   * @param {string} idBotaoDireita  - id do botão que avança um card
   */
  function configurarCarrossel(idTrilha, idBotaoEsquerda, idBotaoDireita) {
    const trilha = document.getElementById(idTrilha);
    const botaoEsquerda = document.getElementById(idBotaoEsquerda);
    const botaoDireita = document.getElementById(idBotaoDireita);

    // Se algum elemento não existir na página, não faz nada (evita erros)
    if (!trilha || !botaoEsquerda || !botaoDireita) return;

    const viewport = trilha.parentElement;
    const cards = Array.from(trilha.children);
    const totalCards = cards.length;
    let indiceAtual = 0;

    // Carrossel com 0 ou 1 card: nada para deslizar, desativa os controles
    if (totalCards <= 1) {
      botaoEsquerda.disabled = true;
      botaoDireita.disabled = true;
      botaoEsquerda.style.opacity = '0.3';
      botaoDireita.style.opacity = '0.3';
      return;
    }

    // Move a trilha até o card do índice informado
    function irParaCard(indice) {
      indiceAtual = indice;
      const larguraJanela = viewport.getBoundingClientRect().width;
      trilha.style.transform = `translateX(-${indiceAtual * larguraJanela}px)`;
    }

    function irParaAnterior() {
      const novoIndice = indiceAtual === 0 ? totalCards - 1 : indiceAtual - 1;
      irParaCard(novoIndice);
    }

    function irParaProximo() {
      const novoIndice = indiceAtual === totalCards - 1 ? 0 : indiceAtual + 1;
      irParaCard(novoIndice);
    }

    // ---------- Setas ----------
    botaoEsquerda.addEventListener('click', irParaAnterior);
    botaoDireita.addEventListener('click', irParaProximo);

    // ---------- Teclado (acessibilidade) ----------
    viewport.setAttribute('tabindex', '0');
    viewport.addEventListener('keydown', (evento) => {
      if (evento.key === 'ArrowLeft') irParaAnterior();
      if (evento.key === 'ArrowRight') irParaProximo();
    });

    // ---------- Arraste / swipe (mouse e touch) ----------
    let posicaoInicialX = 0;
    let arrastando = false;

    function iniciarArraste(x) {
      arrastando = true;
      posicaoInicialX = x;
      trilha.style.transition = 'none';
    }

    function finalizarArraste(x) {
      if (!arrastando) return;
      arrastando = false;
      trilha.style.transition = 'transform 0.45s ease';

      const distancia = x - posicaoInicialX;
      const LIMIAR_ARRASTE = 50; // px mínimos para considerar um swipe válido

      if (distancia > LIMIAR_ARRASTE) {
        irParaAnterior();
      } else if (distancia < -LIMIAR_ARRASTE) {
        irParaProximo();
      } else {
        irParaCard(indiceAtual); // volta pro lugar se o arraste foi pequeno
      }
    }

    // Touch (celular)
    viewport.addEventListener('touchstart', (evento) => {
      iniciarArraste(evento.touches[0].clientX);
    }, { passive: true });

    viewport.addEventListener('touchend', (evento) => {
      finalizarArraste(evento.changedTouches[0].clientX);
    });

    // Mouse (desktop, útil já pra quando as media queries entrarem)
    viewport.addEventListener('mousedown', (evento) => {
      iniciarArraste(evento.clientX);
    });

    viewport.addEventListener('mouseup', (evento) => {
      finalizarArraste(evento.clientX);
    });

    viewport.addEventListener('mouseleave', () => {
      if (arrastando) {
        arrastando = false;
        trilha.style.transition = 'transform 0.45s ease';
        irParaCard(indiceAtual);
      }
    });

    // ---------- Redimensionamento ----------
    // Recalcula a posição se a tela for redimensionada (ex: virar o celular)
    window.addEventListener('resize', () => irParaCard(indiceAtual));

    // Posição inicial
    irParaCard(indiceAtual);
  }
  
  // Carrossel de "Nossos Serviços" (3 cards: Celulares, Videogames, Controles)
  configurarCarrossel(
    'trilhaServicos_index',
    'setaServicosEsquerda_index',
    'setaServicosDireita_index'
  );

  // Carrossel de "Avaliações" (5 cards)
  configurarCarrossel(
    'trilhaAvaliacoes_index',
    'setaAvaliacoesEsquerda_index',
    'setaAvaliacoesDireita_index'
  );
});