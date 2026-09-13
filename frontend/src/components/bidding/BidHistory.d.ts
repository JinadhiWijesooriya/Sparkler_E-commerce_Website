export type Bid = {
    user: {
        name?: string;
        email: string;
    };
    amount: number;
    timestamp: string;
};
interface BidHistoryProps {
    bids: Bid[];
    highlightLatest?: boolean;
    winnerBid?: Bid;
    onContactAdmin?: () => void;
}
export default function BidHistory({ bids, highlightLatest, winnerBid, onContactAdmin, }: BidHistoryProps): import("react/jsx-runtime").JSX.Element;
export {};
