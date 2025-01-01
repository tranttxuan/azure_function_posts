const { app } = require("@azure/functions");
const { queryEntities } = require("../services/tableService");
const azurestorage = require("azure-storage");

async function getAllPosts(context, req) {
  try {
    if (!req.params) {
      return { body: "Blog is required", status: 400 };
    }

    const { blog } = await req.params;

    if (!blog) {
      return { body: "Blog is required", status: 400 };
    }

    const query = new azurestorage.TableQuery()
      .where("PartitionKey eq ?", blog)

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


app.http("getAllPosts", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "post/{blog}",
  handler: async (req, context) => {
    return await getAllPosts(context, req);
  },
});
