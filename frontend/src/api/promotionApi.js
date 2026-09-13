// Replace this with your Django backend URL
const BASE_URL = "http://127.0.0.1:8000/api/promotions";
export async function subscribeToPromotions(data) {
    try {
        const response = await fetch(`${BASE_URL}/subscribe/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }
        const result = await response.json();
        return result;
    }
    catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}
