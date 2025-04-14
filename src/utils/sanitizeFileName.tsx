export const sanitizeFileName = (fileName: string) => {
    return fileName
        .normalize("NFD") // Remove acentos
        .replace(/[\u0300-\u036f]/g, "") // Remove marcas diacríticas (acentos)
        .replace(/[^a-zA-Z0-9._-]/g, "_") // Substitui caracteres especiais por "_"
        .replace(/\s+/g, "_") // Substitui espaços por "_"
        .toLowerCase(); // Converte para minúsculas
};