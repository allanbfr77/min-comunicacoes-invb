let ESCALA = [];

const MEMBROS = [
    "ALAN", "BIANCA", "JEAN", "MEDEIROS",
    "LUCIANA", "ANNA BEATRIZ", "JOÃO"
];

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

async function carregarDados() {
    try {
        const resposta = await fetch('dados.json');
        if (!resposta.ok) throw new Error('Falha ao carregar dados.json');
        const dados = await resposta.json();
        ESCALA = Array.isArray(dados) ? dados : dados.escala;
        renderizar();
    } catch (erro) {
        console.error("Erro ao carregar escala:", erro);
    }
}

function getProximoEvento() {
    const agora = new Date();
    const eventos = ESCALA.map(item => {
        const dataHora = new Date(item.data + "T00:00:00");
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

function filtrarMembros() {
    // Mantido por compatibilidade com markup antigo.
    // A busca agora só abre o perfil via lupa/Enter, sem filtrar cards.
}

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

function renderizar() {
    const containerSemana = document.getElementById('escala-semanal-container');
    const corpoTabela = document.getElementById('corpo-tabela-mensal');
    const proximo = getProximoEvento();
    const semanaAtual = getProximosEventos(3);

    const elTotal = document.getElementById("resumo-total");
    const elCulto = document.getElementById("resumo-culto");
    const elData = document.getElementById("resumo-data");

    if (elTotal) elTotal.innerText = semanaAtual.length;
    if (proximo && elCulto && elData) {
        elCulto.innerText = proximo.culto;
        elData.innerText = formatarData(proximo.data);
    }

    if (containerSemana) {
        if (semanaAtual.length) {
            containerSemana.innerHTML = semanaAtual.map((item) => {
                let estiloExtra = "";
                let tag = "";
                if (proximo && normalizarData(item.data).getTime() === normalizarData(proximo.data).getTime()) {
                    estiloExtra = "border-top: 2px solid #86840f; border-left: 2px solid #86840f;";
                    tag = " • PRÓXIMO";
                } else if (ehHoje(item.data)) {
                    estiloExtra = "border-top: 2px solid #fff; border-left: 2px solid #fff;";
                    tag = " • HOJE";
                } else if (ehPassado(item.data)) {
                    estiloExtra = "opacity: 0.4;";
                }

                return `
                <div class="escala-card hidden-element card-escala" style="${estiloExtra}">
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
            }).join('');

            setTimeout(() => {
                const cards = containerSemana.querySelectorAll('.escala-card');
                cards.forEach((card, i) => {
                    setTimeout(() => card.classList.add('show-element'), i * 150);
                });
            }, 100);
        } else {
            containerSemana.innerHTML = "<p>Nenhuma escala encontrada.</p>";
        }
    }

    if (corpoTabela) {
        corpoTabela.innerHTML = ESCALA.map(item => {
            let bgLinha = "transparent";
            if (proximo && normalizarData(item.data).getTime() === normalizarData(proximo.data).getTime()) {
                bgLinha = "rgba(255, 255, 0, 0.05)";
            } else if (ehHoje(item.data)) {
                bgLinha = "rgba(255, 255, 255, 0.05)";
            }

            return `
            <tr style="background: ${bgLinha}; ${ehPassado(item.data) ? 'opacity:0.5;' : ''}">
                <td data-label="Data"><strong>${formatarData(item.data)}</strong></td>
                <td data-label="Culto"><span class="turno-badge">${item.culto}</span></td>
                <td data-label="Projeção"><strong>${item.projecao}</strong></td>
                <td data-label="Mesa de Som"><strong>${item.mesaSom}</strong></td>
                <td data-label="Transmissão"><strong>${item.transmissao}</strong></td>
            </tr>`;
        }).join('');
    }
}

async function salvarEscalaComoImagem(event) {
    const area = document.getElementById('capture-area');
    const isMobile = window.innerWidth <= 768;
    if (!area) return;

    const btn = event.currentTarget || event.target;
    if (btn.disabled) return;

    btn.style.opacity = "0.5";
    btn.disabled = true;

    const clone = area.cloneNode(true);

    if (isMobile) {
        clone.querySelectorAll('tr').forEach(tr => {
            const tds = tr.querySelectorAll('td');
            if (tds.length >= 2) {
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

        const dataUrl = canvas.toDataURL('image/png');
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        if (isSafari) {
            const novaAba = window.open();
            novaAba.document.write(`
                <html>
                  <head><title>Salvar Escala</title></head>
                  <body style="margin:0;background:#000;display:flex;flex-direction:column;
                               align-items:center;padding:20px;font-family:sans-serif;">
                    <p style="color:#fff;margin-bottom:12px;">
                      Pressione e segure a imagem para salvá-la
                    </p>
                    <img src="${dataUrl}" style="max-width:100%;border-radius:8px;" />
                  </body>
                </html>
            `);
        } else {
            const link = document.createElement('a');
            link.download = `Escala_${isMobile ? 'Mobile' : 'Web'}.png`;
            link.href = dataUrl;
            link.click();
        }
    } catch (erro) {
        console.error("Erro ao gerar imagem:", erro);
        alert("Não foi possível gerar a imagem. Tente novamente.");
    } finally {
        document.body.removeChild(clone);
        btn.style.opacity = "1";
        btn.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
    const inputBusca = document.getElementById("searchInput");
    if (inputBusca) {
        inputBusca.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                buscarPessoa();
            }
        });
    }
});

window.filtrarMembros = filtrarMembros;
window.buscarPessoa = buscarPessoa;
window.salvarEscalaComoImagem = salvarEscalaComoImagem;
