const { app } = require("@azure/functions");
const { updateEntity, queryEntities } = require("../services/tableService");
const azurestorage = require("azure-storage");

async function updatePost(context, req) {
  try {
    if (!req.params) {
      return { body: "Post ID is required", status: 400 };
    }

    const { id } = await req.params;

    if (!id) {
      return { body: "Post ID is required", status: 400 };
    }

    const query = new azurestorage.TableQuery().where(
      "RowKey eq ?",
      id.toString()
    );

    let triggedPost = await queryEntities(
      process.env.AZURE_TABLE_NAME,
      query
    )

    if (triggedPost.value.length == 0) {
      return { body: `Not found post with id ${id}`, status: 400 };
    }

    if (!req.body) {
      return {
        status: 400,
        body: "Please pass a request body",
      };
    }
    const { title, content } = await req.json();
    if (!title && !content) {
      return {
        status: 400,
        body: "Please passe updated title and/or content",
      };
    }

    triggedPost = {
      ...triggedPost.value[0],
      ...(title && { title: title }),
      ...(content && { content: content }),
    };
      

    const updatedPost = await updateEntity(
      process.env.AZURE_TABLE_NAME,
      triggedPost
    );

    return {
      jsonBody: updatedPost.value,
      status: 200,
    };
      
  } catch (error) {
    return { body: error.message, status: 500 };
  }
}

app.http("updatePost", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "post/{id}",
  handler: async (req, context) => {
    return await updatePost(context, req);
  },
});
