const { app } = require("@azure/functions");
const { queryEntities } = require("../services/tableService");
const azurestorage = require("azure-storage");

async function getPost(context, req) {
  try {
    if (!req.params) {
      return { body: "Blog and Post ID are required", status: 400 };
    }

    const { blog, id } = await req.params;

    if (!blog || !id) {
      return { body: "Blog and Post ID are required", status: 400 };
    }

    const query = new azurestorage.TableQuery()
      .where("PartitionKey eq ?", blog)
      .and("RowKey eq ?", id.toString());

    const triggedPost = await queryEntities(
      process.env.AZURE_TABLE_NAME,
      query
    );

    return {
      jsonBody: triggedPost.value,
      status: 200,
    };
  } catch (error) {
    return { body: error.message, status: 500 };
  }
}

app.http("getPost", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "post/{blog}/{id}",
  handler: async (req, context) => {
    return await getPost(context, req);
  },
});
