import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("A variável de ambiente API_KEY não está definida");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // remove data:mime/type;base64, prefix
            resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
    });
};


export const enhanceImage = async (prompt: string, imageFile: File): Promise<string> => {
    try {
        const base64Data = await fileToBase64(imageFile);

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Data,
                            mimeType: imageFile.type,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const mimeType = part.inlineData.mimeType;
                return `data:${mimeType};base64,${base64ImageBytes}`;
            }
        }

        throw new Error("Nenhuma imagem foi gerada pela API.");
    } catch (error) {
        console.error("Erro ao aprimorar imagem:", error);
        throw new Error("Falha ao aprimorar a imagem. Verifique o console para mais detalhes.");
    }
};

export const generateVideo = async (
    prompt: string, 
    imageFile: File, 
    onProgress: (message: string) => void
): Promise<string> => {
    try {
        const imageBase64 = await fileToBase64(imageFile);
        
        onProgress("Iniciando a geração de vídeo...");
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            image: {
                imageBytes: imageBase64,
                mimeType: imageFile.type,
            },
            config: {
                numberOfVideos: 1,
            }
        });
        
        onProgress("Processamento de vídeo iniciado. Isso pode levar alguns minutos...");
        let checks = 0;
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
            checks++;
            if (checks > 1 && checks <= 5) {
                onProgress(`Gerando quadros... Ainda trabalhando nisso.`);
            } else if (checks > 5) {
                onProgress(`Finalizando o vídeo... Quase lá.`);
            }
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        onProgress("Buscando o vídeo gerado...");
        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
            throw new Error("Geração de vídeo concluída, mas nenhum link para download foi fornecido.");
        }

        // The download link requires the API key
        const videoResponse = await fetch(`${downloadLink}&key=${API_KEY}`);
        if (!videoResponse.ok) {
            throw new Error(`Falha ao baixar o vídeo: ${videoResponse.statusText}`);
        }
        
        const videoBlob = await videoResponse.blob();
        return URL.createObjectURL(videoBlob);
    } catch (error) {
        console.error("Erro ao gerar vídeo:", error);
        throw new Error("Falha ao gerar o vídeo. Verifique o console para mais detalhes.");
    }
};