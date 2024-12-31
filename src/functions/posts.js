const { app } = require("@azure/functions");
const { insertEntity } = require("../services/tableService");
const { v6: uuidv6 } = require("uuid");

async function createPost(context, req) {
  try {
    if (!req.body) {
      return {
        status: 400,
        body: "Please pass a request body ",
      };
    }
    const { blog, title, content } = await req.json();
    if (!blog || !title || !content) {
      return {
        status: 400,
        body: "Please check required blog, title and content",
      };
    }

    const blogEntity = {
      PartitionKey: blog,
      RowKey: uuidv6(),
      title: title,
      content: content,
    };

    const createdBlog = await insertEntity("Posts", blogEntity);

    return { blog: blogEntity, status: 200 };
  } catch (error) {
    return { body: error.message, status: 500 };
  }
}

app.http("createPost", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (req, context) => {
    return await createPost(context, req);
  },
});
