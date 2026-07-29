interface LeadPayload {
    features: number[];
    threshold?: number;
}

interface ConversionResponse {
    probability: number;
    classification: 'high_intent' | 'low_intent';
}

class ApexApiClient {
    private readonly baseUrl: string;
    private readonly headers: HeadersInit;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    public async evaluateLead(payload: LeadPayload): Promise<ConversionResponse> {
        if (!payload.features || payload.features.length === 0) {
            throw new Error('Features array cannot be empty.');
        }

        const response = await fetch(`${this.baseUrl}/api/v1/convert`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${errorData.detail || response.statusText}`);
        }

        return response.json();
    }
}

const client = new ApexApiClient('http://localhost:8000');
export { client, LeadPayload, ConversionResponse };
