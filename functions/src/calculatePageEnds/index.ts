import { Firestore } from "firebase-admin/firestore";
import { eventsRef } from "../index";

export default async function calculatePageEnds(adminDb: Firestore) {
	const pageEndsRef = adminDb.collection("paginationSnapshots");

	const eventsPerPage = 20;
	let currentPage = 1;
	try {
		while (true) {
			// Query for 20th document
			let query = eventsRef
				.orderBy("dateTime")
				.offset((currentPage - 1) * eventsPerPage + (eventsPerPage - 1))
				.limit(1);

			const eventsSnapshot = await query.get();
			if (eventsSnapshot.empty) {
				// break check when there are no more documents
				break;
			}
			// get the last document
			// Since .limit(1) was used, eventsSnapshot will contain only one document,
			const lastVisible = eventsSnapshot.docs[0];
			//store page end in firestore
			const data = { page: currentPage, endDocId: lastVisible.id };
			await pageEndsRef.doc(`page${currentPage}`).set(data);
			currentPage++;
		}

		// delete any unneccessary pages which may be in the database, if there were previously more events
		let extraPage = currentPage;
		while (true) {
			const extraPageDoc = await pageEndsRef.doc(`page${extraPage}`).get();
			if (extraPageDoc.exists) {
				await pageEndsRef.doc(`page${extraPage}`).delete();
				extraPage++;
			} else {
				break;
			}
		}
	} catch (error) {
		console.error("Error calculate page ends: ", error);
	}
}
