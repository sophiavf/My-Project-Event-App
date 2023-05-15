export default async function cleanupOldEvents(db: FirebaseFirestore.Firestore) {
	const cutoff = new Date();
	cutoff.setDate(cutoff.getDate() - 1); // only removes events which happened > 24hrs ago
	const oldEventsQuery = db.collection("events").where("dateTime", "<", cutoff); // gets events which are less than (older than) the cutoff

	const querySnapshot = await oldEventsQuery.get();

	const batch = db.batch();
	querySnapshot.docs.forEach((doc) => batch.delete(doc.ref));

	return batch.commit();
}
