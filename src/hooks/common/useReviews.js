import { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, query, orderBy } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import { toast } from "react-toastify";
import { getFriendlyErrorMessage } from "../../utils/firebaseErrorHandler.js";

/**
 * useReviews
 * Encapsulates all Firestore operations for the admin Review management page.
 *
 * Returns:
 *   - reviews         : array of all fetched review objects (with `id`)
 *   - products        : map of { productId: productTitle } for name lookup
 *   - loading         : boolean, true while initial fetch is in progress
 *   - deleteReview    : async fn(review) — deletes a review from Firestore and removes it from state
 */
export function useReviews() {
    const [reviews, setReviews] = useState([]);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Build product id → title lookup map
                const productsSnap = await getDocs(collection(fireDB, "products"));
                const productMap = {};
                productsSnap.forEach((d) => {
                    productMap[d.id] = d.data().title || d.id;
                });
                setProducts(productMap);

                // Fetch all reviews, newest first
                const reviewsSnap = await getDocs(
                    query(collection(fireDB, "ratings"), orderBy("createdAt", "desc"))
                );
                const reviewData = reviewsSnap.docs.map((d) => ({
                    id: d.id,
                    ...d.data(),
                }));
                setReviews(reviewData);
            } catch (err) {
                toast.error(getFriendlyErrorMessage(err, "Failed to load reviews."));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const deleteReview = async (review) => {
        if (!review?.id) return;
        try {
            await deleteDoc(doc(fireDB, "ratings", review.id));
            setReviews((prev) => prev.filter((r) => r.id !== review.id));
            toast.success("Review deleted successfully");
        } catch (err) {
            toast.error(getFriendlyErrorMessage(err, "Failed to delete review."));
            throw err; // re-throw so the caller can reset loading state
        }
    };

    return { reviews, products, loading, deleteReview };
}
