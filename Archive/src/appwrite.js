import {Client, Databases, ID, Query} from 'appwrite';

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const APPWRITE_ENDPOINT  = import.meta.env.VITE_APPWRITE_ENDPOINT;

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(PROJECT_ID)

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
    const term = (searchTerm || '').trim();
    if (!term) return;
    // 1. Use APPWRITE SDK to check if the searchTerm exists in the database
    try{
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal('searchTerm',term)])
        // 2. If exists then update the count
        if (result.documents.length > 0) {
            const doc = result.documents[0];

            await database.updateDocument(DATABASE_ID,COLLECTION_ID,doc.$id, {
                count: doc.count + 1,
            })
        }
        // 3. Else create a new entry with the searchTerm and count as 1
        else{
            await database.createDocument(DATABASE_ID,COLLECTION_ID,ID.unique(),{
                searchTerm:searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            })
        }
    } catch (e){
        console.error(e);
    }


}

export const getTrending = async () => {
    try{
        const doc = await database.listDocuments({
            databaseId:DATABASE_ID,
            collectionId:COLLECTION_ID,
            queries:[Query.orderDesc("count"), Query.limit(7)]
        });
        if (!doc){
            throw new Error('Nothing on the list');
        }
        else{
            return doc.documents;
        }

    } catch(e){
        console.error(e);
    }
}