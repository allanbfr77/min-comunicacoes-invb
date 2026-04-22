function initDownloads() {
    const cards = document.querySelectorAll('.card-download');
    cards.forEach((card) => {
        const titulo = card.querySelector('.info-download h4')?.textContent?.trim() || 'Arquivo';
        const descricao = card.querySelector('.info-download p')?.textContent?.trim() || '';
        const link = card.querySelector('.btn-baixar');
        if (!link) return;

        link.setAttribute('aria-label', `Baixar ${titulo}. ${descricao}`);
        link.setAttribute('rel', 'noopener');
    });
}

document.addEventListener('DOMContentLoaded', initDownloads);
