require('dotenv').config();
const { Firestore } = require('@google-cloud/firestore');

async function storeData(id, data) {
 try {
   const db = new Firestore({
     projectId: process.env.PROJECT_ID,
     databaseId: process.env.DATABASE_ID
   });
   
   const predictCollection = db.collection('predictions');
   
   if (!id || !data) {
     throw new Error('Data tidak valid');
   }
   
   const storeDataFormat = {
     id: id,
     result: data.result,
     suggestion: data.suggestion,
     createdAt: data.createdAt
   };
   
   await predictCollection.doc(id).set(storeDataFormat);
   console.log('Data berhasil disimpan');
   return true;
 } catch (error) {
   console.error('Detail Error:', error);
   throw error;
 }
}

module.exports = storeData;