/* =========================
   ESTADO GLOBAL E DADOS
========================= */
let ESCALA = [];

const MEMBROS = [
    "ALAN", "BIANCA", "JEAN", "MEDEIROS", 
    "LUCIANA", "ANNA BEATRIZ", "JOÃO"
];

/* =========================
   UTILITÁRIOS
========================= */
function normalizarTexto(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizarData(data) {
    return new Date(data + "T00:00:00");
}

function formatarData(data) {
    return normalizarData(data).toLocaleDateString('pt-BR');
}

function hoje() {
    const h = new Date();
    h.setHours(0, 0, 0, 0);
    return h;
}

function ehHoje(data) {
    const d = normalizarData(data);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === hoje().getTime();
}

function ehPassado(data) {
    const d = normalizarData(data);
    d.setHours(0, 0, 0, 0);
    return d < hoje();
}

/* =========================
   NAVEGAÇÃO E LOGIN (VERSÃO FINAL CORRIGIDA)
========================= */
let secaoPendente = null;
let elementoPendente = null;

const USUARIOS_PERMITIDOS = [
    "medeiros", "jean", "alan", "matheus", 
    "anna beatriz", "luciana", "alex", "bianca"
];

function fecharLogin() {
    const modal = document.getElementById('modalLogin');
    const erroMsg = document.getElementById('erroLogin');
    
    if (modal) {
        modal.style.display = 'none'; // Esconde o modal
    }
    
    if (erroMsg) {
        erroMsg.style.display = 'none'; // Esconde a mensagem de erro se ela estiver aberta
    }

    // Limpa os campos para que não fiquem preenchidos na próxima tentativa
    document.getElementById('usuarioInput').value = "";
    document.getElementById('senhaInput').value = "";
}

function mostrarSecao(id, elemento) {
    // 1. Sempre tenta fechar o modal ao clicar em qualquer aba
    const modal = document.getElementById('modalLogin');
    if (modal) modal.style.display = 'none';

    // 2. Se for Downloads, bloqueia e pede login
    if (id === 'links') {
        secaoPendente = id;
        elementoPendente = elemento;
        if (modal) modal.style.display = 'flex';
        return; 
    }

    // 3. Se for qualquer outra aba (Escala, Mapa, etc), navega direto
    executarTrocaDePagina(id, elemento);
}

function executarTrocaDePagina(id, elemento) {
    // Esconde absolutamente todas as seções
    document.querySelectorAll('.secao').forEach(s => s.style.display = 'none');
    
    // Mostra a seção clicada
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'block';
    } else {
        console.error("Seção não encontrada: " + id);
    }

    // Atualiza o menu lateral/topo (classe active)
    if (elemento) {
        document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
        elemento.classList.add('active');
    }

    // Lógica específica de botões que você já tinha
    const btnMensal = document.getElementById('btn-ver-mensal');
    const btnVoltar = document.getElementById('btn-voltar-escala');
    if (btnMensal) btnMensal.style.display = (id === 'escala') ? 'block' : 'none';
    if (btnVoltar) btnVoltar.style.display = (id === 'mensal') ? 'block' : 'none';

    // Atualiza Títulos
    atualizarTitulos(id);
}

function atualizarTitulos(id) {
    const titulos = {
        'inicio': ['Ministério de Comunicações', 'Comunicação, organização e excelência no serviço.'],
        'escala': ['Escala Semanal', 'Equipe técnica para os próximos cultos.'],
        'mensal': ['Escala Mensal Completa', 'Escala técnica completa do mês.'],
        'links': ['Central de Downloads', 'Arquivos e materiais oficiais do ministério.'],
        'mapa-demandas': ['Mapa de Demandas', 'Entenda onde estão as principais demandas.']
    };

    if (titulos[id]) {
        const titleEl = document.getElementById('page-title');
        const subtitleEl = document.getElementById('page-subtitle');
        if (titleEl) titleEl.innerText = titulos[id][0];
        if (subtitleEl) subtitleEl.innerText = titulos[id][1];
    }
}

function validarAcesso() {
    const user = document.getElementById('usuarioInput').value.toLowerCase().trim();
    const pass = document.getElementById('senhaInput').value.toLowerCase().trim();
    const SENHA_CORRETA = "vitorioso";

    if (USUARIOS_PERMITIDOS.includes(user) && pass === SENHA_CORRETA) {
        document.getElementById('modalLogin').style.display = 'none';
        document.getElementById('erroLogin').style.display = 'none';
        
        // Se a memória falhou, o destino padrão é 'links'
        const destino = secaoPendente || 'links';
        executarTrocaDePagina(destino, elementoPendente);

        // Limpa campos
        document.getElementById('usuarioInput').value = "";
        document.getElementById('senhaInput').value = "";
    } else {
        document.getElementById('erroLogin').style.display = 'block';
        document.getElementById('senhaInput').value = "";
    }
}


/* =========================
   CARREGAMENTO DE DADOS
========================= */
async function carregarDados() {
    try {
        const resposta = await fetch('dados.json');
        const dados = await resposta.json();
        ESCALA = dados.escala;
        renderizar();
    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
    }
}

/* =========================
   LÓGICA DE ESCALA
========================= */
function getProximoEvento() {
    const agora = new Date();
    const eventos = ESCALA.map(item => {
        let dataHora = new Date(item.data + "T00:00:00");
        if (item.culto.toLowerCase().includes("manha")) dataHora.setHours(9, 0, 0);
        else if (item.culto.toLowerCase().includes("noite")) dataHora.setHours(18, 0, 0);
        else if (item.culto.toLowerCase().includes("quarta")) dataHora.setHours(19, 0, 0);
        return { ...item, _dataHora: dataHora };
    });

    eventos.sort((a, b) => a._dataHora - b._dataHora);
    return eventos.find(e => e._dataHora >= agora) || eventos[0];
}

function getProximosEventos(qtd = 3) {
    const futuros = ESCALA
        .map(item => ({ ...item, _data: normalizarData(item.data) }))
        .filter(item => item._data >= hoje())
        .sort((a, b) => a._data - b._data);
    return futuros.slice(0, qtd);
}

// Esta função apenas filtra os cards na tela sem mudar de página
function filtrarMembros() {
    const termo = document.getElementById("searchInput").value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const cards = document.querySelectorAll(".card-escala"); // Use a classe correta dos seus cards de nomes

    cards.forEach(card => {
        const nomeCard = card.innerText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (nomeCard.includes(termo)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

// Esta função só é chamada se clicar na lupa ou der Enter (se você configurar o listener)
function buscarPessoa() {
    const nome = document.getElementById("searchInput").value.trim().toUpperCase();
    if (nome) {
        window.location.href = `perfil.html?nome=${nome}`;
    }
}

/* =========================
   RENDERIZAÇÃO
========================= */
function renderizar() {
    const containerSemana = document.getElementById('escala-semanal-container');
    const corpoTabela = document.getElementById('corpo-tabela-mensal');
    const proximo = getProximoEvento();
    const semanaAtual = getProximosEventos(3);

    // Resumos do Topo
    const elTotal = document.getElementById("resumo-total");
    const elCulto = document.getElementById("resumo-culto");
    const elData = document.getElementById("resumo-data");

    if (elTotal) elTotal.innerText = semanaAtual.length;
    if (proximo && elCulto && elData) {
        elCulto.innerText = proximo.culto;
        elData.innerText = formatarData(proximo.data);
    }

    /* CARDS SEMANAIS */
    if (containerSemana) {
        containerSemana.innerHTML = semanaAtual.length ? semanaAtual.map(item => {
            let estilo = ""; 
            let tag = "";

            if (proximo && normalizarData(item.data).getTime() === normalizarData(proximo.data).getTime()) {
                estilo = "border-top: 2px solid #86840f; border-left: 2px solid #86840f;";
                tag = " • PRÓXIMO";
            } else if (ehHoje(item.data)) {
                estilo = "border-top: 2px solid #fff; border-left: 2px solid #fff;";
                tag = " • HOJE";
            } else {
                estilo = "border-top: 1px solid var(--border); border-left: 1px solid var(--border);";
                if (ehPassado(item.data)) estilo += "opacity:0.4;";
            }

            return `
            <div class="escala-card" style="${estilo}">
                <div class="card-header">
                    <span class="turno-badge">${item.culto}${tag}</span>
                    <span class="card-date">${formatarData(item.data)}</span>
                </div>
                <div class="card-body">
                    <div class="role"><span class="role-label">PROJEÇÃO</span><span class="role-name">${item.projecao}</span></div>
                    <div class="role"><span class="role-label">MESA DE SOM</span><span class="role-name">${item.mesaSom}</span></div>
                    <div class="role"><span class="role-label">TRANSMISSÃO</span><span class="role-name">${item.transmissao}</span></div>
                </div>
            </div>`;
        }).join('') : "<p>Nenhuma escala encontrada.</p>";
    }

    /* TABELA MENSAL */
    if (corpoTabela) {
        corpoTabela.innerHTML = ESCALA.map(item => {
            let bgLinha = "transparent";
            if (proximo && normalizarData(item.data).getTime() === normalizarData(proximo.data).getTime()) bgLinha = "rgba(255, 80, 80, 0.08)";
            else if (ehHoje(item.data)) bgLinha = "rgba(255,255,255,0.08)";

            return `
            <tr style="background: ${bgLinha}; ${ehPassado(item.data) ? 'opacity:0.5;' : ''}">
                <td data-label="Data"><strong>${formatarData(item.data)}</strong></td>
                <td data-label="Culto"><span class="turno-badge">${item.culto}</span></td>
                <td data-label="Projeção"><strong>${item.projecao}</strong></td>
                <td data-label="Som"><strong>${item.mesaSom}</strong></td>
                <td data-label="Transmissão"><strong>${item.transmissao}</strong></td>
            </tr>`;
        }).join('');
    }
    renderMapaDemandas();
}

/* =========================
   MAPA DE DEMANDAS
========================= */
function renderMapaDemandas() {
    const mapaTabela = document.getElementById('mapa-demandas-table');
    const demandaTotal = document.getElementById('demanda-total-eventos');
    const demandaFuncoes = document.getElementById('demanda-funcoes');

    if (!mapaTabela) return;

    const contagemPorMembro = {};
    const contagemPorFuncao = { 'Projeção': 0, 'Mesa de Som': 0, 'Transmissão': 0 };

    ESCALA.forEach(item => {
        if (item.projecao) { contagemPorMembro[item.projecao] = (contagemPorMembro[item.projecao] || 0) + 1; contagemPorFuncao['Projeção']++; }
        if (item.mesaSom) { contagemPorMembro[item.mesaSom] = (contagemPorMembro[item.mesaSom] || 0) + 1; contagemPorFuncao['Mesa de Som']++; }
        if (item.transmissao) { contagemPorMembro[item.transmissao] = (contagemPorMembro[item.transmissao] || 0) + 1; contagemPorFuncao['Transmissão']++; }
    });

    mapaTabela.innerHTML = Object.entries(contagemPorMembro)
        .sort((a, b) => b[1] - a[1])
        .map(([nome, total]) => `<tr><td><strong>${nome}</strong></td><td>${total}</td></tr>`).join('') || '<tr><td>Nenhuma demanda.</td></tr>';
    
    if(demandaTotal) demandaTotal.innerText = ESCALA.length;
    if(demandaFuncoes) demandaFuncoes.innerText = `P: ${contagemPorFuncao['Projeção']} · M: ${contagemPorFuncao['Mesa de Som']} · T: ${contagemPorFuncao['Transmissão']}`;
}

/* =========================
   BUSCA E INICIALIZAÇÃO
========================= */
function buscarPessoa() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    const nomeDigitado = input.value.trim();
    if (!nomeDigitado) return;
    const nomeNormalizado = normalizarTexto(nomeDigitado);
    const encontrado = MEMBROS.find(m => normalizarTexto(m) === nomeNormalizado);

    if (!encontrado) {
        input.value = "";
        input.placeholder = "Não encontrado!";
        return;
    }
    window.location.href = `pessoa.html?nome=${encodeURIComponent(encontrado)}`;
}

document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
    
    // Configura clique nos cards de demanda (accordion)
    document.addEventListener('click', function (e) {
        const header = e.target.closest('.demanda-header');
        if (!header) return;
        const cardAtual = header.closest('.demanda-card');
        document.querySelectorAll('.demanda-card').forEach(card => {
            if (card !== cardAtual) card.classList.remove('open');
        });
        cardAtual.classList.toggle('open');
    });

    // Se vier de outra página querendo abrir a escala
    if (sessionStorage.getItem("abrirEscala") === "true") {
        sessionStorage.removeItem("abrirEscala");
        mostrarSecao('escala');
    }

    // Enter na busca
    const inputBusca = document.getElementById("searchInput");
    if (inputBusca) {
        inputBusca.addEventListener("keydown", (e) => {
            if (e.key === "Enter") { e.preventDefault(); buscarPessoa(); }
        });
    }
});

/* =========================
   IMAGEM
========================= */

async function salvarEscalaComoImagem() {
    const area = document.getElementById('capture-area');
    const isMobile = window.innerWidth <= 768;
    const btn = event.currentTarget;
    
    btn.innerText = "Gerando...";
    btn.disabled = true;

    const clone = area.cloneNode(true);

    // Ajuste apenas se for Mobile para manter Data e Dia na mesma linha do card
    if (isMobile) {
        clone.querySelectorAll('tr').forEach(tr => {
            const tds = tr.querySelectorAll('td');
            if (tds.length >= 2) {
                tds[0].style.display = "inline-flex";
                tds[1].style.display = "inline-flex";
                tds[1].style.marginLeft = "15px";
                tds[0].style.whiteSpace = "nowrap";
                tds[1].style.whiteSpace = "nowrap";
            }
        });
    }

    clone.classList.add(isMobile ? "export-mobile" : "export-web");
    clone.style.width = isMobile ? "1450px" : "1300px"; 
    
    clone.style.position = "fixed";
    clone.style.top = "0";
    clone.style.left = "-9999px";
    
    document.body.appendChild(clone);

    await new Promise(resolve => setTimeout(resolve, 300));

    try {
        const canvas = await html2canvas(clone, {
            backgroundColor: "#050507",
            scale: 2,
            useCORS: true
        });

        const link = document.createElement('a');
        link.download = `Escala_${isMobile ? 'Mobile' : 'Web'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (erro) {
        console.error("Erro:", erro);
    } finally {
        document.body.removeChild(clone);
        btn.innerText = "📸 SALVAR COMO IMAGEM";
        btn.disabled = false;
    }
}

/* =========================
   SENHA
========================= */

function toggleSenha() {
    const senhaInput = document.getElementById('senhaInput');
    const toggleIcon = document.getElementById('togglePassword');
    
    if (senhaInput.type === 'password') {
        senhaInput.type = 'text';
        toggleIcon.innerText = '👁️'; // Ícone de macaco ou olho cortado quando visível
    } else {
        senhaInput.type = 'password';
        toggleIcon.innerText = '👁️'; // Ícone de olho quando escondido
    }
}