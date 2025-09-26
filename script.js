document.addEventListener('DOMContentLoaded', () => {

    const saveBtn = document.getElementById('save-btn');
    const loadBtn = document.getElementById('load-btn');
    const fileInput = document.getElementById('file-input');
    const pdfBtn = document.getElementById('pdf-btn');
    const clearBtn = document.getElementById('clear-btn');
    const currentDateEl = document.getElementById('current-date');

    // --- FUNCIONES PRINCIPALES ---

    /**
     * Guarda todo el contenido editable en un archivo JSON.
     */
    const guardarDocumento = () => {
        try {
            const data = {
                timestamp: new Date().toISOString(),
                content: {}
            };
            
            // Usamos selectores únicos para cada elemento editable
            document.querySelectorAll('[contenteditable="true"]').forEach((el, index) => {
                // Creamos un ID único para cada elemento para poder restaurarlo después
                const uniqueId = el.tagName + '-' + index;
                data.content[uniqueId] = el.innerHTML;
            });

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `guia_supervision_${new Date().toISOString().slice(0,10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert('✅ Documento guardado correctamente.');

        } catch (error) {
            console.error('Error al guardar:', error);
            alert('❌ Error al guardar el documento.');
        }
    };

    /**
     * Carga y restaura el contenido desde un archivo JSON.
     * @param {Event} event - El evento del input de archivo.
     */
    const cargarDocumento = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data && data.content) {
                    const editables = document.querySelectorAll('[contenteditable="true"]');
                    Object.keys(data.content).forEach((key, index) => {
                        if (editables[index]) {
                            editables[index].innerHTML = data.content[key];
                        }
                    });
                    alert('✅ Documento cargado correctamente.');
                } else {
                    alert('❌ Archivo JSON no válido.');
                }
            } catch (error) {
                console.error('Error al cargar y parsear el archivo:', error);
                alert('❌ Error al leer el archivo. Asegúrese de que sea un JSON válido.');
            }
        };
        reader.readAsText(file);
    };

    /**
     * Exporta el contenedor del documento a un archivo PDF.
     */
    const exportarPDF = () => {
        alert('📄 Se iniciará la generación del PDF. Esto puede tardar unos segundos...');
        const element = document.getElementById('document-to-export');
        const opt = {
            margin:       0.5,
            filename:     'guia_supervision_energetica.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        // html2pdf es la función de la librería que importamos en el HTML
        html2pdf().set(opt).from(element).save();
    };

    /**
     * Limpia todos los campos editables, pidiendo confirmación primero.
     */
    const limpiarDocumento = () => {
        if (confirm('¿Está seguro de que desea limpiar todos los campos editables? Esta acción no se puede deshacer.')) {
            document.querySelectorAll('[contenteditable="true"]').forEach(editable => {
                // No limpiar cabeceras de tabla
                if (editable.tagName !== 'TH') {
                    editable.innerHTML = '[...]';
                }
            });
            alert('🗑️ Campos limpiados.');
        }
    };

    // --- INICIALIZACIÓN Y EVENT LISTENERS ---

    // Establecer fecha actual
    currentDateEl.textContent = new Date().toLocaleDateString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    // Asignar eventos a los botones
    saveBtn.addEventListener('click', guardarDocumento);
    pdfBtn.addEventListener('click', exportarPDF);
    clearBtn.addEventListener('click', limpiarDocumento);
    
    loadBtn.addEventListener('click', () => fileInput.click()); // Abre el selector de archivos
    fileInput.addEventListener('change', cargarDocumento);

    console.log('✅ Documento editable cargado y listo.');
});