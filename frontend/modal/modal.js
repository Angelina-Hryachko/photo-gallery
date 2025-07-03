function showModal({ title = 'Default message', message, buttonColor = '#cc3300' }) {
    const existing = document.getElementById('customModal')
    if (existing) existing.remove()
        
    const modal = document.createElement('div')
    modal.id = `customModal`
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <h3>${title}</h3>
            <p>${message ?? ''}</p>
            <button id="closeModalBtn" style="background-color: ${buttonColor};">OK</button>
        </div>
    `
    
    document.body.appendChild(modal)

    document.getElementById('closeModalBtn').addEventListener('click', () => modal.remove())
}

$.modal = showModal