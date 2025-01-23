import { EmbeddingResponseData, TokenizerResponseData } from "../models/tokenizerRequestModel";
import axios from "axios";


export default class TokenizerService {
    async getTokenized(searchText: string) {
        const response = await axios.post<TokenizerResponseData>('http://localhost:8000/tokenize', JSON.stringify({ "textinp": searchText }));
        console.log('alter data', response.data, typeof response.data);
        const filteredQuery = response.data.result.filter(item => item !== ' ')
        return filteredQuery
    }

    async getEmbedding(searchText: string) {
        const response = await axios.post<EmbeddingResponseData>('http://localhost:8000/embedding', JSON.stringify({ "textinp": searchText }));
        console.log('vector data', response.data, typeof response.data);
        const result = response.data.result
        return result
    }
}