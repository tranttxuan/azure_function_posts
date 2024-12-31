const azurestorage = require("azure-storage");

const table = azurestorage.createTableService("restapixuan", process.env.AZURE_STORAGE_ACCESS_KEY);

const insertEntity = (tableName, entity) => {
    return new Promise((resolve, reject) => {
        table.insertEntity(
        tableName,
        entity,
        { echoContent: true, payloadFormat: "application/json;odata=nometadata" },
        function (error, result, response) {
          if (error) {
            reject(error);
          }
  
          resolve(response.body);
        }
      );
    });
};
  
exports.insertEntity = insertEntity