const { Firestore } = require('@google-cloud/firestore');

async function storeData(id, data) {
    const db = new Firestore();
    try {
        const predictCollection = db.collection('prediction');
        await predictCollection.doc(id).set(data);
        console.log(`Data stored with ID: ${id}`);
    } catch (error) {
        console.error(`Failed to store data: ${error.message}`);
        throw new Error('Error while storing data');
    }
}

module.exports = storeData;
