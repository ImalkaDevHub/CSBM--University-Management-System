const { MongoClient } = require('mongodb');

async function run() {
    const client = new MongoClient('mongodb://localhost:27017');
    try {
        await client.connect();
        const adminDb = client.db().admin();
        const dbs = await adminDb.listDatabases();
        console.log('Databases:', dbs.databases.map(d => d.name));

        for (const dbInfo of dbs.databases) {
            const dbName = dbInfo.name;
            if (['admin', 'config', 'local'].includes(dbName)) continue;

            const db = client.db(dbName);
            const collections = await db.listCollections().toArray();
            console.log(`\nCollections in [${dbName}]:`, collections.map(c => c.name));

            for (const col of collections) {
                const count = await db.collection(col.name).countDocuments();
                console.log(`  - ${col.name}: ${count} docs`);

                if (col.name.toLowerCase().includes('user')) {
                    const doc = await db.collection(col.name).findOne();
                    if (doc) {
                        console.log(`    Sample from ${dbName}.${col.name}:`, doc);
                    }
                }
            }
        }
    } finally {
        await client.close();
    }
}

run().catch(console.error);
