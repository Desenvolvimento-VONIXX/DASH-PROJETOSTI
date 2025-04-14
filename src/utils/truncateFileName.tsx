export const truncateFileName = (fileName: string, maxLength: number = 20) => {
    const parts = fileName.split('.');
    const extension = parts.pop(); // Remover a extensão
    const name = parts.join('.');  // Juntar o nome do arquivo sem a extensão

    // Truncar o nome e adicionar "..." se necessário
    const truncatedName = name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;

    // Retornar o nome truncado com a extensão
    return `${truncatedName}.${extension}`;
};