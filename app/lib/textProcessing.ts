export function separateWords(text: string): string {
    // Lista de palavras curtas que não devem ser separadas
    const shortWords = ['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al', 'a', 'en', 'con', 'por', 'para'];
    
    // Remove a numeração do início das opções
    let processed = text.replace(/^\d+\.\s*/, '');
    
    // Separa palavras muito longas
    processed = processed.replace(/(\w{15})(\w)/g, '$1 $2');
    
    // Adiciona espaços após pontuação se não houver
    processed = processed.replace(/([.,!?;:])([^\s])/g, '$1 $2');
    
    // Adiciona espaços antes de maiúsculas se não houver
    processed = processed.replace(/([a-záéíóúñü])([A-ZÁÉÍÓÚÑÜ])/g, '$1 $2');
    
    // Separa números de letras
    processed = processed.replace(/(\d)([a-zA-ZáéíóúñüÁÉÍÓÚÑÜ])|([a-zA-ZáéíóúñüÁÉÍÓÚÑÜ])(\d)/g, '$1$3 $2$4');
    
    // Remove espaços extras
    processed = processed.replace(/\s+/g, ' ').trim();
    
    // Garante que palavras curtas não sejam separadas
    shortWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        processed = processed.replace(regex, word.replace(/\s/g, ''));
    });
    
    return processed;
}