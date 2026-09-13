declare const api: import("axios").AxiosInstance;
export interface User {
    email: string;
    name?: string;
}
export interface Bid {
    user: User;
    amount: number;
    timestamp: string;
}
export interface AuctionItem {
    id: number;
    name: string;
    image: string;
    description: string;
    starting_price: number;
    current_bid: number;
    bid_increment: number;
    end_time: string;
    time_left: number;
    ending_price?: number;
    is_active?: boolean;
    bids: Bid[];
}
export interface AuctionPageBackground {
    image: string;
}
export interface BidHistoryBid {
    user: {
        name: string;
        email: string;
    };
    amount: number;
    timestamp: string;
}
export interface AuctionItemUI extends AuctionItem {
    bids: BidHistoryBid[];
}
export declare const secondsToHMS: (seconds: number) => {
    h: number;
    m: number;
    s: number;
};
export declare const getAuctions: () => Promise<AuctionItemUI[]>;
export declare const getAuctionById: (id: number) => Promise<AuctionItemUI>;
export declare const placeBid: (auctionId: number, amount: number) => Promise<BidHistoryBid>;
export declare const getAuctionPageBackground: () => Promise<string | null>;
export default api;
