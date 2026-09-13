export interface SubscribePayload {
    phone_number: string;
    consent: boolean;
}
export interface SubscribeResponse {
    message: string;
}
export declare function subscribeToPromotions(data: SubscribePayload): Promise<SubscribeResponse>;
