import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { descargarHistorial } from '../../services/downloadService';

vi.mock('axios');

vi.mock('../../utils/formatDateDownload', () => ({
    formatDateDownload: () => '2026-01-01_12-00'
}));

describe('downloadService', () => {
    // Guardamos las implementaciones originales para restaurarlas después
    const originalCreateObjectURL = global.URL.createObjectURL;
    const originalRevokeObjectURL = global.URL.revokeObjectURL;

    beforeEach(() => {
        vi.clearAllMocks();
        // Simulamos la creación de URLs de blob
        global.URL.createObjectURL = vi.fn(() => 'blob:http://localhost/fake-url');
        global.URL.revokeObjectURL = vi.fn();
    });

    afterEach(() => {
        global.URL.createObjectURL = originalCreateObjectURL;
        global.URL.revokeObjectURL = originalRevokeObjectURL;
    });

    it('debe descargar el archivo correctamente', async () => {
        axios.get.mockResolvedValue({ data: new Blob(['fake content']) });

        // Espiamos el elemento <a> para verificar que se le asignen los atributos
        const linkSpy = { click: vi.fn(), remove: vi.fn(), href: '', download: '' };
        vi.spyOn(document, 'createElement').mockReturnValue(linkSpy);
        vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});

        await descargarHistorial(123, 'pdf');

        // 1. Verificamos la llamada a la API con responseType: blob (CRÍTICO)
        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining('/historial/pdf/123'),
            expect.objectContaining({ responseType: 'blob' })
        );
        
        // 2. Verificamos manipulación del DOM
        expect(document.createElement).toHaveBeenCalledWith('a');
        expect(linkSpy.download).toContain('historial_123'); 
        expect(linkSpy.click).toHaveBeenCalled(); 
        
        // 3. Verificamos limpieza de memoria
        expect(global.URL.revokeObjectURL).toHaveBeenCalled(); 
    });

    it('debe manejar errores sin romper la app', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        axios.get.mockRejectedValue(new Error('Download failed'));

        await descargarHistorial(123, 'pdf');

        expect(consoleSpy).toHaveBeenCalledWith("Error descargando historial:", expect.any(Error));
    });
});