let moduleConnector = require("module-connector");
let nano = require('nano');

class CouchDBServices {
    constructor(objectModel) {
        this.dbType = objectModel.dbType;
        this.dbPass = objectModel.dbPass;
        this.dbUser = objectModel.dbUser;
        this.dbHost = objectModel.dbHost;
        this.dbPort = objectModel.dbPort;
        this.dbName = objectModel.dbName;
        this.dbEndpoint = objectModel.dbEndpoint;
        this.dbSchema = objectModel.dbSchema;
        this.dbTable = objectModel.dbTable;
        this.conString = [
            `DATABASE=${this.dbName}`,
            `HOSTNAME=${this.dbHost}`,
            `UID=${this.dbUser}`,
            `PWD=${this.dbPass}`,
            `PORT=${this.dbPort}`,
            `PROTOCOL=TCPIP`,
        ].join(";");
    };


}

CouchDBServices.prototype.createDabase = async function(strDatabaseName) {
    let output = new moduleConnector();
    try {
        let couchInstance = nano(this.dbEndpoint);
        let createDB = await couchInstance.db.create(strDatabaseName);
        output.ok(createDB);

    } catch (error) {
        console.error(error);

    } finally {
        return output;
    }
};

CouchDBServices.prototype.get = async function(idDoc) {
    let output = new moduleConnector();
    try {
        let couchInstance = nano(this.dbEndpoint);
        let couchDB = couchInstance.use(this.dbTable);
        let doc = await couchDB.get(idDoc);
        output.ok(doc);

    } catch (error) {
        console.error(error);

    } finally {
        return output;
    }
};

CouchDBServices.prototype.getAll = async function(arrayQuery = { mangoQuery: { selector: {}, limit: 1000 } }, arrayIndex = false) {
    let output = new moduleConnector();
    try {
        let couchInstance = nano(this.dbEndpoint);
        let couchDB = couchInstance.use(this.dbTable);
        if (arrayIndex) {
            await couchDB.createIndex(arrayIndex);
        }
        var arrayDocs = await couchDB.find(arrayQuery.mangoQuery)
        output.ok(arrayDocs, "couch_getAll_response");

    } catch (error) {
        console.error(error);

    } finally {
        return output;
    }

};

CouchDBServices.prototype.create = async function(newDoc) {
    let output = new moduleConnector();
    try {
        let couchInstance = nano(this.dbEndpoint);
        let couchDB = couchInstance.use(this.dbTable);
        var postNewDoc = await couchDB.insert(newDoc);
        output.ok(postNewDoc, "couch_update_response");

    } catch (error) {
        console.error(error);

    } finally {
        return output;
    }
};

CouchDBServices.prototype.update = async function(doc) {
    let output = new moduleConnector();
    try {
        let couchInstance = nano(this.dbEndpoint);
        let couchDB = couchInstance.use(this.dbTable);
        let postNewDoc = await couchDB.insert(doc);
        output.ok(postNewDoc, "couch_update_response");

    } catch (error) {
        console.error(error);

    } finally {
        return output;
    }
};

CouchDBServices.prototype.delete = async function(doc) {
    let output = new moduleConnector();
    try {
        let couchInstance = nano(this.dbEndpoint);
        let couchDB = couchInstance.use(this.dbTable);
        let postNewDoc = await couchDB.destroy(doc._id, doc._rev);
        output.ok(postNewDoc, "couch_delete_response");

    } catch (error) {
        console.error(error);

    } finally {
        return output;
    }

};

CouchDBServices.prototype.view = async function(designname, viewname, params) {
    let output = new moduleConnector();
    try {
        let couchInstance = nano(this.dbEndpoint);
        let couchDB = couchInstance.use(this.dbTable);
        let doc = await couchDB.view(designname, viewname, params);
        if (doc && doc.rows && doc.rows.length) {
            let docs = doc.rows;
            output.ok({ docs });
        } else {
            output.ok(doc);
        }

    } catch (error) {
        console.error(error);

    } finally {
        return output;
    }
};

CouchDBServices.prototype.bulk = async function(arrayDocs) {
    let output = new moduleConnector();
    try {
        let couchInstance = nano(this.dbEndpoint);
        let couchDB = couchInstance.use(this.dbTable);
        let postNewDoc = await couchDB.bulk({ docs: arrayDocs });
        output.ok(postNewDoc, "couch_bulk_response");

    } catch (error) {
        console.error(error);

    } finally {
        return output;
    }
};

module.exports = CouchDBServices;